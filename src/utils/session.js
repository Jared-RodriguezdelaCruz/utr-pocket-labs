import * as SecureStore from 'expo-secure-store';

// === nombres con los que se guardan el token y el usuario en SecureStore ===
const TOKEN_KEY = 'utr_labs_token';
const USER_KEY = 'utr_labs_user';

// === regresa el token guardado o null si no hay sesión ===
export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

// === el usuario se guarda como texto, aquí lo regresamos a objeto ===
export async function getStoredUser() {
  const storedUser = await SecureStore.getItemAsync(USER_KEY);
  if (!storedUser) return null;
  // === si el texto guardado está roto mejor regresamos null que tronar la app ===
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

// === se llama después del login para guardar token y usuario ===
export async function saveSession({ token, user }) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

// === borra todo al cerrar sesión o cuando el token ya no sirve ===
export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

