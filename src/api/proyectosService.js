import api from "./axios";

export const crearProyecto = (proyecto) => api.post("/proyectos", proyecto);
export const modificarProyecto = (id, proyecto) => api.put(`/proyectos/${id}`, proyecto);
export const asignarPersonal = (proyectoId, personalId, rol) =>
  api.post(`/proyectos/${proyectoId}/asignar/${personalId}?rol=${rol}`);
export const listarProyectos = () => api.get("/proyectos");
export const listarProyectosActivos = () => api.get("/proyectos/activos");
export const cambiarEstadoProyecto = (id, estado) =>
  api.patch(`/proyectos/${id}/estado?estado=${estado}`);
export const buscarProyectoPorId = (id) => api.get(`/proyectos/${id}`);
export const buscarProyectoPorCodigo = (codigo) => api.get(`/proyectos/codigo/${codigo}`);
export const buscarProyectosPorEstado = (estado) => api.get(`/proyectos/estado/${estado}`);
export const eliminarProyecto = (id) => api.delete(`/proyectos/${id}`);
