import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import axios from "axios";

import { useAuth } from "../../src/hooks/useAuth";
import colors from "../../src/styles/colors";

export default function Cadastro() {
  const { cadastro } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha.length < 8 || senha.length > 72) {
      setErro("A senha deve ter entre 8 e 72 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setErro("");
      setCarregando(true);

      await cadastro({
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      router.replace("/(app)");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.message ||
          "Não foi possível realizar o cadastro."
        );
      } else {
        setErro("Erro ao cadastrar usuário.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.cabecalho}>
        <Text style={styles.logo}>♿</Text>

        <Text style={styles.titulo}>Criar conta</Text>

        <Text style={styles.subtitulo}>
          Faça parte de uma cidade mais acessível.
        </Text>
      </View>

      <View style={styles.formulario}>
        <Text style={styles.label}>Nome completo</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
          maxLength={100}
        />

        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={150}
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Mínimo de 8 caracteres"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite novamente sua senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        {erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : null}

        <Pressable
          style={styles.botao}
          onPress={cadastrar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBotao}>Cadastrar</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.voltar}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.link}>
            Já possui uma conta? Faça login
          </Text>
        </Pressable>
      </View>
    </ScrollView>
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
  cabecalho: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    fontSize: 50,
    color: colors.primary,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  formulario: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  botao: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
  voltar: {
    alignItems: "center",
    marginTop: 24,
  },
  link: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
