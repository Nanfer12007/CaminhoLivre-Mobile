import api from "../api/api";
import {
  AuthResponse,
  LoginData,
  CadastroData,
} from "../types/Auth";

export const authService = {
  async login(dados: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      "/api/auth/login",
      dados
    );

    return response.data;
  },

  async cadastro(dados: CadastroData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      "/api/auth/cadastro",
      dados
    );

    return response.data;
  },
};
