-- 0003_functions.sql
-- Funções do Arremate (Security Definer) no Postgres

-- 1. Enviar ou Atualizar Lance (RN06, RN07, RN09, RN11)
create or replace function public.rpc_place_bid(
  p_request_id uuid,
  p_valor_centavos int,
  p_prazo_dias int,
  p_inclui text[],
  p_mensagem text,
  p_validade_dias int default 30
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_provider_id uuid;
  v_provider_status text;
  v_req record;
  v_bid_id uuid;
  v_valor_antigo int;
  v_min_reducao int;
  v_em_revisao boolean := false;
  v_restante interval;
begin
  -- Identifica o fornecedor pelo usuário autenticado
  select id, status into v_provider_id, v_provider_status
  from public.providers
  where profile_id = auth.uid();

  if v_provider_id is null then
    raise exception 'Perfil de fornecedor não encontrado.';
  end if;

  if v_provider_status != 'verificado' then
    raise exception 'Apenas fornecedores verificados podem enviar lances (RN05).';
  end if;

  -- Busca o pedido
  select * into v_req
  from public.requests
  where id = p_request_id;

  if v_req.id is null or v_req.status != 'aberto' or now() > v_req.fecha_em then
    raise exception 'Este leilão não está aberto para lances.';
  end if;

  -- RN04: teto visível rejeita lance acima
  if v_req.teto_visivel and p_valor_centavos > v_req.teto_centavos then
    raise exception 'O valor do lance não pode exceder o orçamento máximo visível (RN04).';
  end if;

  -- RN07: validações mínimas
  if array_length(p_inclui, 1) is null or array_length(p_inclui, 1) < 1 then
    raise exception 'Informe pelo menos um item incluso no lance (RN07).';
  end if;

  if length(p_mensagem) > 300 then
    raise exception 'A mensagem pode ter no máximo 300 caracteres (RN07).';
  end if;

  -- RN11: Lance anômalo (< 50% do teto)
  if p_valor_centavos < (v_req.teto_centavos * 0.5) then
    v_em_revisao := true;
  end if;

  -- Checa se já existe lance desse fornecedor
  select id, valor_centavos into v_bid_id, v_valor_antigo
  from public.bids
  where request_id = p_request_id and provider_id = v_provider_id;

  if v_bid_id is not null then
    -- RN06: Redução mínima R$ 10 (1000 centavos) ou 1%
    v_min_reducao := greatest(1000, ceil(v_valor_antigo * 0.01));
    if p_valor_centavos >= v_valor_antigo then
      raise exception 'O lance só pode ser reduzido, nunca aumentado (RN06).';
    end if;
    if (v_valor_antigo - p_valor_centavos) < v_min_reducao then
      raise exception 'Redução mínima não atingida. Reduza pelo menos R$ % (RN06).', (v_min_reducao / 100.0);
    end if;

    -- Atualiza lance e grava revisão
    update public.bids
    set valor_centavos = p_valor_centavos,
        prazo_dias = p_prazo_dias,
        inclui = p_inclui,
        observacoes = p_mensagem,
        em_revisao = v_em_revisao,
        created_at = now()
    where id = v_bid_id;

    insert into public.bid_revisions (bid_id, valor_anterior_centavos, valor_novo_centavos)
    values (v_bid_id, v_valor_antigo, p_valor_centavos);
  else
    -- Novo lance
    insert into public.bids (
      request_id, provider_id, valor_centavos, prazo_dias, inclui, observacoes, validade_ate, em_revisao
    )
    values (
      p_request_id, v_provider_id, p_valor_centavos, p_prazo_dias, p_inclui, p_mensagem,
      now() + (p_validade_dias || ' days')::interval, v_em_revisao
    )
    returning id into v_bid_id;
  end if;

  -- RN09: Anti-sniping (últimos 5 minutos estende 5 min, máx 3 vezes)
  v_restante := v_req.fecha_em - now();
  if v_restante > interval '0 seconds' and v_restante <= interval '5 minutes' and v_req.extensoes < 3 then
    update public.requests
    set fecha_em = fecha_em + interval '5 minutes',
        extensoes = extensoes + 1
    where id = p_request_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'bid_id', v_bid_id,
    'em_revisao', v_em_revisao
  );
end;
$$;

-- 2. Retornar Posição do Fornecedor sem vazar concorrentes (RN08)
create or replace function public.rpc_get_provider_position(p_request_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_provider_id uuid;
  v_my_valor int;
  v_posicao int;
  v_total int;
begin
  select id into v_provider_id from public.providers where profile_id = auth.uid();
  if v_provider_id is null then
    return jsonb_build_object('ok', false, 'message', 'Não é fornecedor');
  end if;

  select valor_centavos into v_my_valor
  from public.bids
  where request_id = p_request_id and provider_id = v_provider_id;

  if v_my_valor is null then
    return jsonb_build_object('ok', true, 'tem_lance', false);
  end if;

  select count(*) into v_total from public.bids where request_id = p_request_id and status = 'ativo';
  select count(*) + 1 into v_posicao
  from public.bids
  where request_id = p_request_id and status = 'ativo' and valor_centavos < v_my_valor;

  return jsonb_build_object(
    'ok', true,
    'tem_lance', true,
    'posicao', v_posicao,
    'total', v_total
  );
end;
$$;

-- 3. Arrematar / Aceitar Lance (RN12)
create or replace function public.rpc_accept_bid(p_bid_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_bid record;
  v_req record;
  v_contract_id uuid;
begin
  select * into v_bid from public.bids where id = p_bid_id;
  if v_bid.id is null then raise exception 'Lance não encontrado.'; end if;

  select * into v_req from public.requests where id = v_bid.request_id;
  if v_req.customer_id != auth.uid() then
    raise exception 'Apenas o cliente dono do pedido pode arrematar.';
  end if;

  if v_req.status != 'aberto' then
    raise exception 'Este leilão não está mais aberto.';
  end if;

  -- Cria contrato simples
  insert into public.contracts (
    request_id, bid_id, customer_id, provider_id, valor_centavos
  )
  values (
    v_req.id, v_bid.id, v_req.customer_id, v_bid.provider_id, v_bid.valor_centavos
  )
  returning id into v_contract_id;

  -- Atualiza o lance vencedor e recusa os demais (RN12)
  update public.bids set status = 'aceito' where id = v_bid.id;
  update public.bids set status = 'recusado' where request_id = v_req.id and id != v_bid.id;

  -- Fecha pedido como contratado
  update public.requests set status = 'contratado' where id = v_req.id;

  -- Registra auditoria
  insert into public.audit_log (ator_id, entidade, entidade_id, acao, depois)
  values (auth.uid(), 'contracts', v_contract_id, 'arremate_realizado', jsonb_build_object('bid_id', v_bid.id, 'valor', v_bid.valor_centavos));

  return jsonb_build_object('ok', true, 'contract_id', v_contract_id);
end;
$$;

-- 4. Job de Rotina por Minuto: Fechamento e Ampliação de Raio (RN16)
create or replace function public.rpc_cron_tick()
returns void
language plpgsql
security definer
as $$
begin
  -- 1. Encerra leilões vencidos
  update public.requests
  set status = 'encerrado'
  where status = 'aberto' and fecha_em <= now();

  -- 2. RN16: Sem lance com 50% do prazo decorrido -> amplia raio
  update public.requests
  set raio_ampliado = true
  where status = 'aberto'
    and raio_ampliado = false
    and (abre_em + ((fecha_em - abre_em) / 2)) <= now()
    and not exists (select 1 from public.bids where request_id = requests.id);
end;
$$;
