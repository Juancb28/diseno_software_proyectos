import api from "./axios";

export const registrarBiometria = (personalId, data) =>
  api.post(`/biometria/registrar/${personalId}`, data);
export const activarBiometria = (datoBiometricoId) =>
  api.patch(`/biometria/activar/${datoBiometricoId}`);
export const desactivarBiometria = (datoBiometricoId) =>
  api.patch(`/biometria/desactivar/${datoBiometricoId}`);
export const verificarHuella = (data) => api.post("/biometria/verificar", data);
export const registrarAsistencia = (personalId, tipoRegistro) =>
  api.post(`/biometria/asistencia/${personalId}?tipoRegistro=${tipoRegistro || "ENTRADA"}`);
export const obtenerDatosBiometricos = (personalId) =>
  api.get(`/biometria/datos/${personalId}`);
export const obtenerRegistrosAsistencia = (personalId) =>
  api.get(`/biometria/asistencia/${personalId}`);
export const obtenerRegistrosPorFecha = (personalId, fecha) =>
  api.get(`/biometria/asistencia/${personalId}/fecha?fecha=${fecha}`);
