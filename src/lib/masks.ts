/**
 * Utilitários de máscaras e formatação para inputs brasileiros (CPF, CNPJ, Telefone, CEP, Moeda, Data, PIX).
 */

export function unmaskDigits(value: string): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

/**
 * Máscara de CPF: 000.000.000-00
 */
export function maskCPF(value: string): string {
  const digits = unmaskDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Máscara de CNPJ: 00.000.000/0000-00
 */
export function maskCNPJ(value: string): string {
  const digits = unmaskDigits(value).slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

/**
 * Máscara combinada CPF ou CNPJ (detecta pelo comprimento)
 */
export function maskCPFOrCNPJ(value: string): string {
  const digits = unmaskDigits(value);
  if (digits.length > 11) {
    return maskCNPJ(digits);
  }
  return maskCPF(digits);
}

/**
 * Máscara de Telefone / WhatsApp: (19) 99876-5432 ou fixo (19) 3874-1234
 */
export function maskPhone(value: string): string {
  const digits = unmaskDigits(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Máscara de CEP: 13140-000
 */
export function maskCEP(value: string): string {
  const digits = unmaskDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Máscara de Data brasileira: DD/MM/AAAA
 */
export function maskDate(value: string): string {
  const digits = unmaskDigits(value).slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Formata digitação de moeda em tempo real (ex.: centavos para BRL: "150000" -> "1.500,00")
 */
export function maskCurrency(value: string | number): string {
  if (typeof value === "number") {
    return (value / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  const digits = unmaskDigits(value);
  if (!digits) return "";
  const num = parseInt(digits, 10);
  if (isNaN(num)) return "";
  return (num / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formata digitação de valor monetário inteiro ou decimal simples (ex.: "15000" -> "15.000")
 */
export function maskNumberThousands(value: string): string {
  const digits = unmaskDigits(value);
  if (!digits) return "";
  const num = parseInt(digits, 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("pt-BR");
}

/**
 * Máscara amigável de moeda BRL: formata milhar automaticamente e permite vírgula decimal (ex.: "11800" -> "11.800" e "11800,50" -> "11.800,50")
 */
export function maskBRL(value: string): string {
  if (!value) return "";
  const cleaned = value.replace(/[^\d,]/g, "");
  const parts = cleaned.split(",");
  const integerDigits = parts[0].replace(/\D/g, "");
  const formattedInteger = integerDigits ? parseInt(integerDigits, 10).toLocaleString("pt-BR") : "";
  if (parts.length > 1) {
    const decimalDigits = parts[1].replace(/\D/g, "").slice(0, 2);
    return `${formattedInteger},${decimalDigits}`;
  }
  return formattedInteger;
}

/**
 * Máscara inteligente para Chave PIX:
 * - Se for só dígitos: formata como Telefone (10/11 dígitos), CPF (11 dígitos) ou CNPJ (14 dígitos)
 * - Se tiver @: formata como e-mail (minúsculo e sem espaços)
 * - Senão: chave aleatória (remove espaços)
 */
export function maskPixKey(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  
  if (trimmed.includes("@")) {
    return trimmed.toLowerCase().replace(/\s/g, "");
  }

  const isNumericOnly = /^\d+$/.test(trimmed.replace(/[().\-/+ ]/g, ""));
  if (isNumericOnly) {
    const raw = unmaskDigits(trimmed);
    if (raw.length <= 11) {
      // Pode ser telefone com DDD ou CPF
      if (raw.length === 11 && (raw.startsWith("1") || raw.startsWith("2") || raw.startsWith("3") || raw.startsWith("4") || raw.startsWith("5") || raw.startsWith("6") || raw.startsWith("7") || raw.startsWith("8") || raw.startsWith("9"))) {
        // Se parecer celular (DDD válido + 9)
        if (raw[2] === "9") {
          return maskPhone(raw);
        }
        return maskCPF(raw);
      }
      if (raw.length === 10) {
        return maskPhone(raw);
      }
      return maskCPF(raw);
    }
    if (raw.length <= 14) {
      return maskCNPJ(raw);
    }
  }

  // Chave aleatória (UUID)
  return trimmed.replace(/\s/g, "");
}
