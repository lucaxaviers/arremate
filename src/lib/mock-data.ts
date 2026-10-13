/**
 * Banco em memória / localStorage para o MVP Arremate.
 * Permite testar o fluxo ponta-a-ponta (publicar -> receber lances -> comparar -> menor lance -> arrematar -> contrato -> avaliar)
 * com 100% de reatividade mesmo antes de conectar as chaves do Supabase.
 */

export type Category = { id: string; nome: string; icon: string };

export type Provider = {
  id: string;
  nomeFantasia: string;
  responsavel: string;
  documento: string;
  tipo: "pf" | "mei" | "pj";
  cidade: string;
  raioKm: number;
  nota: number;
  totalAvaliacoes: number;
  totalContratos: number;
  taxaResposta: number;
  verificado: boolean;
  categorias: string[];
  bio: string;
  avatarUrl?: string;
  endereco?: string;
  telefone?: string;
  chavePix?: string;
};

export type Bid = {
  id: string;
  requestId: string;
  providerId: string;
  providerNome: string;
  providerNota: number;
  providerContratos: number;
  verificado: boolean;
  valorCentavos: number;
  prazoDias: number;
  inclui: string[];
  mensagem: string;
  validadeDias: number;
  emRevisao: boolean;
  temPortfolio: boolean;
  temGarantia: boolean;
  isNovo?: boolean;
  createdAt: string;
  status: "ativo" | "aceito" | "recusado" | "retirado";
};

export type AuctionRequest = {
  id: string;
  customerId: string;
  customerNome: string;
  customerTelefone?: string;
  customerEmail?: string;
  customerEndereco?: string;
  categoryId: string;
  categoriaNome: string;
  titulo: string;
  descricao: string;
  cidade: string;
  dataEvento: string;
  quantidade: number;
  tetoCentavos: number;
  tetoVisivel: boolean;
  duracaoH: number;
  status: "aberto" | "contratado" | "encerrado" | "rascunho";
  abreEm: string;
  fechaEm: string;
  extensoes: number;
  contratoId?: string;
  vencedorId?: string;
};

export type Contract = {
  id: string;
  requestId: string;
  bidId: string;
  customerId?: string;
  customerNome: string;
  customerTelefone: string;
  providerId?: string;
  providerNome: string;
  providerTelefone: string;
  providerDocumento: string;
  titulo: string;
  cidade: string;
  dataEvento: string;
  valorCentavos: number;
  prazoDias: number;
  inclui: string[];
  aceitoEm: string;
  status: "ativo" | "concluido" | "cancelado";
};

export type Review = {
  id: string;
  contractId: string;
  requestId?: string;
  tipo: "cliente_avalia_fornecedor" | "fornecedor_avalia_cliente";
  autorId: string;
  autorNome: string;
  alvoId: string; // providerId ou customerId
  alvoNome: string;
  nota: number; // 1 a 5 estrelas
  comentario: string;
  criterios?: string[];
  createdAt: string;
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: "buffet", nome: "Buffet", icon: "UtensilsCrossed" },
  { id: "fotografia", nome: "Fotografia", icon: "Camera" },
  { id: "dj", nome: "DJ e Som", icon: "Music" },
  { id: "decoracao", nome: "Decoração", icon: "Sparkles" },
  { id: "frete", nome: "Frete", icon: "Truck" },
  { id: "reforma", nome: "Reforma", icon: "Hammer" },
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: "p1",
    nomeFantasia: "Cozinha da Dona Ana",
    responsavel: "Ana Maria Souza",
    documento: "34.123.456/0001-89",
    tipo: "mei",
    cidade: "Paulínia",
    raioKm: 30,
    nota: 4.9,
    totalAvaliacoes: 132,
    totalContratos: 132,
    taxaResposta: 0.98,
    verificado: true,
    categorias: ["buffet"],
    bio: "Especialista em eventos familiares e corporativos com cardápios artesanais e degustação prévia.",
  },
  {
    id: "p2",
    nomeFantasia: "Sabor da Praça",
    responsavel: "Carlos Eduardo Prado",
    documento: "45.987.654/0001-12",
    tipo: "pj",
    cidade: "Campinas",
    raioKm: 40,
    nota: 4.6,
    totalAvaliacoes: 48,
    totalContratos: 48,
    taxaResposta: 0.91,
    verificado: true,
    categorias: ["buffet"],
    bio: "Gastronomia contemporânea para casamentos e confraternizações em toda a RMC.",
  },
  {
    id: "p3",
    nomeFantasia: "Buffet Jardim",
    responsavel: "Juliana Mendes",
    documento: "12.345.678/0001-90",
    tipo: "pj",
    cidade: "Paulínia",
    raioKm: 25,
    nota: 4.8,
    totalAvaliacoes: 210,
    totalContratos: 210,
    taxaResposta: 0.95,
    verificado: true,
    categorias: ["buffet"],
    bio: "Estrutura completa com garçons, louças finas e bebidas inclusas.",
  },
  {
    id: "p4",
    nomeFantasia: "Studio LX Foto & Filme",
    responsavel: "Lucas Xavier",
    documento: "56.789.012/0001-34",
    tipo: "mei",
    cidade: "Paulínia",
    raioKm: 50,
    nota: 5.0,
    totalAvaliacoes: 76,
    totalContratos: 76,
    taxaResposta: 0.99,
    verificado: true,
    categorias: ["fotografia"],
    bio: "Cobertura fotográfica documental e ensaios com entrega digital em alta definição.",
  },
];

