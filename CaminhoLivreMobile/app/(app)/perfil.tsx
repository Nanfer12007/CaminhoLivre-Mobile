import React from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { useAuth } from "../../src/hooks/useAuth";
import colors from "../../src/styles/colors";

export default function Perfil() {
  const { usuario, logout } = useAuth();

  async function sair() {
    await logout();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu perfil</Text>

      <View style={styles.card}>
        <Text style={styles.nome}>
          {usuario?.nome}
        </Text>

        <Text style={styles.info}>
          {usuario?.email}
        </Text>

        <Text style={styles.info}>
          Tipo de usuário: {usuario?.papel}
        </Text>
      </View>

      <Pressable
        style={styles.botao}
        onPress={sair}
      >
        <Text style={styles.textoBotao}>
          Sair da conta
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
    justifyContent: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 25,
  },
  card: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 14,
    marginBottom: 25,
  },
  nome: {
    fontSize: 21,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  info: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 8,
  },
  botao: {
    backgroundColor: colors.danger,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotao: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
