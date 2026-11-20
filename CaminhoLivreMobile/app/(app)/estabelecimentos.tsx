import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { estabelecimentoService } from "../../src/services/estabelecimentoService";
import { Estabelecimento } from "../../src/types/Estabelecimento";
import colors from "../../src/styles/colors";

export default function Estabelecimentos() {
  const [itens, setItens] = useState<Estabelecimento[]>([]);
  const [pagina, setPagina] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async (p = 0) => {
    try {
      setLoading(true);
      setErro("");

      const resposta =
        await estabelecimentoService.listar(p, 10);

      setItens(resposta.content);
      setPagina(resposta.number);
      setTotal(resposta.totalPages);
    } catch (error) {
      setErro("Não foi possível carregar os estabelecimentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar(0);
    }, [carregar])
  );

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
          Estabelecimentos
        </Text>
      </View>

      <Text style={styles.subtitulo}>
        Consulte informações de acessibilidade
        dos locais cadastrados.
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      ) : erro ? (
        <View>
          <Text style={styles.erro}>{erro}</Text>
          <Pressable onPress={() => carregar(pagina)}>
            <Text style={styles.link}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.vazio}>
              Nenhum estabelecimento cadastrado.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
                <Pressable
                  style={styles.botaoMapa}
                  onPress={() =>
                    router.push({
                  pathname: "/(app)/avaliacoes",
                  params: {
                estabelecimentoId: String(item.id),
              },
           })
      }
              accessibilityRole="button"
              accessibilityLabel={`Avaliar ${item.nome}`}
                >
              <Text style={styles.textoBotao}>
                Ver avaliações / Avaliar
             </Text>
                </Pressable>
              <View style={styles.cardCabecalho}>
                <Ionicons
                  name="business-outline"
                  size={26}
                  color={colors.primary}
                />

                <Text style={styles.nome}>
                  {item.nome}
                </Text>
              </View>

              <Text style={styles.descricao}>
                {item.descricao || "Sem descrição"}
              </Text>

              <View style={styles.linha}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={colors.secondary}
                />
                <Text style={styles.informacao}>
                  {item.endereco}
                </Text>
              </View>

              <View style={styles.linha}>
                <Ionicons
                  name="accessibility-outline"
                  size={18}
                  color={colors.secondary}
                />
                <Text style={styles.informacao}>
                  {item.acessibilidade || "Não informado"}
                </Text>
              </View>

              {item.latitude != null &&
                item.longitude != null && (
                  <Pressable
                    style={styles.botaoMapa}
                    onPress={() =>
                      router.push({
                        pathname: "/(app)/mapa",
                        params: {
                          lat: String(item.latitude),
                          lng: String(item.longitude),
                        },
                      })
                    }
                  >
                    <Text style={styles.textoBotao}>
                      Ver no mapa
                    </Text>
                  </Pressable>
                )}
            </View>
          )}
        />
      )}

      {!loading && !erro && total > 0 && (
        <View style={styles.paginacao}>
          <Pressable
            disabled={pagina === 0}
            onPress={() => carregar(pagina - 1)}
          >
            <Text style={styles.link}>Anterior</Text>
          </Pressable>

          <Text>{pagina + 1} / {total}</Text>

          <Pressable
            disabled={pagina + 1 >= total}
            onPress={() => carregar(pagina + 1)}
          >
            <Text style={styles.link}>Próxima</Text>
          </Pressable>
        </View>
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
    gap: 15,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  subtitulo: {
    color: colors.textSecondary,
    marginBottom: 22,
    lineHeight: 21,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    gap: 12,
  },
  cardCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  descricao: {
    color: colors.textSecondary,
    lineHeight: 21,
  },
  linha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  informacao: {
    flex: 1,
    color: colors.text,
  },
  botaoMapa: {
    backgroundColor: colors.primary,
    borderRadius: 9,
    padding: 13,
    alignItems: "center",
  },
  textoBotao: {
    color: colors.white,
    fontWeight: "bold",
  },
  paginacao: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  link: {
    color: colors.primary,
    fontWeight: "bold",
  },
  erro: {
    color: colors.danger,
    marginBottom: 12,
  },
  vazio: {
    textAlign: "center",
    marginTop: 30,
    color: colors.textSecondary,
  },
});
