import api from "../api/api";

import {
  Denuncia,
  DenunciaRequest,
  Pagina,
} from "../types/Denuncia";

export const denunciaService = {
  async listar(pagina = 0, tamanho = 10) {
    const response = await api.get<Pagina<Denuncia>>(
      "/api/denuncias",
      {
        params: {
          page: pagina,
          size: tamanho,
        },
      }
    );

    return response.data;
  },

  async buscarPorId(id: number) {
    const response = await api.get<Denuncia>(
      `/api/denuncias/${id}`
    );

    return response.data;
  },

  async criar(
    dados: DenunciaRequest,
    usuarioId: number
  ) {
    const response = await api.post<Denuncia>(
      "/api/denuncias",
      dados,
      {
        params: { usuarioId },
      }
    );

    return response.data;
  },

  async atualizar(
    id: number,
    dados: DenunciaRequest
  ) {
    const response = await api.put<Denuncia>(
      `/api/denuncias/${id}`,
      dados
    );

    return response.data;
  },

  async excluir(id: number) {
    await api.delete(
      `/api/denuncias/${id}`
    );
  },
};
