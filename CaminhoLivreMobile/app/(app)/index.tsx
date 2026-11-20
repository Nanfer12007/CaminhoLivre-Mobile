import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { router, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../src/hooks/useAuth";
import colors from "../../src/styles/colors";

type NomeIcone =
  React.ComponentProps<typeof Ionicons>["name"];

interface Opcao {
  titulo: string;
  descricao: string;
  icone: NomeIcone;
  rota: Href;
}

const opcoes: Opcao[] = [
  {
    titulo: "Mapa acessível",
    descricao: "Explore locais e obstáculos.",
    icone: "map-outline",
    rota: "/(app)/mapa",
  },
  {
    titulo: "Denúncias",
    descricao: "Consulte problemas da cidade.",
    icone: "warning-outline",
    rota: "/(app)/denuncias",
  },
  {
    titulo: "Nova denúncia",
    descricao: "Registre um problema.",
    icone: "add-circle-outline",
    rota: "/(app)/denuncias/nova",
  },
  {
    titulo: "Estabelecimentos",
    descricao: "Encontre locais acessíveis.",
    icone: "business-outline",
    rota: "/(app)/estabelecimentos",
  },
  {
    titulo: "Alertas",
    descricao: "Acompanhe os avisos.",
    icone: "notifications-outline",
    rota: "/(app)/alertas",
  },
  {
    titulo: "Meu perfil",
    descricao: "Consulte sua conta.",
    icone: "person-outline",
    rota: "/(app)/perfil",
  },
];

export default function Inicio() {
  const { usuario } = useAuth();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <View style={styles.cabecalho}>
        <View style={styles.logo}>
          <Ionicons
            name="accessibility"
            size={30}
            color={colors.white}
          />
        </View>

        <View>
          <Text style={styles.marca}>CaminhoLivre</Text>
          <Text style={styles.slogan}>
            Sua cidade mais acessível
          </Text>
        </View>
      </View>

      <Text style={styles.saudacao}>
        Olá, {usuario?.nome || "usuário"}!
      </Text>

      <Text style={styles.subtitulo}>
        Por onde vamos começar?
      </Text>

      <Pressable
        style={styles.destaque}
        onPress={() => router.push("/(app)/mapa")}
        accessibilityRole="button"
      >
        <Ionicons
          name="navigate-circle-outline"
          size={42}
          color={colors.white}
        />

        <Text style={styles.destaqueTitulo}>
          Explore sua cidade
        </Text>

        <Text style={styles.destaqueDescricao}>
          Visualize estabelecimentos acessíveis
          e problemas registrados no mapa.
        </Text>

        <Text style={styles.destaqueLink}>
          Abrir mapa →
        </Text>
      </Pressable>

      <Text style={styles.secao}>Funcionalidades</Text>

      <View style={styles.grade}>
        {opcoes.map((opcao) => (
          <Pressable
            key={opcao.titulo}
            style={styles.card}
            onPress={() => router.push(opcao.rota)}
            accessibilityRole="button"
            accessibilityLabel={opcao.titulo}
          >
            <View style={styles.cardIcone}>
              <Ionicons
                name={opcao.icone}
                size={27}
                color={colors.primary}
              />
            </View>

            <Text style={styles.cardTitulo}>
              {opcao.titulo}
            </Text>

            <Text style={styles.cardDescricao}>
              {opcao.descricao}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.rodape}>
        Construindo cidades mais inclusivas.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: 20,
    paddingTop: 48,
    paddingBottom: 35,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 12,
  },
  logo: {
    width: 52,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  marca: {
    fontSize: 23,
    fontWeight: "bold",
    color: colors.primary,
  },
  slogan: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  saudacao: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitulo: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
    marginBottom: 22,
  },
  destaque: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 22,
    marginBottom: 28,
    gap: 10,
  },
  destaqueTitulo: {
    fontSize: 23,
    fontWeight: "bold",
    color: colors.white,
  },
  destaqueDescricao: {
    fontSize: 15,
    color: colors.white,
    lineHeight: 22,
  },
  destaqueLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    marginTop: 8,
  },
  secao: {
    fontSize: 21,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    minHeight: 155,
  },
  cardIcone: {
    backgroundColor: "#EAF3FB",
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  cardDescricao: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 18,
  },
  rodape: {
    textAlign: "center",
    marginTop: 20,
    color: colors.textSecondary,
  },
});
