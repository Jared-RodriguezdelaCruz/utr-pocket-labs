import apiClient from './apiClient';

// === pide los nombres de los laboratorios, por ejemplo ['Lab-A', 'Lab-B', 'Redes'] ===
export async function getLabs() {
  const { data } = await apiClient.get('/labs/computers/labs');
  return data;
}

// === pide las PCs de un laboratorio, si estatus va vacío axios no lo manda y llegan todas ===
export async function getComputers({ laboratorio, estatus }) {
  const { data } = await apiClient.get('/labs/computers', {
    params: { laboratorio, estatus: estatus || undefined },
  });
  return data;
}
