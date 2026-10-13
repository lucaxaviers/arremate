"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/lib/store";
import { INITIAL_CATEGORIES } from "@/lib/mock-data";
import { canOpenRequest, canPublishAnother, allowedDurations, type DurationH } from "@/lib/domain/rules";
import { maskBRL } from "@/lib/masks";

const DRAFT_KEY = "arremate_request_draft_v1";

export default function NovoPedidoPage() {
  const router = useRouter();
  const store = useAppStore();
  const { success, error: toastError } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // Form State
  const [categoria, setCategoria] = useState("buffet");
  const [titulo, setTitulo] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [cidade, setCidade] = useState("Paulínia");
  const [quantidade, setQuantidade] = useState<number>(120);
  const [descricao, setDescricao] = useState("");
  const [tetoInput, setTetoInput] = useState("15.000");
  const [tetoVisivel, setTetoVisivel] = useState(true);
  const [duracaoH, setDuracaoH] = useState<number>(48);

  // Carrega rascunho salvo do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.categoria) setCategoria(d.categoria);
        if (d.titulo) setTitulo(d.titulo);
        if (d.dataEvento) setDataEvento(d.dataEvento);
        if (d.cidade) setCidade(d.cidade);
        if (d.quantidade) setQuantidade(d.quantidade);
        if (d.descricao) setDescricao(d.descricao);
        if (d.tetoInput) setTetoInput(d.tetoInput);
        if (d.tetoVisivel !== undefined) setTetoVisivel(d.tetoVisivel);
        if (d.duracaoH) setDuracaoH(d.duracaoH);
      }
    } catch {}
  }, []);

  // Salva rascunho automaticamente a cada mudança
  function saveDraft() {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          categoria,
          titulo,
          dataEvento,
          cidade,
          quantidade,
          descricao,
          tetoInput,
          tetoVisivel,
          duracaoH,
        })
      );
      success("Rascunho salvo com sucesso.");
    } catch {}
  }

  function handleStep1() {
    const errs: { [k: string]: string } = {};
    if (!categoria) errs.categoria = "Escolha uma categoria.";
    if (!titulo.trim() || titulo.length < 6)
      errs.titulo = "Descreva em poucas palavras. Ex.: Buffet para 120 pessoas";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      saveDraft();
      setStep(2);
    }
  }

  function handleStep2() {
    const errs: { [k: string]: string } = {};
    if (!dataEvento) {
      errs.dataEvento = "Escolha a data do evento.";
    } else {
      const d = new Date(dataEvento);
      if (d.getTime() - Date.now() < 24 * 3600000) {
        errs.dataEvento = "A data precisa ser pelo menos 24 h à frente (RN01).";
      }
    }
    if (!cidade.trim()) errs.cidade = "Informe a cidade.";
    if (!quantidade || quantidade <= 0) errs.quantidade = "Informe a quantidade.";

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      saveDraft();
      setStep(3);
    }
  }

  function handleStep3() {
    const errs: { [k: string]: string } = {};
    if (!descricao.trim() || descricao.length < 20) {
      errs.descricao = "Conte um pouco mais sobre o que precisa. Mínimo 20 caracteres.";
    }
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      saveDraft();
      setStep(4);
    }
  }

  function handlePublish() {
    const errs: { [k: string]: string } = {};
    const tetoCentavos = Math.round(Number(tetoInput.replace(/\D/g, "")) * 100);
    if (!tetoCentavos || tetoCentavos < 10000) {
      errs.tetoInput = "Informe o orçamento máximo a partir de R$ 100.";
    }

    const eventDate = new Date(dataEvento);
    const ruleCheck = canOpenRequest(
      {
        categoryId: categoria,
        dataEvento: eventDate,
        cidade,
        quantidade,
        descricao,
        tetoCentavos,
        duracaoH,
      },
      new Date()
    );

    if (!ruleCheck.ok) {
      errs.duracaoH = ruleCheck.message;
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Checa limite de 3 leilões ativos (RN02)
    const activeCount = store.getRequests().filter((r) => r.customerId === "c1" && r.status === "aberto").length;
    const canPub = canPublishAnother(activeCount);
    if (!canPub.ok) {
      toastError(canPub.message);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const catObj = INITIAL_CATEGORIES.find((c) => c.id === categoria);
      const res = store.createRequest({
        customerId: "c1",
        customerNome: "Mariana Silva",
        categoryId: categoria,
        categoriaNome: catObj ? catObj.nome : categoria,
        titulo,
        descricao,
        cidade,
        dataEvento: eventDate.toISOString(),
        quantidade,
        tetoCentavos,
        tetoVisivel,
        duracaoH,
      });

      setLoading(false);
      if (res.ok && res.id) {
        localStorage.removeItem(DRAFT_KEY);
        success("Leilão publicado com sucesso. Avisamos você quando chegar o primeiro lance.");
        router.push("/painel-cliente/novo/sucesso?id=" + res.id);
      } else {
        toastError(res.error || "Não foi possível publicar.");
      }
    }, 600);
  }

  const validDurations = dataEvento ? allowedDurations(new Date(dataEvento), new Date()) : [6, 24, 48];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step > 1 ? setStep((s) => ((s - 1) as 1 | 2 | 3 | 4)) : router.back())}
          className="inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <button
          type="button"
          onClick={saveDraft}
          className="inline-flex items-center gap-1.5 text-xs text-fg-2 hover:text-accent-text"
        >
          <Save size={14} /> Salvar rascunho
        </button>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-accent-text">
          <span>ETAPA {step} DE 4</span>
          <span className="text-fg-2 font-normal">
            {step === 1 && "Categoria e título"}
            {step === 2 && "Data, local e quantidade"}
            {step === 3 && "Detalhes do serviço"}
            {step === 4 && "Orçamento e duração"}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[24px] font-semibold text-fg">O que você precisa?</h1>
              <p className="mt-1 text-sm text-fg-2">Escolha a categoria e dê um título claro para seu pedido.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-fg mb-2">Categoria do serviço</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {INITIAL_CATEGORIES.map((cat) => {
                  const sel = categoria === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoria(cat.id)}
                      className={`flex h-12 items-center justify-between rounded-[10px] border px-3 text-sm font-medium transition-colors ${
                        sel ? "border-accent bg-accent/15 text-ink font-semibold" : "border-line bg-surface text-fg hover:bg-muted"
                      }`}
                    >
                      <span>{cat.nome}</span>
                      {sel && <Check size={16} className="text-accent-text" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              label="Título do pedido"
              placeholder="Ex.: Buffet para 120 pessoas"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              error={errors.titulo}
              hint="Seja direto. Os fornecedores verão este título nas notificações."
            />

            <div className="pt-4">
              <Button type="button" variant="primary" className="w-full" onClick={handleStep1}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[24px] font-semibold text-fg">Quando e onde será?</h1>
              <p className="mt-1 text-sm text-fg-2">Defina a data e a localização para acionar os fornecedores certos.</p>
            </div>

            <Input
              label="Data do evento ou execução"
              type="date"
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
              error={errors.dataEvento}
              hint="Data mínima de 24 horas à frente (RN01)."
            />

            <Input
              label="Cidade onde ocorrerá"
              placeholder="Paulínia"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              error={errors.cidade}
            />

            <Input
              label="Quantidade (convidados, itens ou horas)"
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              error={errors.quantidade}
              hint="Ex.: 120 convidados, 1 dia de frete ou 8 horas de foto."
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                Voltar
              </Button>
              <Button type="button" variant="primary" onClick={handleStep2} className="flex-1">
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[24px] font-semibold text-fg">Descreva os detalhes</h1>
              <p className="mt-1 text-sm text-fg-2">
                Quanto mais claro o escopo, mais precisos serão os lances e itens inclusos dos fornecedores.
              </p>
            </div>

            <Textarea
              label="O que está incluso na sua expectativa?"
              placeholder="Ex.: Precisamos de buffet completo com entradas, jantar com duas opções de massa, sobremesas e bebidas. O local já possui cozinha equipada com freezer e forno..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              error={errors.descricao}
              rows={6}
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1">
                Voltar
              </Button>
              <Button type="button" variant="primary" onClick={handleStep3} className="flex-1">
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[24px] font-semibold text-fg">Orçamento e duração do leilão</h1>
              <p className="mt-1 text-sm text-fg-2">Defina o valor máximo que pretende pagar e quanto tempo o leilão durará.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-fg">Orçamento máximo (R$)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-2 font-mono font-medium">R$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={tetoInput}
                  onChange={(e) => setTetoInput(maskBRL(e.target.value))}
                  className="h-12 w-full rounded-[10px] border border-line bg-surface pl-12 pr-4 text-[18px] font-mono font-semibold text-fg focus-visible:outline-none focus-visible:border-ink"
                  placeholder="15.000"
                />
              </div>
              {errors.tetoInput && <p className="text-[13px] text-error-text">{errors.tetoInput}</p>}
            </div>

            <label className="flex items-start gap-3 rounded-[12px] border border-line p-4 cursor-pointer hover:bg-muted/40 transition-colors">
              <input
                type="checkbox"
                checked={tetoVisivel}
                onChange={(e) => setTetoVisivel(e.target.checked)}
                className="mt-1 size-4 rounded accent-accent"
              />
              <div className="text-sm">
                <p className="font-medium text-fg">Deixar o orçamento máximo visível aos fornecedores</p>
                <p className="text-xs text-fg-2 mt-0.5">
                  Por padrão fica visível. Se ocultar, lances acima do teto ainda serão aceitos, mas marcados com &quot;Acima do orçamento&quot; apenas para você (RN04).
                </p>
              </div>
            </label>

            <div>
              <label className="block text-sm font-medium text-fg mb-2">Duração do leilão</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[6, 24, 48, 72].map((h) => {
                  const allowed = validDurations.includes(h as DurationH);
                  const sel = duracaoH === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={!allowed}
                      onClick={() => setDuracaoH(h)}
                      className={`flex h-11 flex-col items-center justify-center rounded-[10px] border text-xs transition-colors ${
                        !allowed
                          ? "opacity-40 cursor-not-allowed border-line bg-muted text-fg-2"
                          : sel
                          ? "border-accent bg-accent/15 text-ink font-semibold"
                          : "border-line bg-surface text-fg hover:bg-muted"
                      }`}
                    >
                      <span className="font-mono text-sm">{h} horas</span>
                      <span className="text-[10px] text-fg-2">{h === 48 ? "Padrão" : ""}</span>
                    </button>
                  );
                })}
              </div>
              {errors.duracaoH && <p className="mt-1 text-[13px] text-error-text">{errors.duracaoH}</p>}
              <p className="mt-2 text-xs text-fg-2">
                O leilão precisa fechar pelo menos 24 h antes do evento para garantir tempo de planejamento (RN03).
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(3)} className="flex-1">
                Voltar
              </Button>
              <Button type="button" variant="primary" onClick={handlePublish} className="flex-1" loading={loading}>
                Publicar leilão
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
