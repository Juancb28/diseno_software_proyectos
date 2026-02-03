import api from "./axios";

const base = "/contratos";

export const registrarContrato = (formData) =>
  api.post(base, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const listarContratos = () => api.get(base);
export const buscarContratoPorId = (id) => api.get(`${base}/${id}`);
export const listarContratosPorPersonal = (personalId) =>
  api.get(`${base}/personal/${personalId}`);
export const descargarContratoPDF = (id) =>
  api.get(`${base}/${id}/documento`, { responseType: "blob" });
export const eliminarContrato = (id) => api.delete(`${base}/${id}`);
