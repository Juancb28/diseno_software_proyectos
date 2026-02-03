import api from "./axios";

export const listarProyectos = () => api.get("/proyectos");
export const listarProyectosActivos = () => api.get("/proyectos/activos");
export const obtenerProyectoPorId = (id) => api.get(`/proyectos/${id}`);
export const crearProyecto = (proyecto) => api.post("/proyectos", proyecto);
export const actualizarProyecto = (id, proyecto) => api.put(`/proyectos/${id}`, proyecto);
export const eliminarProyecto = (id) => api.delete(`/proyectos/${id}`);