
import { Stack, Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../../src/hooks/useAuth";
import colors from "../../src/styles/colors";

export default function AuthLayout() {
  const { autenticado, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (autenticado) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
