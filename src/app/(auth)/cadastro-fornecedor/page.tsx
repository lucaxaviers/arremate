"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { isValidCPF, isValidCNPJ } from "@/lib/schemas";
import { INITIAL_CATEGORIES } from "@/lib/mock-data";
import { maskPhone, maskCPF, maskCNPJ } from "@/lib/masks";

export default function CadastroFornecedorPage() {
  const router = useRouter();
  const { success } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Etapa 1: Dados do negócio
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  // Etapa 2: Verificação de identidade
  const [tipo, setTipo] = useState<"pf" | "mei" | "pj">("mei");
  const [documento, setDocumento] = useState("");
  const [docFile, setDocFile] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<string | null>(null);
  const [consentimento, setConsentimento] = useState(false);

  // Etapa 3: Segmentos e região
  const [categorias, setCategorias] = useState<string[]>(["buffet"]);
  const [cidadeBase, setCidadeBase] = useState("Paulínia");
  const [raioKm, setRaioKm] = useState(30);

  function handleNextStep1() {
    const errs: { [k: string]: string } = {};
    if (!nomeFantasia.trim()) errs.nomeFantasia = "Digite o nome do seu negócio.";
    if (!responsavel.trim()) errs.responsavel = "Digite o nome do responsável.";
    if (!email.trim() || !email.includes("@")) errs.email = "Confira o e-mail.";
    if (!telefone.trim() || telefone.replace(/\D/g, "").length < 10) errs.telefone = "Telefone com DDD, só números.";
    if (senha.length < 8) errs.senha = "Use pelo menos 8 caracteres.";

    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  }

  function handleNextStep2() {
    const errs: { [k: string]: string } = {};
    if (!documento.trim()) {
      errs.documento = "Informe o número do documento.";
    } else {
      const ok = tipo === "pf" ? isValidCPF(documento) : isValidCNPJ(documento);
      if (!ok) errs.documento = tipo === "pf" ? "CPF inválido. Confira os números." : "CNPJ inválido. Confira os números.";
    }

    if (!docFile) errs.docFile = "Anexe a foto do documento frente e verso.";
    if (!selfieFile) errs.selfieFile = "Anexe sua selfie para validação biométrica.";
    if (!consentimento) errs.consentimento = "Autorize a checagem dos documentos para verificação.";

    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(3);
  }

  function handleFinish() {
    const errs: { [k: string]: string } = {};
    if (categorias.length === 0) errs.categorias = "Escolha pelo menos uma categoria.";
    if (!cidadeBase.trim()) errs.cidadeBase = "Informe a cidade base.";

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success("Cadastro enviado para verificação. Seja bem-vindo!");
      router.push("/painel-fornecedor");
    }, 600);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 md:py-16">
      {/* Progresso */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-accent-text">Etapa {step} de 3</span>
          <span className="text-fg-2">
            {step === 1 && "Dados do negócio"}
            {step === 2 && "Verificação por documento e selfie"}
            {step === 3 && "Segmentos e região"}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-[24px] font-semibold text-fg">1. Dados do seu negócio</h1>
              <p className="mt-1 text-sm text-fg-2">Como os clientes da sua região identificarão seus serviços.</p>
            </div>

            <Input
              label="Nome fantasia da empresa ou autônomo"
              placeholder="Ex.: Cozinha da Dona Ana"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
              error={errors.nomeFantasia}
            />

            <Input
              label="Nome do responsável"
              placeholder="Ex.: Ana Maria Souza"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              error={errors.responsavel}
            />

            <Input
              label="E-mail de acesso"
              type="email"
              placeholder="contato@negocio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              label="Telefone / WhatsApp"
              placeholder="(19) 99876-5432"
              mask="phone"
              value={telefone}
              onChange={(e) => setTelefone(maskPhone(e.target.value))}
              error={errors.telefone}
            />

            <Input
              label="Crie sua senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              error={errors.senha}
            />

            <div className="pt-4">
              <Button type="button" variant="primary" className="w-full" onClick={handleNextStep1}>
                Continuar para verificação
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-[24px] font-semibold text-fg">2. Verificação de identidade</h1>
              <p className="mt-1 text-sm text-fg-2">
                Para manter a plataforma segura e confiável, exigimos verificação de todos os fornecedores (RN05).
              </p>
            </div>

            <div>
              <label className="text-[14px] font-medium text-fg block mb-2">Tipo de cadastro</label>
              <div className="grid grid-cols-3 gap-2">
                {(["pf", "mei", "pj"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTipo(t);
                      setDocumento("");
                    }}
                    className={`h-11 rounded-[10px] border text-sm font-medium uppercase transition-colors ${
                      tipo === t ? "border-accent bg-accent/15 text-accent-text" : "border-line bg-surface text-fg hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label={tipo === "pf" ? "CPF do prestador" : "CNPJ da empresa"}
              placeholder={tipo === "pf" ? "000.000.000-00" : "00.000.000/0001-00"}
              mask={tipo === "pf" ? "cpf" : "cnpj"}
              value={documento}
              onChange={(e) => setDocumento(tipo === "pf" ? maskCPF(e.target.value) : maskCNPJ(e.target.value))}
              error={errors.documento}
            />

            {/* Upload Documento */}
            <div className="space-y-1.5">
              <label className="block text-[14px] font-medium text-fg">Documento com foto (RG ou CNH)</label>
              <div
                onClick={() => setDocFile("documento_verificacao.pdf")}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed p-6 text-center transition-colors ${
                  docFile ? "border-success bg-success/10 text-success-text" : "border-line bg-muted/50 hover:bg-muted"
                }`}
              >
                {docFile ? (
                  <div className="flex items-center gap-2 font-medium">
                    <Check size={18} /> Arquivo anexado: {docFile}
                  </div>
                ) : (
                  <>
                    <UploadCloud size={24} className="text-fg-2 mb-2" />
                    <p className="text-sm font-medium text-fg">Clique para simular anexo do documento</p>
                    <p className="text-xs text-fg-2">Salvo em bucket privado criptografado (LGPD)</p>
                  </>
                )}
              </div>
              {errors.docFile && <p className="text-[13px] text-error-text">{errors.docFile}</p>}
            </div>

            {/* Upload Selfie */}
            <div className="space-y-1.5">
              <label className="block text-[14px] font-medium text-fg">Selfie segurando o documento</label>
              <div
                onClick={() => setSelfieFile("selfie_biometria.jpg")}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed p-6 text-center transition-colors ${
                  selfieFile ? "border-success bg-success/10 text-success-text" : "border-line bg-muted/50 hover:bg-muted"
                }`}
              >
                {selfieFile ? (
                  <div className="flex items-center gap-2 font-medium">
                    <Check size={18} /> Selfie anexada: {selfieFile}
                  </div>
                ) : (
                  <>
                    <ShieldCheck size={24} className="text-fg-2 mb-2" />
                    <p className="text-sm font-medium text-fg">Clique para simular anexo da selfie</p>
                    <p className="text-xs text-fg-2">Garante uma única conta por CPF e evita fraudes</p>
                  </>
                )}
              </div>
              {errors.selfieFile && <p className="text-[13px] text-error-text">{errors.selfieFile}</p>}
            </div>

            <label className="flex items-start gap-3 cursor-pointer text-sm text-fg-2 select-none pt-2">
              <input
                type="checkbox"
                checked={consentimento}
                onChange={(e) => setConsentimento(e.target.checked)}
                className="mt-1 size-4 rounded accent-accent"
              />
              <span>Autorizo a validação e consulta dos meus dados cadastrais e documentos conforme a LGPD.</span>
            </label>
            {errors.consentimento && <p className="text-[13px] text-error-text">{errors.consentimento}</p>}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                Voltar
              </Button>
              <Button type="button" variant="primary" onClick={handleNextStep2} className="flex-1">
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[24px] font-semibold text-fg">3. Segmentos e raio de atendimento</h1>
              <p className="mt-1 text-sm text-fg-2">
                Você só receberá notificações de leilões que atendem seus segmentos e raio em quilômetros.
              </p>
            </div>

            <div>
              <label className="text-[14px] font-medium text-fg block mb-2">Categorias que você atende</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {INITIAL_CATEGORIES.map((cat) => {
                  const sel = categorias.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategorias((prev) =>
                          sel ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                        );
                      }}
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
              {errors.categorias && <p className="mt-1 text-[13px] text-error-text">{errors.categorias}</p>}
            </div>

            <Input
              label="Cidade base"
              placeholder="Paulínia"
              value={cidadeBase}
              onChange={(e) => setCidadeBase(e.target.value)}
              error={errors.cidadeBase}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-fg">Raio de atendimento</span>
                <span className="font-mono font-semibold text-accent-text">{raioKm} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={raioKm}
                onChange={(e) => setRaioKm(Number(e.target.value))}
                className="w-full accent-accent h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-fg-2">
                <span>5 km</span>
                <span>25 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1">
                Voltar
              </Button>
              <Button type="button" variant="primary" onClick={handleFinish} className="flex-1" loading={loading}>
                Concluir cadastro
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
