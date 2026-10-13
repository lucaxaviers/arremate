import { z } from "zod";

/** Schemas Zod compartilhados entre formulários (client) e rotas de servidor. */

const msg = { required: "Precisamos desse dado para continuar." };

/** "R$ 15.000,00" -> 1500000 */
export function parseBRL(input: string): number {
  const digits = input.replace(/[^\d,]/g, "").replace(",", ".");
  const n = Number.parseFloat(digits);
  return Number.isFinite(n) ? Math.round(n * 100) : Number.NaN;
}

export const loginSchema = z.object({
  email: z.string().min(1, msg.required).email("Confira o e-mail. Parece que falta algo."),
  senha: z.string().min(1, msg.required),
});

export const signupSchema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome completo."),
  email: z.string().min(1, msg.required).email("Confira o e-mail. Parece que falta algo."),
  senha: z.string().min(8, "Use pelo menos 8 caracteres."),
  consentimento: z.literal(true, { message: "Para criar a conta, aceite os termos e a política de privacidade." }),
});

export const recoverSchema = z.object({ email: z.string().min(1, msg.required).email("Confira o e-mail.") });

// ---------- Cadastro de fornecedor (3 etapas) ----------
const onlyDigits = (s: string) => s.replace(/\D/g, "");

export function isValidCPF(raw: string): boolean {
  const c = onlyDigits(raw);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  const dv = (len: number) => {
    let s = 0;
    for (let i = 0; i < len; i++) s += Number(c[i]) * (len + 1 - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return dv(9) === Number(c[9]) && dv(10) === Number(c[10]);
}

export function isValidCNPJ(raw: string): boolean {
  const c = onlyDigits(raw);
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const calc = (len: number) => {
    const w = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const s = w.reduce((acc, wi, i) => acc + Number(c[i]) * wi, 0);
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === Number(c[12]) && calc(13) === Number(c[13]);
}

export const providerStep1Schema = z.object({
  nomeFantasia: z.string().trim().min(2, "Digite o nome do seu negócio."),
  responsavel: z.string().trim().min(2, "Digite o nome do responsável."),
  email: z.string().email("Confira o e-mail."),
  telefone: z.string().refine((v) => onlyDigits(v).length >= 10, "Telefone com DDD, só números."),
  senha: z.string().min(8, "Use pelo menos 8 caracteres."),
});

export const providerStep2Schema = z
  .object({
    tipo: z.enum(["pf", "mei", "pj"]),
    documento: z.string().min(1, msg.required),
    consentimento: z.literal(true, { message: "Autorize o uso dos documentos para verificação." }),
  })
  .superRefine((v, ctx) => {
    const ok = v.tipo === "pf" ? isValidCPF(v.documento) : isValidCNPJ(v.documento);
    if (!ok) ctx.addIssue({ code: "custom", path: ["documento"], message: v.tipo === "pf" ? "CPF inválido. Confira os números." : "CNPJ inválido. Confira os números." });
  });

export const providerStep3Schema = z.object({
  categorias: z.array(z.string()).min(1, "Escolha pelo menos um segmento."),
  cidadeBase: z.string().trim().min(2, "Informe a cidade base."),
  raioKm: z.number().int().min(5).max(100),
});

// ---------- Pedido (4 etapas) ----------
export const requestStep1Schema = z.object({
  categoria: z.string().min(1, "Escolha uma categoria."),
  titulo: z.string().trim().min(6, "Descreva em poucas palavras. Ex.: Buffet para 120 pessoas").max(80, "Use até 80 caracteres."),
});
export const requestStep2Schema = z.object({
  dataEvento: z.string().min(1, "Escolha a data do evento."),
  cidade: z.string().trim().min(2, "Informe a cidade."),
  quantidade: z.number({ message: "Informe a quantidade." }).int().positive("Informe a quantidade."),
});
export const requestStep3Schema = z.object({
  descricao: z.string().trim().min(20, "Conte um pouco mais. Pelo menos 20 caracteres.").max(1000),
});
export const requestStep4Schema = z.object({
  teto: z.string().refine((v) => parseBRL(v) >= 10000, "Informe o orçamento máximo, a partir de R$ 100."),
  tetoVisivel: z.boolean(),
  duracaoH: z.number(),
});
export const requestSchema = requestStep1Schema.and(requestStep2Schema).and(requestStep3Schema).and(requestStep4Schema);
export type RequestDraft = z.infer<typeof requestSchema>;

// ---------- Lance (RN07) ----------
export const bidSchema = z.object({
  valor: z.string().refine((v) => parseBRL(v) > 0, "Informe o valor do lance."),
  prazoDias: z.number({ message: "Informe o prazo." }).int().min(0).max(365),
  inclui: z.array(z.string().trim().min(1)).min(1, "Liste pelo menos um item incluso."),
  validadeDias: z.number().int().min(1, "A validade mínima é de 1 dia.").max(90),
  mensagem: z.string().trim().min(1, "Escreva uma mensagem curta para o cliente.").max(300, "Use até 300 caracteres."),
  garantia: z.boolean().optional(),
});
export type BidInput = z.infer<typeof bidSchema>;

export const reviewSchema = z.object({
  nota: z.number().int().min(1, "Escolha uma nota de 1 a 5.").max(5),
  comentario: z.string().trim().min(10, "Conte em uma frase como foi.").max(500),
});