export const INITIAL_REQUESTS: AuctionRequest[] = [
  {
    id: "req-1",
    customerId: "c1",
    customerNome: "Mariana Silva",
    categoryId: "buffet",
    categoriaNome: "Buffet",
    titulo: "Buffet para 120 pessoas",
    descricao: "Casamento no final de tarde em Paulínia. Precisa de entrada, prato principal (massa + carne), sobremesa, bebidas e garçons.",
    cidade: "Paulínia",
    dataEvento: "2026-11-20T17:00:00Z",
    quantidade: 120,
    tetoCentavos: 1500000,
    tetoVisivel: true,
    duracaoH: 48,
    status: "aberto",
    abreEm: new Date(Date.now() - 4 * 3600000).toISOString(),
    fechaEm: new Date(Date.now() + 44 * 3600000).toISOString(),
    extensoes: 0,
  },
  {
    id: "req-2",
    customerId: "c1",
    customerNome: "Mariana Silva",
    categoryId: "fotografia",
    categoriaNome: "Fotografia",
    titulo: "Cobertura fotográfica completa para casamento",
    descricao: "Cerimônia e festa de 6 horas em Paulínia. Fotos tratadas e álbum impresso.",
    cidade: "Paulínia",
    dataEvento: "2026-11-20T16:00:00Z",
    quantidade: 1,
    tetoCentavos: 750000,
    tetoVisivel: true,
    duracaoH: 48,
    status: "aberto",
    abreEm: new Date(Date.now() - 2 * 3600000).toISOString(),
    fechaEm: new Date(Date.now() + 46 * 3600000).toISOString(),
    extensoes: 0,
  },
];

