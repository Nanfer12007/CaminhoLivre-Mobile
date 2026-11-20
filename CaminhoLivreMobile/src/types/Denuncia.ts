export type CategoriaDenuncia =
  | "CALCADA_DANIFICADA"
  | "AUSENCIA_DE_RAMPA"
  | "CALCADA_BLOQUEADA"
  | "FALTA_DE_SINALIZACAO"
  | "TRANSPORTE_INACESSIVEL"
  | "OUTROS";

export type StatusDenuncia =
  | "ABERTA"
  | "EM_ANALISE"
  | "EM_ANDAMENTO"
  | "RESOLVIDA"
  | "REJEITADA";

export type StatusAnaliseIA =
  | "PENDENTE"
  | "CONCLUIDA"
  | "ERRO";

export interface DenunciaRequest {
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  fotoUrl?: string | null;
  categoria: CategoriaDenuncia;
}

export interface Denuncia extends DenunciaRequest {
  id: number;
  status: StatusDenuncia;
  gravidade: string | null;
  resumoIA: string | null;
  riscosIA: string | null;
  statusAnaliseIA: StatusAnaliseIA | null;
  dataCriacao: string;
  usuarioId: number;
}

export interface Pagina<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}