import { FileText, ShieldCheck, Clock } from "lucide-react";
import { Eyebrow, Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";

const PASSOS_CLIENTE = [
  {
    n: "01",
    t: "Você descreve o que precisa e o orçamento máximo",
    d: "Em menos de 5 minutos, informe o tipo de serviço (ex.: Buffet para 120 pessoas), data do evento ou início, cidade e o valor teto que planeja pagar. Não exige cartão nem compromisso.",
  },
  {
    n: "02",
    t: "Fornecedores verificados competem com lances",
    d: "Profissionais qualificados da sua região, com documento e selfie verificados, enviam propostas com valor em reais, prazo de execução e lista detalhada do que está incluso.",
  },
  {
    n: "03",
    t: "Você acompanha em tempo real e decide",
    d: "Veja a disputa acontecer ao vivo. Filtre por menor preço, maior avaliação ou menor prazo. A decisão é sempre sua: escolha o melhor custo-benefício.",
  },
  {
    n: "04",
    t: "Arremate seguro e contrato em PDF",
    d: "Ao escolher a proposta, o Arremate gera um contrato simples em PDF com os termos aceitos e libera o contato direto para vocês alinharem a execução.",
  },
];

const PASSOS_FORNECEDOR = [
  {
    n: "01",
    t: "Cadastre seus segmentos e raio de atendimento",
    d: "Escolha as categorias que você atende e a distância máxima (em km) a partir da sua cidade base. O cadastro exige validação com selfie para manter a disputa limpa.",
  },
  {
    n: "02",
    t: "Receba avisos de clientes prontos para fechar",
    d: "Sem gastar com anúncios ou perder tempo com curiosos. Notificamos você apenas quando um cliente publicar um leilão dentro da sua região com orçamento definido.",
  },
  {
    n: "03",
    t: "Envie lances e ajuste sua posição",
    d: "Informe seu valor, prazo e diferenciais inclusos. Você acompanha sua posição na disputa (ex.: '2º de 4') e pode reduzir o valor para assumir o 1º lugar.",
  },
  {
    n: "04",
    t: "Feche contratos e acumule avaliações",
    d: "Ao vencer o leilão, você recebe o contato direto do cliente com o contrato em PDF já emitido. Entregue um bom trabalho e suba no ranking da sua cidade.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-20">
      <header className="max-w-3xl mb-16">
        <Eyebrow>O Leilão Reverso na Prática</Eyebrow>
        <h1 className="mt-2 text-[38px] sm:text-[48px] font-semibold tracking-tight text-fg leading-[1.08]">
          Você diz o que precisa. <br />
          O mercado diz quanto custa. <br />
          <span className="text-accent-text">Você decide.</span>
        </h1>
        <p className="mt-4 text-lg text-fg-2 leading-relaxed">
          O Arremate inverte a lógica tradicional: em vez de você passar dias pedindo orçamentos no escuro,
          os fornecedores locais disputam a sua demanda com propostas claras em tempo real.
        </p>
      </header>

      {/* Jornada do Cliente */}
      <section className="mb-20">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-text block">
            Jornada do Cliente
          </span>
          <h2 className="mt-1 text-[28px] font-semibold text-fg">
            Como contratar um serviço pelo Arremate
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PASSOS_CLIENTE.map((p) => (
            <Card key={p.n} className="p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-accent-text block mb-3">
                  ETAPA {p.n}
                </span>
                <h3 className="text-[17px] font-semibold text-fg leading-snug mb-2">
                  {p.t}
                </h3>
                <p className="text-xs leading-relaxed text-fg-2">{p.d}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-start">
          <ButtonLink href="/painel-cliente/novo" variant="primary" className="h-11 px-6">
            Publicar necessidade grátis
          </ButtonLink>
        </div>
      </section>

      {/* Jornada do Fornecedor */}
      <section className="mb-20 border-t border-line pt-16">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-text block">
            Jornada do Fornecedor
          </span>
          <h2 className="mt-1 text-[28px] font-semibold text-fg">
            Como fechar mais clientes locais sem pagar anúncio
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PASSOS_FORNECEDOR.map((p) => (
            <Card key={p.n} className="p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-accent-text block mb-3">
                  PASSO {p.n}
                </span>
                <h3 className="text-[17px] font-semibold text-fg leading-snug mb-2">
                  {p.t}
                </h3>
                <p className="text-xs leading-relaxed text-fg-2">{p.d}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-start">
          <ButtonLink href="/cadastro-fornecedor" variant="secondary" className="h-11 px-6">
            Cadastrar como fornecedor
          </ButtonLink>
        </div>
      </section>

      {/* Diferenciais e Garantias do Documento Mestre */}
      <section className="rounded-[24px] border border-line bg-surface p-8 sm:p-12">
        <div className="max-w-2xl mb-8">
          <Eyebrow>Regras e Segurança</Eyebrow>
          <h2 className="mt-2 text-[26px] font-semibold text-fg">
            Por que o modelo de leilão reverso é mais seguro?
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <ShieldCheck size={24} className="text-accent-text" />
            <h3 className="text-base font-semibold text-fg">Verificação Rigorosa</h3>
            <p className="text-xs text-fg-2 leading-relaxed">
              Fornecedores passam por verificação de documento (CPF/CNPJ) e selfie de identidade antes de enviar lances.
            </p>
          </div>

          <div className="space-y-2">
            <Clock size={24} className="text-accent-text" />
            <h3 className="text-base font-semibold text-fg">Cancelamento em até 24h</h3>
            <p className="text-xs text-fg-2 leading-relaxed">
              Pela regra RN13, você pode cancelar o arremate sem qualquer custo em até 24 horas caso ocorra desalinhamento.
            </p>
          </div>

          <div className="space-y-2">
            <FileText size={24} className="text-accent-text" />
            <h3 className="text-base font-semibold text-fg">Contrato em PDF Automático</h3>
            <p className="text-xs text-fg-2 leading-relaxed">
              Ao arrematar, todos os termos, valor e lista de itens inclusos ficam registrados em contrato formal para ambas as partes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
