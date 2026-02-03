import api from './api';

export const listarProyectos = () => {
  return api.get('/proyectos');
};

export const listarProyectosActivos = () => {
  return api.get('/proyectos/activos');
};

export const obtenerProyectoPorId = (id) => {
  return api.get(`/proyectos/${id}`);
};

export const crearProyecto = (proyecto) => {
  return api.post('/proyectos', proyecto);
};
