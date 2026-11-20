import api from "../api/api";
import {
  Estabelecimento,
  PaginaEstabelecimentos,
} from "../types/Estabelecimento";

export const estabelecimentoService = {
  async listar(pagina = 0, tamanho = 10) {
    const response =
      await api.get<PaginaEstabelecimentos>(
        "/api/estabelecimentos",
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
    const response = await api.get<Estabelecimento>(
      `/api/estabelecimentos/${id}`
    );

    return response.data;
  },
};