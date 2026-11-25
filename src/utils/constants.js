// === roles que maneja la API, así no escribimos 'ADMIN' o 'USER' a mano ===
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

// === estatus que puede tener una computadora, tal cual los manda la API ===
export const COMPUTER_STATUS = {
  DISPONIBLE: 'DISPONIBLE',
  OCUPADA: 'OCUPADA',
  MANTENIMIENTO: 'MANTENIMIENTO',
};

// === texto que ve el usuario para cada estatus ===
export const STATUS_LABELS = {
  [COMPUTER_STATUS.DISPONIBLE]: 'Disponible',
  [COMPUTER_STATUS.OCUPADA]: 'Ocupada',
  [COMPUTER_STATUS.MANTENIMIENTO]: 'Mantenimiento',
};

// === filtros del mapa, value vacío es "Todos" y no se manda a la API ===
export const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: COMPUTER_STATUS.DISPONIBLE, label: 'Disponibles' },
  { value: COMPUTER_STATUS.OCUPADA, label: 'Ocupadas' },
  { value: COMPUTER_STATUS.MANTENIMIENTO, label: 'Mantenimiento' },
];

// === horas que se pueden elegir al asignar una PC, como el segmentado del kit ===
export const SESSION_HOURS = [1, 2, 3, 4];

// === estatus de una asignación, tal cual los manda la API ===
export const ASSIGNMENT_STATUS = {
  ASIGNADA: 'ASIGNADA',
  LIBERADA: 'LIBERADA',
};

// === la matrícula son exactamente 4 números, por ejemplo 1234 ===
export const MATRICULA_REGEX = /^\d{4}$/;

// === cualquier correo con forma nombre@dominio.algo, el login lo usa porque las cuentas del profe son @equipo-c2.utr ===
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// === en el registro solo aceptamos correos institucionales que terminen en @utr.edu.mx ===
export const UTR_EMAIL_REGEX = /^[^\s@]+@utr\.edu\.mx$/i;

