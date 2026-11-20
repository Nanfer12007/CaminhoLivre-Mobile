import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import * as SecureStore from "expo-secure-store";

import { authService } from "../services/authService";

import {
  Usuario,
  LoginData,
  CadastroData,
  AuthResponse,
} from "../types/Auth";

interface AuthContextData {
  usuario: Usuario | null;
  carregando: boolean;
  autenticado: boolean;
  login: (dados: LoginData) => Promise<void>;
  cadastro: (dados: CadastroData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const salvarSessao = async (dados: AuthResponse) => {
    await SecureStore.setItemAsync(
      "caminholivre_token",
      dados.token
    );

    const usuarioLogado: Usuario = {
      usuarioId: dados.usuarioId,
      nome: dados.nome,
      email: dados.email,
      papel: dados.papel,
    };

    await SecureStore.setItemAsync(
      "caminholivre_usuario",
      JSON.stringify(usuarioLogado)
    );

    setUsuario(usuarioLogado);
  };

  const limparSessao = async () => {
    await SecureStore.deleteItemAsync("caminholivre_token");
    await SecureStore.deleteItemAsync("caminholivre_usuario");

    setUsuario(null);
  };

  const carregarSessao = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync(
        "caminholivre_token"
      );

      const dadosUsuario = await SecureStore.getItemAsync(
        "caminholivre_usuario"
      );

      if (token && dadosUsuario) {
        setUsuario(JSON.parse(dadosUsuario));
      } else {
        await limparSessao();
      }
    } catch (error) {
      console.log("Erro ao recuperar sessão:", error);
      await limparSessao();
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarSessao();
  }, [carregarSessao]);

  const login = async (dados: LoginData) => {
    const resposta = await authService.login(dados);
    await salvarSessao(resposta);
  };

  const cadastro = async (dados: CadastroData) => {
    const resposta = await authService.cadastro(dados);
    await salvarSessao(resposta);
  };

  const logout = async () => {
    await limparSessao();
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        autenticado: !!usuario,
        login,
        cadastro,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
