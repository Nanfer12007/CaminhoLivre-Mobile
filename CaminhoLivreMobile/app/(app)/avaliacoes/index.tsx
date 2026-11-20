import React, { useCallback, useState } from "react";
import {
  View, Text, TextInput, Pressable, FlatList,
  ActivityIndicator, Alert, StyleSheet,
} from "react-native";
import {
  router, useFocusEffect, useLocalSearchParams,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../../src/hooks/useAuth";
import { avaliacaoService } from "../../../src/services/avaliacaoService";
import { Avaliacao } from "../../../src/types/Avaliacao";
import colors from "../../../src/styles/colors";

export default function Avaliacoes() {
  const { estabelecimentoId } = useLocalSearchParams<{
    estabelecimentoId?: string;
  }>();

  const { usuario } = useAuth();
  const idEstabelecimento = Number(estabelecimentoId);
  const idValido = Number.isSafeInteger(idEstabelecimento)
    && idEstabelecimento > 0;

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    if (!idValido) return;

    setLoading(true);
    setErro("");

    try {
      // O backend ainda não possui filtro por estabelecimento.
      // Percorremos todas as páginas para não omitir avaliações.
      let pagina = 0;
      let total = 1;
      const resultado: Avaliacao[] = [];

      while (pagina < total) {
        const dados = await avaliacaoService.listar(pagina, 50);
        resultado.push(...dados.content);
        total = dados.totalPages;
        pagina++;
      }

      setAvaliacoes(
        resultado.filter(
          (a) => a.estabelecimentoId === idEstabelecimento
        )
      );
    } catch {
      setErro("Não foi possível carregar as avaliações.");
    } finally {
      setLoading(false);
    }
  }, [idEstabelecimento, idValido]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const minhaAvaliacao = avaliacoes.find(
    (a) => a.usuarioId === usuario?.usuarioId
  );

  const media = avaliacoes.length
    ? (
        avaliacoes.reduce((soma, a) => soma + a.nota, 0) /
        avaliacoes.length
      ).toFixed(1)
    : null;

  async function enviar() {
    if (!usuario || !idValido) {
      Alert.alert("Erro", "Usuário ou estabelecimento inválido.");
      return;
    }

    if (minhaAvaliacao) {
      Alert.alert(
        "Atenção",
        "Você já avaliou este estabelecimento. Edite sua avaliação."
      );
      return;
    }

    if (comentario.length > 1000) {
      Alert.alert("Atenção", "Máximo de 1000 caracteres.");
      return;
    }

    try {
      setSalvando(true);

      await avaliacaoService.criar(
        {
          nota,
          comentario: comentario.trim(),
          estabelecimentoId: idEstabelecimento,
        },
        usuario.usuarioId
      );

      setComentario("");
      setNota(5);
      await carregar();

      Alert.alert("Sucesso", "Avaliação cadastrada!");
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar a avaliação."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (!idValido) {
    return (
      <View style={styles.container}>
        <Text>Estabelecimento inválido.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
      >
        <Text style={styles.voltar}>← Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Avaliações</Text>

      <Text style={styles.subtitulo}>
        {media
          ? `Média: ${media}/5 • ${avaliacoes.length} avaliações`
          : "Nenhuma avaliação cadastrada"}
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : erro ? (
        <Pressable onPress={carregar}>
          <Text style={styles.erro}>{erro} Tentar novamente.</Text>
        </Pressable>
      ) : (
        <FlatList
          data={avaliacoes}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListHeaderComponent={
            minhaAvaliacao ? (
              <Pressable
                style={styles.botao}
                onPress={() => router.push({
                  pathname: "/(app)/avaliacoes/[id]",
                  params: { id: String(minhaAvaliacao.id) },
                })}
              >
                <Text style={styles.textoBotao}>
                  Editar minha avaliação
                </Text>
              </Pressable>
            ) : (
              <View style={styles.formulario}>
                <Text style={styles.secao}>
                  Avalie este estabelecimento
                </Text>

                <View style={styles.estrelas}>
                  {[1, 2, 3, 4, 5].map((valor) => (
                    <Pressable
                      key={valor}
                      onPress={() => setNota(valor)}
                      accessibilityRole="button"
                      accessibilityLabel={`${valor} estrelas`}
                    >
                      <Ionicons
                        name={valor <= nota ? "star" : "star-outline"}
                        size={35}
                        color="#D69E16"
                      />
                    </Pressable>
                  ))}
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Conte sua experiência de acessibilidade"
                  multiline
                  value={comentario}
                  onChangeText={setComentario}
                  maxLength={1000}
                  textAlignVertical="top"
                />

                <Pressable
                  style={styles.botao}
                  onPress={enviar}
                  disabled={salvando}
                >
                  <Text style={styles.textoBotao}>
                    {salvando ? "Enviando..." : "Enviar avaliação"}
                  </Text>
                </Pressable>
              </View>
            )
          }
          ListEmptyComponent={
            <Text style={styles.vazio}>
              Seja a primeira pessoa a avaliar este local.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nota}>
                {"★".repeat(item.nota)}
                {"☆".repeat(5 - item.nota)}
              </Text>
              <Text style={styles.comentario}>
                {item.comentario || "Sem comentário"}
              </Text>
              <Text style={styles.data}>
                {item.dataAvaliacao
                  ? new Date(item.dataAvaliacao).toLocaleDateString("pt-BR")
                  : ""}
              </Text>
              {item.usuarioId === usuario?.usuarioId && (
                <Pressable
                  onPress={() => router.push({
                    pathname: "/(app)/avaliacoes/[id]",
                    params: { id: String(item.id) },
                  })}
                >
                  <Text style={styles.link}>Editar ou excluir</Text>
                </Pressable>
              )}
            </View>
          )}
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
  voltar: {
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 27,
    fontWeight: "bold",
    color: colors.primary,
  },
  subtitulo: {
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 18,
  },
  formulario: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },
  secao: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.text,
  },
  estrelas: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    minHeight: 100,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  botao: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  textoBotao: {
    color: colors.white,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  nota: {
    fontSize: 23,
    color: "#D69E16",
  },
  comentario: {
    color: colors.text,
    fontSize: 15,
  },
  data: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  link: {
    color: colors.primary,
    fontWeight: "bold",
  },
  erro: {
    color: colors.danger,
    marginBottom: 15,
  },
  vazio: {
    color: colors.textSecondary,
    textAlign: "center",
    padding: 20,
  },
});
