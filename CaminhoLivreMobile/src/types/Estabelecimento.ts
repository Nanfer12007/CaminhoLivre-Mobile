export interface Estabelecimento {
  id: number;
  nome: string;
  descricao: string;
  endereco: string;
  latitude: number | null;
  longitude: number | null;
  acessibilidade: string;
}

export interface PaginaEstabelecimentos {
  content: Estabelecimento[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}