import React, { useState } from "react";

import {
  ScrollView,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";
import { useAuth } from "../../../src/hooks/useAuth";
import { denunciaService } from "../../../src/services/denunciaService";
import { CategoriaDenuncia } from "../../../src/types/Denuncia";
import colors from "../../../src/styles/colors";

const categorias: CategoriaDenuncia[] = [
  "CALCADA_DANIFICADA",
  "AUSENCIA_DE_RAMPA",
  "CALCADA_BLOQUEADA",
  "FALTA_DE_SINALIZACAO",
  "TRANSPORTE_INACESSIVEL",
  "OUTROS",
];

export default function NovaDenuncia() {
  const { usuario } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const [categoria, setCategoria] =
    useState<CategoriaDenuncia>("OUTROS");

  const [loading, setLoading] = useState(false);

  async function salvar() {
    const lat = Number(latitude.replace(",", "."));
    const lon = Number(longitude.replace(",", "."));

    if (
      !usuario ||
      !titulo.trim() ||
      !descricao.trim() ||
      !latitude.trim() ||
      !longitude.trim() ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      Math.abs(lat) > 90 ||
      Math.abs(lon) > 180
    ) {
      Alert.alert(
        "Dados inválidos",
        "Preencha título, descrição e coordenadas válidas."
      );
      return;
    }

    try {
      setLoading(true);

      await denunciaService.criar(
        {
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          latitude: lat,
          longitude: lon,
          categoria,
          fotoUrl: fotoUrl.trim() || null,
        },
        usuario.usuarioId
      );

      router.replace("/(app)/denuncias");
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível criar a denúncia."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Text style={styles.titulo}>
        Nova denúncia
      </Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex.: Calçada danificada"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { minHeight: 100 }]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
        textAlignVertical="top"
        placeholder="Descreva o problema"
      />

      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numbers-and-punctuation"
        placeholder="Ex.: -23.5505"
      />

      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numbers-and-punctuation"
        placeholder="Ex.: -46.6333"
      />

      <Text style={styles.label}>
        URL da foto (opcional)
      </Text>
      <TextInput
        style={styles.input}
        value={fotoUrl}
        onChangeText={setFotoUrl}
        autoCapitalize="none"
        placeholder="https://..."
      />

      <Text style={styles.label}>Categoria</Text>

      {categorias.map((item) => (
        <Pressable
          key={item}
          onPress={() => setCategoria(item)}
          style={[
            styles.opcao,
            categoria === item && styles.selecionado,
          ]}
        >
          <Text>
            {categoria === item ? "● " : "○ "}
            {item.replaceAll("_", " ")}
          </Text>
        </Pressable>
      ))}

      <Pressable
        disabled={loading}
        style={styles.botao}
        onPress={salvar}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.textoBotao}>
            Salvar denúncia
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.primary,
  },
  label: {
    marginTop: 15,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFFFFF",
    minHeight: 48,
  },
  opcao: {
    padding: 12,
    borderRadius: 8,
  },
  selecionado: {
    backgroundColor: "#D5E8F9",
  },
  botao: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    marginTop: 22,
  },
  textoBotao: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});
