export interface AvaliacaoRequest {
  nota: number;
  comentario: string;
  estabelecimentoId: number;
}

export interface Avaliacao {
  id: number;
  nota: number;
  comentario: string | null;
  dataAvaliacao: string;
  usuarioId: number;
  estabelecimentoId: number;
}

export interface PaginaAvaliacoes {
  content: Avaliacao[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
