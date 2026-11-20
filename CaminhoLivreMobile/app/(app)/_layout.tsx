import { Stack, Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";

import { useAuth } from "../../src/hooks/useAuth";
import colors from "../../src/styles/colors";

export default function AppLayout() {
  const { autenticado, carregando } = useAuth();

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  if (!autenticado) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="mapa" />
      <Stack.Screen name="denuncias" />
      <Stack.Screen name="estabelecimentos" />
      <Stack.Screen name="avaliacoes" />
      <Stack.Screen name="alertas" />
      <Stack.Screen name="perfil" />
    </Stack>
  );
}
