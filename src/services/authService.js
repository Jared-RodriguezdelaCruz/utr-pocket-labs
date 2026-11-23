import { ROLES } from '../utils/constants';
import apiClient from './apiClient';

// === manda correo y contraseña, la API regresa { token, user } ===
export async function login({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
}

// === crea la cuenta siempre como USER, el rol ADMIN lo asigna un admin después ===
export async function register({ nombre, matricula, email, password }) {
  const { data } = await apiClient.post('/auth/register', {
    nombre,
    matricula,
    email,
    password,
    rol: ROLES.USER,
  });
  return data;
}

