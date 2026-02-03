import api from "./axios";

export const listarProyectos = () => api.get("/proyectos");
export const listarProyectosActivos = () => api.get("/proyectos/activos");
export const obtenerProyectoPorId = (id) => api.get(`/proyectos/${id}`);
export const crearProyecto = (proyecto) => api.post("/proyectos", proyecto);
