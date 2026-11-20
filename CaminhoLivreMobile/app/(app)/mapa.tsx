import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";

import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useFocusEffect, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { denunciaService } from "../../src/services/denunciaService";
import { estabelecimentoService } from "../../src/services/estabelecimentoService";

import { Denuncia } from "../../src/types/Denuncia";
import { Estabelecimento } from "../../src/types/Estabelecimento";
import colors from "../../src/styles/colors";

const regiaoInicial: Region = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

function coordenadasValidas(
  latitude: number | null | undefined,
  longitude: number | null | undefined
) {
  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
  );
}

export default function Mapa() {
  const mapaRef = useRef<MapView>(null);
  const params = useLocalSearchParams<{
    lat?: string;
    lng?: string;
  }>();

  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [estabelecimentos, setEstabelecimentos] =
    useState<Estabelecimento[]>([]);

  const [loading, setLoading] = useState(true);
  const [mostrarDenuncias, setMostrarDenuncias] = useState(true);
  const [mostrarEstabelecimentos, setMostrarEstabelecimentos] =
    useState(true);
  const [localizacaoPermitida, setLocalizacaoPermitida] =
    useState(false);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);

      const [resultadoDenuncias, resultadoEstabelecimentos] =
        await Promise.allSettled([
          denunciaService.listar(0, 100),
          estabelecimentoService.listar(0, 100),
        ]);

      if (resultadoDenuncias.status === "fulfilled") {
        setDenuncias(resultadoDenuncias.value.content);
      } else {
        setDenuncias([]);
      }

      if (resultadoEstabelecimentos.status === "fulfilled") {
        setEstabelecimentos(
          resultadoEstabelecimentos.value.content
        );
      } else {
        setEstabelecimentos([]);
      }

      if (
        resultadoDenuncias.status === "rejected" ||
        resultadoEstabelecimentos.status === "rejected"
      ) {
        Alert.alert(
          "Atenção",
          "Alguns dados do mapa não puderam ser carregados."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  useEffect(() => {
    const lat = Number(params.lat);
    const lng = Number(params.lng);

    if (
      params.lat != null &&
      params.lng != null &&
      coordenadasValidas(lat, lng)
    ) {
      mapaRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 600);
    }
  }, [params.lat, params.lng, loading]);

  async function localizarUsuario() {
    try {
      const permissao =
        await Location.requestForegroundPermissionsAsync();

      if (permissao.status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Autorize a localização para centralizar o mapa."
        );
        return;
      }

      setLocalizacaoPermitida(true);

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      mapaRef.current?.animateToRegion({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 600);
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível obter sua localização."
      );
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapaRef}
        style={styles.mapa}
        initialRegion={regiaoInicial}
        showsUserLocation={localizacaoPermitida}
        showsMyLocationButton={false}
      >
        {mostrarDenuncias &&
          denuncias
            .filter((item) =>
              coordenadasValidas(item.latitude, item.longitude)
            )
            .map((item) => (
              <Marker
                key={`denuncia-${item.id}`}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.titulo}
                description={`${item.categoria} - ${item.status}`}
                pinColor="red"
                onCalloutPress={() =>
                  router.push({
                    pathname: "/(app)/denuncias/[id]",
                    params: { id: String(item.id) },
                  })
                }
              />
            ))}

        {mostrarEstabelecimentos &&
          estabelecimentos
            .filter((item) =>
              coordenadasValidas(item.latitude, item.longitude)
            )
            .map((item) => (
              <Marker
                key={`estabelecimento-${item.id}`}
                coordinate={{
                  latitude: item.latitude!,
                  longitude: item.longitude!,
                }}
                title={item.nome}
                description={
                  item.acessibilidade || item.endereco
                }
                pinColor="blue"
              />
            ))}
      </MapView>

      <View style={styles.cabecalho}>
        <Pressable
          onPress={() => router.back()}
          style={styles.voltar}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.primary}
          />
        </Pressable>

        <Text style={styles.titulo}>
          Mapa de acessibilidade
        </Text>
      </View>

      <View style={styles.filtros}>
        <Pressable
          onPress={() => setMostrarDenuncias(!mostrarDenuncias)}
          style={[
            styles.filtro,
            mostrarDenuncias && styles.filtroAtivo,
          ]}
        >
          <Text style={styles.filtroTexto}>
            Denúncias {mostrarDenuncias ? "✓" : ""}
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setMostrarEstabelecimentos(!mostrarEstabelecimentos)
          }
          style={[
            styles.filtro,
            mostrarEstabelecimentos && styles.filtroAtivo,
          ]}
        >
          <Text style={styles.filtroTexto}>
            Locais {mostrarEstabelecimentos ? "✓" : ""}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.localizacao}
        onPress={localizarUsuario}
        accessibilityRole="button"
        accessibilityLabel="Centralizar na minha localização"
      >
        <Ionicons
          name="locate"
          size={27}
          color={colors.primary}
        />
      </Pressable>

      {loading && (
        <View style={styles.carregando}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
          <Text>Carregando locais...</Text>
        </View>
      )}

      <View style={styles.legenda}>
        <Text style={styles.legendaTexto}>
          🔴 Denúncias    🔵 Estabelecimentos
        </Text>
        <Text style={styles.aviso}>
          Dados colaborativos. As condições das vias podem mudar.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapa: {
    ...StyleSheet.absoluteFillObject,
  },
  cabecalho: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    elevation: 3,
  },
  voltar: {
    padding: 4,
  },
  titulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.primary,
    flex: 1,
  },
  filtros: {
    position: "absolute",
    top: 120,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 8,
  },
  filtro: {
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 22,
    backgroundColor: colors.white,
    elevation: 2,
  },
  filtroAtivo: {
    backgroundColor: "#D8EAF8",
  },
  filtroTexto: {
    fontWeight: "bold",
    color: colors.primary,
  },
  localizacao: {
    position: "absolute",
    right: 16,
    bottom: 115,
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 30,
    elevation: 4,
  },
  carregando: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
  },
  legenda: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    elevation: 3,
  },
  legendaTexto: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
  },
  aviso: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
