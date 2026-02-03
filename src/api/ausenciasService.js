import api from "./axios";

export const listarAusencias = () => api.get("/ausencias");
export const notificarAusencia = (personalId, data) =>
  api.post(`/ausencias/${personalId}`, data);
export const aprobarAusencia = (ausenciaId, aprobadorId) =>
  api.patch(`/ausencias/${ausenciaId}/aprobar/${aprobadorId}`);
export const rechazarAusencia = (ausenciaId, aprobadorId, motivo) =>
  api.patch(`/ausencias/${ausenciaId}/rechazar/${aprobadorId}?motivo=${encodeURIComponent(motivo || "")}`);
export const buscarAusenciaPorId = (id) => api.get(`/ausencias/${id}`);
export const ausenciasPorPersonal = (personalId) => api.get(`/ausencias/personal/${personalId}`);
export const ausenciasPendientes = () => api.get("/ausencias/pendientes");
