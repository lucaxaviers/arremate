import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Monta texto e cláusulas do Contrato Simples (Documento Mestre v2.1, RN12 e RN13)
  const title = "ARREMATE - CONTRATO DE PRESTACAO DE SERVICOS";
  const line1 = `Identificador do Contrato: ${id}`;
  const line2 = "Data de emissao: 17 de Outubro de 2026";
  const line3 = "Intermediacao: Arremate Plataforma de Leilao Reverso";
  const line4 = "1. Objeto: Prestacao de Servicos Locais selecionados via leilao reverso.";
  const line5 = "2. Valor e Pagamento: Valor arrematado acordado diretamente entre as partes.";
  const line6 = "3. Garantia de Cancelamento: Cancelamento gratuito em ate 24h pelo cliente (RN13).";
  const line7 = "4. Natureza: A plataforma Arremate atua estritamente como intermediadora tecnologica.";

  // Constrói um PDF 1.4 estático válido
  const streamContent = `
BT
/F1 16 Tf
50 780 Td
(${title}) Tj
/F1 10 Tf
0 -30 Td
(${line1}) Tj
0 -18 Td
(${line2}) Tj
0 -18 Td
(${line3}) Tj
0 -35 Td
/F1 11 Tf
(${line4}) Tj
0 -24 Td
(${line5}) Tj
0 -24 Td
(${line6}) Tj
0 -24 Td
(${line7}) Tj
0 -50 Td
/F1 9 Tf
(Documento gerado automaticamente pelo sistema Arremate - Feito em Paulinia.) Tj
ET
`.trim();

  const streamLength = Buffer.byteLength(streamContent, "utf-8");

  const pdfParts = [
    "%PDF-1.4\n",
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
  ];

  const body = pdfParts.join("");
  const xrefOffset = Buffer.byteLength(body, "utf-8");

  const trailer = `xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000063 00000 n 
0000000122 00000 n 
0000000253 00000 n 
0000000326 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF
`;

  const pdfBuffer = Buffer.from(body + trailer, "utf-8");

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="contrato-arremate-${id}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
