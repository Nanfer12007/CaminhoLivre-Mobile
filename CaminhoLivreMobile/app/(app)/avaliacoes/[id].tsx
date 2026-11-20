
import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, Pressable,
  ActivityIndicator, Alert, StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { avaliacaoService } from "../../../src/services/avaliacaoService";
import { useAuth } from "../../../src/hooks/useAuth";
import { Avaliacao } from "../../../src/types/Avaliacao";
import colors from "../../../src/styles/colors";

export default function EditarAvaliacao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();

  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const dados = await avaliacaoService.buscarPorId(Number(id));

        if (ativo) {
          setAvaliacao(dados);
          setNota(dados.nota);
          setComentario(dados.comentario || "");
        }
      } catch {
        Alert.alert("Erro", "Não foi possível carregar a avaliação.");
      } finally {
        if (ativo) setLoading(false);
      }
    }

    if (id && Number.isSafeInteger(Number(id)) && Number(id) > 0) {
      carregar();
    } else {
      setLoading(false);
    }

    return () => { ativo = false; };
  }, [id]);

  const permitido =
    !!avaliacao && avaliacao.usuarioId === usuario?.usuarioId;

  async function salvar() {
    if (!avaliacao || !permitido || salvando) return;

    try {
      setSalvando(true);

      await avaliacaoService.atualizar(avaliacao.id, {
        nota,
        comentario: comentario.trim(),
        estabelecimentoId: avaliacao.estabelecimentoId,
      });

      Alert.alert("Sucesso", "Avaliação atualizada.");
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar.");
    } finally {
      setSalvando(false);
    }
  }

  function excluir() {
    if (!avaliacao || !permitido || salvando) return;

    Alert.alert(
      "Excluir avaliação",
      "Deseja realmente excluir sua avaliação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setSalvando(true);
              await avaliacaoService.excluir(avaliacao.id);
              router.back();
            } catch {
              Alert.alert("Erro", "Não foi possível excluir.");
            } finally {
              setSalvando(false);
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={colors.primary}
      />
    );
  }

  if (!permitido) {
    return (
      <View style={styles.container}>
        <Text>
          Avaliação não encontrada ou acesso não permitido.
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar avaliação</Text>

      <Text style={styles.label}>Sua nota</Text>

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
              size={36}
              color="#D69E16"
            />
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Comentário</Text>

      <TextInput
        style={styles.input}
        multiline
        textAlignVertical="top"
        value={comentario}
        onChangeText={setComentario}
        maxLength={1000}
        placeholder="Descreva sua experiência"
      />

      <Pressable
        style={styles.botao}
        onPress={salvar}
        disabled={salvando}
      >
        <Text style={styles.textoBotao}>
          {salvando ? "Salvando..." : "Salvar alterações"}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.botao, styles.excluir]}
        onPress={excluir}
        disabled={salvando}
      >
        <Text style={styles.textoBotao}>
          Excluir avaliação
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 55,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 25,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  estrelas: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  input: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    fontSize: 16,
  },
  botao: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  excluir: {
    backgroundColor: colors.danger,
  },
  textoBotao: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: colors.primary,
    marginTop: 20,
  },
});
