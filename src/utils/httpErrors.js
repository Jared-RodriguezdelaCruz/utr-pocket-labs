// === mensajes por código HTTP para cuando la API no manda su propio mensaje ===
const STATUS_MESSAGES = {
  400: 'Datos inválidos. Revisa el formulario.',
  401: 'Credenciales inválidas o sesión expirada.',
  403: 'Acceso restringido: no tienes permisos para esta acción.',
  404: 'Recurso no encontrado.',
  500: 'Error interno del servidor. Intenta más tarde.',
};

// === convierte el error de axios en un texto que se pueda mostrar en pantalla ===
export function getErrorMessage(error) {
  // === sin response es que ni siquiera llegamos al servidor ===
  if (!error.response) return 'No hay conexión con el servidor.';
  const { status, data } = error.response;
  // === si la API mandó su mensaje usamos ese ===
  if (data?.message) return data.message;
  if (status >= 500) return STATUS_MESSAGES[500];
  return STATUS_MESSAGES[status] ?? 'Ocurrió un error inesperado.';
}

