import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona automaticamente o JWT nas requisições
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(
    "caminholivre_token"
  );

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
