import axios from 'axios';
import { clearSession, getToken } from '../utils/session';

// === cliente único para hablar con la API, la URL sale del .env ===
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  // === 30 s de espera porque el servidor en Render puede tardar en despertar ===
  timeout: 30000,
});

// === antes de cada petición le pegamos el x-api-token y, si hay sesión, el Bearer ===
apiClient.interceptors.request.use(async (config) => {
  config.headers['x-api-token'] = process.env.EXPO_PUBLIC_API_APP_TOKEN;
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// === revisamos cada respuesta con error antes de que llegue a la pantalla ===
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const isAuthRequest = error.config?.url?.startsWith('/auth/');
    // === con 401 fuera de /auth solo borramos la sesión, la pantalla manda al login en su catch ===
    if (status === 401 && !isAuthRequest) {
      await clearSession();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
