import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import {
  useLocalSearchParams,
  useFocusEffect,
  router,
} from "expo-router";

import { denunciaService } from "../../../src/services/denunciaService";

import {
  Denuncia,
  DenunciaRequest,
} from "../../../src/types/Denuncia";

import { useAuth } from "../../../src/hooks/useAuth";
import colors from "../../../src/styles/colors";

export default function DetalheDenuncia() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();

  const [item, setItem] = useState<Denuncia | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const dados = await denunciaService.buscarPorId(
        Number(id)
      );

      setItem(dados);
      setTitulo(dados.titulo);
      setDescricao(dados.descricao);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível consultar esta denúncia."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function atualizar() {
    if (!item || !titulo.trim() || !descricao.trim()) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos."
      );
      return;
    }

    try {
      setLoading(true);

      const dados: DenunciaRequest = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoria: item.categoria,
        latitude: item.latitude,
        longitude: item.longitude,
        fotoUrl: item.fotoUrl,
      };

      await denunciaService.atualizar(item.id, dados);

      setEditando(false);
      await carregar();
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível atualizar a denúncia."
      );
    } finally {
      setLoading(false);
    }
  }

  function excluir() {
    if (!item) return;

    Alert.alert(
      "Excluir denúncia",
      "Deseja realmente excluir esta denúncia?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              await denunciaService.excluir(item.id);

              router.replace("/(app)/denuncias");
            } catch (error) {
              Alert.alert(
                "Erro",
                "Não foi possível excluir a denúncia."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }

  if (loading && !item) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={colors.primary}
      />
    );
  }

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Denúncia não encontrada.</Text>
      </View>
    );
  }

  const podeEditar =
    usuario?.papel === "GESTOR" ||
    usuario?.usuarioId === item.usuarioId;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>
        Detalhes da denúncia
      </Text>

      <Text style={styles.label}>Título</Text>

      {editando ? (
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
        />
      ) : (
        <Text>{item.titulo}</Text>
      )}

      <Text style={styles.label}>Descrição</Text>

      {editando ? (
        <TextInput
          style={styles.input}
          multiline
          value={descricao}
          onChangeText={setDescricao}
        />
      ) : (
        <Text>{item.descricao}</Text>
      )}

      <Text style={styles.label}>Categoria</Text>
      <Text>{item.categoria}</Text>

      <Text style={styles.label}>Status</Text>
      <Text>{item.status}</Text>

      <Text style={styles.label}>Coordenadas</Text>
      <Text>
        {item.latitude}, {item.longitude}
      </Text>

      <Text style={styles.label}>
        Análise por Inteligência Artificial
      </Text>

      <Text>
        Status: {item.statusAnaliseIA || "Não disponível"}
      </Text>

      {item.gravidade && (
        <Text>Gravidade: {item.gravidade}</Text>
      )}

      {item.resumoIA && (
        <Text>Resumo: {item.resumoIA}</Text>
      )}

      {item.riscosIA && (
        <Text>Riscos: {item.riscosIA}</Text>
      )}

      {podeEditar && (
        editando ? (
          <Pressable
            style={styles.botao}
            onPress={atualizar}
            disabled={loading}
          >
            <Text style={styles.textoBotao}>
              Salvar alterações
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.botao}
            onPress={() => setEditando(true)}
          >
            <Text style={styles.textoBotao}>
              Editar denúncia
            </Text>
          </Pressable>
        )
      )}

      {podeEditar && (
        <Pressable
          style={[
            styles.botao,
            { backgroundColor: colors.danger },
          ]}
          onPress={excluir}
          disabled={loading}
        >
          <Text style={styles.textoBotao}>
            Excluir denúncia
          </Text>
        </Pressable>
      )}

      {loading && (
        <ActivityIndicator color={colors.primary} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: colors.background,
  },
  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  botao: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 18,
  },
  textoBotao: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});