export const INITIAL_BIDS: Bid[] = [
  {
    id: "bid-1",
    requestId: "req-1",
    providerId: "p1",
    providerNome: "Cozinha da Dona Ana",
    providerNota: 4.9,
    providerContratos: 132,
    verificado: true,
    valorCentavos: 1180000, // R$ 11.800 (Menor lance / Melhor lance)
    prazoDias: 3,
    inclui: ["Entradas e canapés", "2 opções de prato principal", "Sobremesa artesanal", "Degustação prévia para 2 pessoas", "Equipe de 5 garçons inclusa"],
    mensagem: "Atendemos casamentos em Paulínia há 8 anos. Podemos agendar a degustação ainda nesta semana.",
    validadeDias: 30,
    emRevisao: false,
    temPortfolio: true,
    temGarantia: true,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    status: "ativo",
  },
  {
    id: "bid-2",
    requestId: "req-1",
    providerId: "p2",
    providerNome: "Sabor da Praça",
    providerNota: 4.6,
    providerContratos: 48,
    verificado: true,
    valorCentavos: 1240000, // R$ 12.400
    prazoDias: 2,
    inclui: ["Cardápio completo", "Bebidas não alcoólicas", "Louças e talheres", "4 garçons"],
    mensagem: "Equipe especializada em Paulínia e Barão Geraldo. Proposta com valor fechado sem taxas extras.",
    validadeDias: 20,
    emRevisao: false,
    temPortfolio: true,
    temGarantia: false,
    isNovo: true,
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    status: "ativo",
  },
  {
    id: "bid-3",
    requestId: "req-1",
    providerId: "p3",
    providerNome: "Buffet Jardim",
    providerNota: 4.8,
    providerContratos: 210,
    verificado: true,
    valorCentavos: 1310000, // R$ 13.100
    prazoDias: 5,
    inclui: ["Buffet completo", "Rechauds e estrutura térmica", "Equipe de copa e salão", "Mesa de café de saída"],
    mensagem: "Tradicional na região. Garantia de pontualidade e reposição contínua durante todo o evento.",
    validadeDias: 30,
    emRevisao: false,
    temPortfolio: true,
    temGarantia: true,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: "ativo",
  },
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "ctr-1",
    requestId: "req-1",
    bidId: "bid-1",
    customerId: "c1",
    customerNome: "Mariana Silva",
    customerTelefone: "(19) 99876-5432",
    providerId: "p1",
    providerNome: "Cozinha da Dona Ana",
    providerTelefone: "(19) 98765-4321",
    providerDocumento: "12.345.678/0001-90",
    titulo: "Buffet para 120 pessoas",
    cidade: "Paulínia",
    dataEvento: "2026-11-20T16:00:00Z",
    valorCentavos: 1180000,
    prazoDias: 3,
    inclui: ["Entradas e canapés", "2 opções de prato principal", "Sobremesa artesanal", "Degustação prévia para 2 pessoas", "Equipe de 5 garçons inclusa"],
    aceitoEm: new Date(Date.now() - 48 * 3600000).toISOString(),
    status: "ativo",
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    contractId: "ctr-1",
    requestId: "req-1",
    tipo: "cliente_avalia_fornecedor",
    autorId: "c1",
    autorNome: "Mariana Silva",
    alvoId: "p1",
    alvoNome: "Cozinha da Dona Ana",
    nota: 5,
    comentario: "Excelente atendimento! A degustação prévia foi impecável e os convidados elogiaram muito o buffet e a equipe de garçons.",
    criterios: ["Pontualidade britânica", "Atendimento impecável", "Superou expectativas"],
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "rev-2",
    contractId: "ctr-1",
    requestId: "req-1",
    tipo: "fornecedor_avalia_cliente",
    autorId: "p1",
    autorNome: "Cozinha da Dona Ana",
    alvoId: "c1",
    alvoNome: "Mariana Silva",
    nota: 5,
    comentario: "Cliente exemplar! Passou todas as orientações com antecedência, facilitou o acesso da equipe no local do evento e comunicação sempre rápida. Excelente trabalhar com ela!",
    criterios: ["Comunicação clara", "Local preparado", "Pontualidade no alinhamento"],
    createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
  {
    id: "rev-3",
    contractId: "ctr-2",
    requestId: "req-hist-1",
    tipo: "cliente_avalia_fornecedor",
    autorId: "c2",
    autorNome: "Roberto C.",
    alvoId: "p1",
    alvoNome: "Cozinha da Dona Ana",
    nota: 5,
    comentario: "Pontualidade britânica e comida farta. Cumpriram rigorosamente todos os itens do contrato simples do Arremate.",
    criterios: ["Pontualidade britânica", "Comida farta", "Contrato cumprido"],
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    id: "rev-4",
    contractId: "ctr-3",
    requestId: "req-hist-2",
    tipo: "cliente_avalia_fornecedor",
    autorId: "c3",
    autorNome: "Carla Mendes",
    alvoId: "p1",
    alvoNome: "Cozinha da Dona Ana",
    nota: 4.8,
    comentario: "Cardápio elogiado por todos no evento corporativo. Entregaram tudo conforme o combinado na plataforma.",
    criterios: ["Ótimo custo-benefício", "Equipe profissional"],
    createdAt: new Date(Date.now() - 120 * 3600000).toISOString(),
  },
];
