import api from "./axios";

export const registrarPersonal = (data) => api.post("/personal", data);
export const registrarConProyecto = (data) => api.post("/personal/con-proyecto", data);
export const modificarPersonal = (id, data) => api.put(`/personal/${id}`, data);
export const cambiarEstadoPersonal = (id, estado) =>
  api.patch(`/personal/${id}/estado?estado=${estado}`);
export const listarPersonal = () => api.get("/personal");
export const buscarPersonalPorId = (id) => api.get(`/personal/${id}`);
export const buscarPersonalPorCodigo = (codigo) => api.get(`/personal/codigo/${codigo}`);
export const buscarPersonalPorNui = (nui) => api.get(`/personal/nui/${nui}`);
export const buscarPersonalPorEstado = (estado) => api.get(`/personal/estado/${estado}`);
export const contarPersonalPorEstado = (estado) => api.get(`/personal/contar/${estado}`);
export const eliminarPersonal = (id) => api.delete(`/personal/${id}`);