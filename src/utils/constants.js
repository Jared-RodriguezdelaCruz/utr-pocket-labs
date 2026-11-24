// === roles que maneja la API, así no escribimos 'ADMIN' o 'USER' a mano ===
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

// === edificios con laboratorios, en el orden en que se muestran ===
export const BUILDINGS = [
  { id: 'A', label: 'Edificio A' },
  { id: 'B', label: 'Edificio B' },
  { id: 'D', label: 'Edificio D' },
  { id: 'SAC', label: 'SAC' },
  { id: 'VINC', label: 'Vinculación' },
];

// === laboratorios, la API no tiene un endpoint para pedirlos: id va a la API y label lo ve el usuario ===
export const LABS = [
  { id: 'AL-01', label: 'AL-01', building: 'A' },
  { id: 'AL-02', label: 'AL-02', building: 'A' },
  { id: 'BL-01', label: 'BL-01', building: 'B' },
  { id: 'BL-02', label: 'BL-02', building: 'B' },
  { id: 'BL-03', label: 'BL-03', building: 'B' },
  { id: 'BL-04', label: 'BL-04', building: 'B' },
  { id: 'BL-05', label: 'BL-05', building: 'B' },
  { id: 'DL-01', label: 'DL-01', building: 'D' },
  { id: 'DL-02', label: 'DL-02', building: 'D' },
  { id: 'DL-03', label: 'DL-03', building: 'D' },
  { id: 'DL-04', label: 'DL-04', building: 'D' },
  { id: 'SAC-1', label: 'SAC 1', building: 'SAC' },
  { id: 'SAC-2', label: 'SAC 2', building: 'SAC' },
  { id: 'VINC', label: 'VINC', building: 'VINC' },
];

// === la matrícula son exactamente 4 números, por ejemplo 1234 ===
export const MATRICULA_REGEX = /^\d{4}$/;

// === solo aceptamos correos institucionales que terminen en @utr.edu.mx ===
export const UTR_EMAIL_REGEX = /^[^\s@]+@utr\.edu\.mx$/i;

