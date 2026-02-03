import api from "./axios";

export const registro = (usuario) => api.post("/usuarios", usuario);
export const login = (credenciales) =>
  api.post("/usuarios/autenticar", credenciales);
export const modificarUsuario = (id, usuario) => api.put(`/usuarios/${id}`, usuario);
export const buscarPorId = (id) => api.get(`/usuarios/${id}`);
export const buscarPorCorreo = (correo) => api.get(`/usuarios/correo/${correo}`);
export const buscarPorCodigo = (codigo) => api.get(`/usuarios/codigo/${codigo}`);
export const buscarPorRol = (rol) => api.get(`/usuarios/rol/${rol}`);
export const listarUsuarios = () => api.get("/usuarios");
export const eliminarUsuario = (id) => api.delete(`/usuarios/${id}`);
