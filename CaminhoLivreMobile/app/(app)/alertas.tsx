
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import {
  router,
  useFocusEffect,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  Alerta,
  FiltroAlerta,
  alertaService,
} from "../../src/services/alertaService";

import colors from "../../src/styles/colors";

const filtros: { label: string; value: FiltroAlerta }[] = [
  { label: "Ativos", value: "ATIVOS" },
  { label: "Resolvidos", value: "RESOLVIDOS" },
  { label: "Todos", value: "TODOS" },
];

function formatarTexto(valor: string | null | undefined) {
  if (!valor) return "Não informado";

  return valor.replace(/_/g, " ");
}

function corGravidade(gravidade: string | null) {
  switch (gravidade?.toUpperCase()) {
    case "CRITICA":
    case "CRÍTICA":
    case "ALTA":
      return "#C62828";
    case "MEDIA":
    case "MÉDIA":
      return "#B26A00";
    case "BAIXA":
      return "#237A55";
    default:
      return "#667085";
  }
}

export default function Alertas() {
  const [filtro, setFiltro] = useState<FiltroAlerta>("ATIVOS");
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = useCallback(
    async (manual = false) => {
      if (manual) {
        setAtualizando(true);
      } else {
        setLoading(true);
      }

      setErro("");

      try {
        const dados = await alertaService.listar(filtro);
        setAlertas(dados);
      } catch {
        setErro(
          "Não foi possível carregar os alertas. " +
          "Verifique sua conexão e a API Java."
        );
      } finally {
        setLoading(false);
        setAtualizando(false);
      }
    },
    [filtro]
  );

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function abrirDenuncia(id: number) {
    router.push({
      pathname: "/(app)/denuncias/[id]",
      params: { id: String(id) },
    });
  }

  function renderizarAlerta({ item }: { item: Alerta }) {
    const cor = corGravidade(item.gravidade);

    const data = item.dataCriacao
      ? new Date(item.dataCriacao)
      : null;

    const dataFormatada =
      data && !Number.isNaN(data.getTime())
        ? data.toLocaleDateString("pt-BR")
        : "Data não informada";

    return (
      <Pressable
        style={styles.card}
        onPress={() => abrirDenuncia(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Ver denúncia: ${item.titulo}`}
      >
        <View style={styles.cardCabecalho}>
          <View style={styles.icone}>
            <Ionicons
              name={
                item.status === "RESOLVIDA"
                  ? "checkmark-circle-outline"
                  : "warning-outline"
              }
              size={25}
              color={
                item.status === "RESOLVIDA"
                  ? "#237A55"
                  : colors.primary
              }
            />
          </View>

          <View style={styles.cardConteudo}>
            <Text style={styles.cardTitulo}>
              {item.titulo}
            </Text>

            <Text style={styles.data}>
              {dataFormatada}
            </Text>
          </View>
        </View>

        <Text style={styles.descricao} numberOfLines={3}>
          {item.descricao}
        </Text>

        <View style={styles.etiquetas}>
          <View style={styles.etiqueta}>
            <Text style={styles.etiquetaTexto}>
              {formatarTexto(item.status)}
            </Text>
          </View>

          {item.gravidade && (
            <View
              style={[
                styles.etiqueta,
                { borderColor: cor },
              ]}
            >
              <Text
                style={[
                  styles.etiquetaTexto,
                  { color: cor },
                ]}
              >
                Gravidade: {formatarTexto(item.gravidade)}
              </Text>
            </View>
          )}
        </View>

        {item.resumoIA && (
          <View style={styles.analise}>
            <View style={styles.linha}>
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.analiseTitulo}>
                Análise por IA
              </Text>
            </View>

            <Text style={styles.analiseTexto} numberOfLines={3}>
              {item.resumoIA}
            </Text>
          </View>
        )}

        <View style={styles.rodapeCard}>
          <Text style={styles.categoria}>
            {formatarTexto(item.categoria)}
          </Text>

          <Text style={styles.verDetalhes}>
            Ver detalhes →
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color={colors.primary}
          />
        </Pressable>

        <Text style={styles.titulo}>
          Alertas comunitários
        </Text>
      </View>

      <Text style={styles.subtitulo}>
        Acompanhe problemas de acessibilidade
        registrados pela comunidade.
      </Text>

      <View style={styles.filtros}>
        {filtros.map((opcao) => (
          <Pressable
            key={opcao.value}
            onPress={() => setFiltro(opcao.value)}
            style={[
              styles.filtro,
              filtro === opcao.value && styles.filtroAtivo,
            ]}
            accessibilityRole="button"
            accessibilityState={{
              selected: filtro === opcao.value,
            }}
          >
            <Text
              style={[
                styles.filtroTexto,
                filtro === opcao.value &&
                  styles.filtroTextoAtivo,
              ]}
            >
              {opcao.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.centro}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
          <Text>Carregando alertas...</Text>
        </View>
      ) : erro ? (
        <View style={styles.centro}>
          <Ionicons
            name="cloud-offline-outline"
            size={38}
            color={colors.danger}
          />

          <Text style={styles.mensagem}>{erro}</Text>

          <Pressable
            style={styles.botao}
            onPress={() => carregar()}
          >
            <Text style={styles.textoBotao}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderizarAlerta}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => carregar(true)}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.centro}>
              <Ionicons
                name="checkmark-circle-outline"
                size={45}
                color="#237A55"
              />

              <Text style={styles.mensagem}>
                Nenhum alerta encontrado para este filtro.
              </Text>
            </View>
          }
          ListHeaderComponent={
            <Text style={styles.contador}>
              {alertas.length} registro(s) encontrado(s)
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 48,
    backgroundColor: colors.background,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  titulo: {
    fontSize: 23,
    fontWeight: "bold",
    color: colors.primary,
    flex: 1,
  },
  subtitulo: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  filtros: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  filtro: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: "center",
  },
  filtroAtivo: {
    backgroundColor: colors.primary,
  },
  filtroTexto: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 13,
  },
  filtroTextoAtivo: {
    color: colors.white,
  },
  contador: {
    color: colors.textSecondary,
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    gap: 12,
  },
  cardCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EAF3FB",
    alignItems: "center",
    justifyContent: "center",
  },
  cardConteudo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.text,
  },
  data: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  descricao: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
  etiquetas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  etiqueta: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  etiquetaTexto: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
  analise: {
    backgroundColor: "#F0F7FC",
    padding: 12,
    borderRadius: 10,
    gap: 7,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  analiseTitulo: {
    fontWeight: "bold",
    color: colors.primary,
  },
  analiseTexto: {
    color: colors.text,
    lineHeight: 20,
  },
  rodapeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  categoria: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  verDetalhes: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 13,
  },
  centro: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    gap: 14,
  },
  mensagem: {
    textAlign: "center",
    color: colors.textSecondary,
    lineHeight: 22,
  },
  botao: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
  },
  textoBotao: {
    color: colors.white,
    fontWeight: "bold",
  },
});
