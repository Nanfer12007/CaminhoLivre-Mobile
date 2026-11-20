import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import axios from "axios";

import { useAuth } from "../../src/hooks/useAuth";
import colors from "../../src/styles/colors";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    try {
      setErro("");
      setCarregando(true);

      await login({
        email: email.trim(),
        senha,
      });

      router.replace("/(app)");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.message ||
          "E-mail ou senha inválidos."
        );
      } else {
        setErro("Não foi possível realizar o login.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>♿</Text>
          <Text style={styles.titulo}>CaminhoLivre</Text>
          <Text style={styles.subtitulo}>
            Acessibilidade e inclusão para todos.
          </Text>
        </View>

        <View style={styles.formulario}>
          <Text style={styles.bemVindo}>Bem-vindo!</Text>

          <Text style={styles.descricao}>
            Entre na sua conta para continuar.
          </Text>

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          {erro ? (
            <Text style={styles.erro}>{erro}</Text>
          ) : null}

          <Pressable
            style={styles.botao}
            onPress={entrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBotao}>Entrar</Text>
            )}
          </Pressable>

          <View style={styles.rodape}>
            <Text style={styles.textoRodape}>
              Ainda não possui uma conta?
            </Text>

            <Pressable
              onPress={() => router.push("/(auth)/cadastro")}
            >
              <Text style={styles.link}>Cadastre-se</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 55,
    color: colors.primary,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.primary,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  formulario: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
  },
  bemVindo: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.text,
  },
  descricao: {
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
  },
  botao: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  textoBotao: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "bold",
  },
  erro: {
    color: colors.danger,
    marginTop: 12,
  },
  rodape: {
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  textoRodape: {
    color: colors.textSecondary,
  },
  link: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
