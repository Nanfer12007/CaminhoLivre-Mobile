import api from "../api/api";

import {
  Avaliacao,
  AvaliacaoRequest,
  PaginaAvaliacoes,
} from "../types/Avaliacao";

export const avaliacaoService = {
  async listar(pagina = 0, tamanho = 100) {
    const response = await api.get<PaginaAvaliacoes>(
      "/api/avaliacoes",
      {
        params: { page: pagina, size: tamanho },
      }
    );
    return response.data;
  },

  async buscarPorId(id: number) {
    const response = await api.get<Avaliacao>(
      `/api/avaliacoes/${id}`
    );
    return response.data;
  },

  async criar(dados: AvaliacaoRequest, usuarioId: number) {
    const response = await api.post<Avaliacao>(
      "/api/avaliacoes",
      dados,
      { params: { usuarioId } }
    );
    return response.data;
  },

  async atualizar(id: number, dados: AvaliacaoRequest) {
    const response = await api.put<Avaliacao>(
      `/api/avaliacoes/${id}`,
      dados
    );
    return response.data;
  },

  async excluir(id: number) {
    await api.delete(`/api/avaliacoes/${id}`);
  },
};
