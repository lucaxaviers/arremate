import { Eyebrow, Card } from "@/components/ui/primitives";

export default function PrivacidadePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-20">
      <header className="mb-12">
        <Eyebrow>Privacidade & LGPD · RN20</Eyebrow>
        <h1 className="mt-2 text-[32px] sm:text-[42px] font-semibold tracking-tight text-fg">
          Política de Privacidade
        </h1>
        <p className="mt-2 text-sm text-fg-2">
          Conformidade integral com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>
      </header>

      <Card className="p-8 md:p-12 space-y-8 text-xs md:text-sm text-fg-2 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">1. Princípios de Coleta e Minimização de Dados</h2>
          <p>
            O Arremate coleta exclusivamente os dados indispensáveis para a operacionalização dos leilões reversos.
            Para clientes: nome, e-mail, telefone para contato pós-arremate e cidade do evento.
            Para fornecedores: documento oficial (CPF ou CNPJ), fotografia de selfie para validação biométrica de identidade,
            razão social/nome fantasia e raio geográfico de atuação.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">2. Armazenamento Seguro de Documentos e Selfies (RN05 / RN20)</h2>
          <p>
            Os arquivos de documentos e selfies submetidos pelos fornecedores para fins de verificação cadastral são
            armazenados em bucket com criptografia em repouso e permissões restritas (Row Level Security).
            Nenhum outro usuário ou fornecedor concorrente tem acesso aos documentos cadastrais ou selfies submetidos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">3. Lances Selados e Proteção de Dados Competitivos (RN08)</h2>
          <p>
            Durante o leilão em andamento, os fornecedores concorrentes visualizam apenas sua própria posição ordinal
            e o quantitativo total de propostas no leilão. Dados de contato e identificação de clientes e fornecedores
            permanecem blindados até o momento em que o cliente confirma o arremate soberano.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">4. Direitos dos Titulares de Dados (LGPD Art. 18)</h2>
          <p>
            Conforme a regra RN20, todo usuário cadastrado no Arremate pode a qualquer momento:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Requisitar confirmação e acesso integral aos dados armazenados;</li>
            <li>Exportar cópia dos seus dados em formato estruturado (JSON) diretamente nas configurações;</li>
            <li>Solicitar a revogação de consentimento e eliminação definitiva de dados pessoais, ressalvadas as obrigações legais de guarda de logs fiscais e regulatórios.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-fg">5. Canal de Atendimento do Encarregado (DPO)</h2>
          <p>
            Para exercer seus direitos ou esclarecer qualquer dúvida sobre o tratamento de dados pessoais,
            entre em contato diretamente com nosso Encarregado de Proteção de Dados pelo canal: <strong>dpo@arremate.com.br</strong>.
          </p>
        </section>
      </Card>
    </div>
  );
}
