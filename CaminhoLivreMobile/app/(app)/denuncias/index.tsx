import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

import { useFocusEffect, router } from "expo-router";

import { denunciaService } from "../../../src/services/denunciaService";
import { Denuncia } from "../../../src/types/Denuncia";
import colors from "../../../src/styles/colors";

export default function Denuncias() {
  const [itens, setItens] = useState<Denuncia[]>([]);
  const [pagina, setPagina] = useState(0);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async (p = 0) => {
    setLoading(true);

    try {
      const dados = await denunciaService.listar(p);

      setItens(dados.content);
      setPagina(dados.number);
      setTotal(dados.totalPages);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível carregar denúncias. Confira a API e sua sessão."
      );
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
      <Text style={styles.titulo}>Denúncias</Text>

      <Pressable
        style={styles.botao}
        onPress={() => router.push("/(app)/denuncias/nova")}
      >
        <Text style={styles.textoBotao}>
          + Nova denúncia
        </Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <Text>Nenhuma denúncia encontrada.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/(app)/denuncias/[id]",
                  params: { id: String(item.id) },
                })
              }
            >
              <Text style={styles.cardTitulo}>
                {item.titulo}
              </Text>

              <Text>
                {item.categoria} · {item.status}
              </Text>

              <Text numberOfLines={2}>
                {item.descricao}
              </Text>
            </Pressable>
          )}
        />
      )}

      <View style={styles.paginacao}>
        <Pressable
          disabled={pagina === 0 || loading}
          onPress={() => carregar(pagina - 1)}
        >
          <Text>Anterior</Text>
        </Pressable>

        <Text>
          {total ? pagina + 1 : 0} / {total}
        </Text>

        <Pressable
          disabled={pagina + 1 >= total || loading}
          onPress={() => carregar(pagina + 1)}
        >
          <Text>Próxima</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
  },
  botao: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    gap: 6,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paginacao: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
});
