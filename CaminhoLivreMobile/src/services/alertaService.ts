import { denunciaService } from "./denunciaService";
import { Denuncia } from "../types/Denuncia";

export type FiltroAlerta = "ATIVOS" | "RESOLVIDOS" | "TODOS";

export interface Alerta {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  gravidade: string | null;
  resumoIA: string | null;
  riscosIA: string | null;
  statusAnaliseIA: string | null;
  dataCriacao: string;
  latitude: number;
  longitude: number;
}

function transformarEmAlerta(denuncia: Denuncia): Alerta {
  return {
    id: denuncia.id,
    titulo: denuncia.titulo,
    descricao: denuncia.descricao,
    categoria: denuncia.categoria,
    status: denuncia.status,
    gravidade: denuncia.gravidade,
    resumoIA: denuncia.resumoIA,
    riscosIA: denuncia.riscosIA,
    statusAnaliseIA: denuncia.statusAnaliseIA,
    dataCriacao: denuncia.dataCriacao,
    latitude: denuncia.latitude,
    longitude: denuncia.longitude,
  };
}

export const alertaService = {
  async listar(filtro: FiltroAlerta = "ATIVOS") {
    const denuncias: Denuncia[] = [];
    let pagina = 0;
    let totalPaginas = 1;

    while (pagina < totalPaginas) {
      const resultado = await denunciaService.listar(pagina, 50);

      denuncias.push(...resultado.content);
      totalPaginas = resultado.totalPages;
      pagina++;
    }

    let filtradas = denuncias;

    if (filtro === "ATIVOS") {
      filtradas = denuncias.filter((item) =>
        ["ABERTA", "EM_ANALISE", "EM_ANDAMENTO"].includes(
          item.status
        )
      );
    }

    if (filtro === "RESOLVIDOS") {
      filtradas = denuncias.filter(
        (item) => item.status === "RESOLVIDA"
      );
    }

    return filtradas
      .map(transformarEmAlerta)
      .sort((a, b) => {
        const dataA = Date.parse(a.dataCriacao);
        const dataB = Date.parse(b.dataCriacao);

        return (Number.isFinite(dataB) ? dataB : 0) -
          (Number.isFinite(dataA) ? dataA : 0);
      });
  },
};
