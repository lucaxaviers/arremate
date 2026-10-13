import { Eyebrow, Card } from "@/components/ui/primitives";

export default function TermosPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-20">
      <header className="mb-12">
        <Eyebrow>Documentos Legais</Eyebrow>
        <h1 className="mt-2 text-[32px] sm:text-[42px] font-semibold tracking-tight text-fg">
          Termos de Uso
        </h1>
        <p className="mt-2 text-sm text-fg-2">
          Última atualização: Outubro de 2026 · Versão 2.1 unificada · Feito em Paulínia
        </p>
      </header>

      <Card className="p-8 md:p-12 space-y-8 text-xs md:text-sm text-fg-2 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">1. Natureza do Serviço e Papel da Plataforma (RN12)</h2>
          <p>
            O Arremate é uma plataforma tecnológica de leilão reverso de serviços locais, com sede em Paulínia/SP.
            A atuação do Arremate limita-se estritamente à intermediação tecnológica e aproximação entre clientes que
            publicam necessidades e fornecedores locais independentes que apresentam lances competitivos.
          </p>
          <p>
            Conforme a regra RN12 do produto, o Arremate não é parte contratante dos serviços contratados nem presta
            assistência direta de execução, respondendo cada fornecedor pela qualidade técnica, pontualidade e itens
            inclusos discriminados formalmente no lance aceito.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">2. Dinâmica do Leilão Reverso e Lances (RN01 a RN10)</h2>
          <p>
            Ao publicar uma necessidade, o cliente estabelece a categoria, data, cidade e o orçamento máximo teto.
            Fornecedores locais verificados podem enviar propostas com valor igual ou inferior ao teto.
          </p>
          <p>
            Cada fornecedor ativo pode manter um único lance simultâneo por leilão, podendo reduzi-lo a qualquer momento
            respeitando a redução mínima de R$ 10,00 ou 1% (o que for maior) conforme a regra RN06.
          </p>
          <p>
            Lances enviados nos últimos 5 minutos de encerramento provocam a extensão automática anti-sniping de 5 minutos,
            limitada a 3 extensões consecutivas (regra RN09).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">3. Arremate, Contrato e Cancelamento (RN12 e RN13)</h2>
          <p>
            A escolha da proposta é soberana e livre do cliente, não havendo obrigatoriedade de arrematar pelo menor preço.
            Ao arrematar, é gerado automaticamente um contrato simples em PDF contendo o detalhamento de escopo e dados das partes.
          </p>
          <p>
            <strong>Regra de Cancelamento (RN13):</strong> O cliente tem o direito de cancelar o arremate sem qualquer custo
            ou penalidade em até 24 (vinte e quatro) horas após a confirmação. O cancelamento imotivado por parte do fornecedor
            após o arremate acarreta penalidade de reputação no ranking e reabertura do leilão para os demais participantes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">4. Avaliação Bilateral Obrigatória (RN14)</h2>
          <p>
            Após a execução do serviço, ambas as partes comprometem-se a registrar a avaliação bilateral com nota de 1 a 5
            e comentário textual. Fornecedores que mantiverem média de reputação inferior a 3,5 por 3 meses consecutivos
            terão suas contas suspensas da plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">5. Foro e Legislação Aplicável</h2>
          <p>
            Estes termos são regidos pelas leis da República Federativa do Brasil. Para a resolução de controvérsias oriundas
            da relação entre usuários e a plataforma, elege-se o foro da comarca de Paulínia, Estado de São Paulo.
          </p>
        </section>
      </Card>
    </div>
  );
}
