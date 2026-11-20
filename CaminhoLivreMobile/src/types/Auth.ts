export interface Usuario {
  usuarioId: number;
  nome: string;
  email: string;
  papel: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nome: string;
  email: string;
  papel: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface CadastroData {
  nome: string;
  email: string;
  senha: string;
}
