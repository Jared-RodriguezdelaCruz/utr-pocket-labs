import apiClient from './apiClient';

// === el contrato no tiene endpoint de laboratorios, sacamos los nombres de todas las PCs, por ejemplo ['Lab-A', 'Lab-B', 'Redes'] ===
export async function getLabs() {
  const { data } = await apiClient.get('/labs/computers');
  const labNames = data.map((computer) => computer.laboratorio);
  // === quitamos los repetidos y los ordenamos ===
  return labNames.filter((labName, index) => labNames.indexOf(labName) === index).sort();
}

// === pide las PCs de un laboratorio, si estatus va vacío axios no lo manda y llegan todas ===
export async function getComputers({ laboratorio, estatus }) {
  const { data } = await apiClient.get('/labs/computers', {
    params: { laboratorio, estatus: estatus || undefined },
  });
  return data;
}

// === aparta una PC para el usuario, regresa algo como { assignmentId, estatus: 'ASIGNADA', inicio } ===
export async function assignComputer({ computerId, userId, materia, horasUso }) {
  const { data } = await apiClient.post('/labs/assignments', { computerId, userId, materia, horasUso });
  return data;
}
