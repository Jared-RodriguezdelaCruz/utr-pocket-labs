// === roles que maneja la API, así no escribimos 'ADMIN' o 'USER' a mano ===
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

// === la matrícula son exactamente 4 números, por ejemplo 1234 ===
export const MATRICULA_REGEX = /^\d{4}$/;

// === solo aceptamos correos institucionales que terminen en @utr.edu.mx ===
export const UTR_EMAIL_REGEX = /^[^\s@]+@utr\.edu\.mx$/i;

