import apiClient from './api';

export interface Usuario {
  id: number;
  username: string;
  password?: string;
  tipoRol: 'ADMINISTRADOR' | 'JEFATURA' | 'DIRECTOR_PROYECTO' | 'EMPLEADO';
  estado: boolean;
  estaActivo: boolean;
  personal?: any;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface AutenticacionRequest {
  username: string;
  password: string;
}

export interface AutenticacionResponse {
  autenticado: boolean;
  usuario?: Usuario;
}

export const usuariosService = {
  // Autenticar usuario
  autenticar: async (data: AutenticacionRequest): Promise<AutenticacionResponse> => {
    const response = await apiClient.post('/usuarios/autenticar', data);
    // El backend devuelve el usuario directamente, no un objeto {autenticado, usuario}
    return {
      autenticado: true,
      usuario: response.data
    };
  },

  // Registrar usuario
  registrar: async (usuario: Partial<Usuario>, cedula?: string): Promise<Usuario> => {
    const response = await apiClient.post(
      cedula ? `/usuarios?cedula=${encodeURIComponent(cedula)}` : '/usuarios',
      usuario
    );
    return response.data;
  },

  // Modificar usuario
  modificar: async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
    const response = await apiClient.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  // Buscar por ID
  buscarPorId: async (id: number): Promise<Usuario> => {
    const response = await apiClient.get(`/usuarios/${id}`);
    return response.data;
  },

  // Buscar por correo
  buscarPorCorreo: async (correo: string): Promise<Usuario> => {
    const response = await apiClient.get(`/usuarios/correo/${correo}`);
    return response.data;
  },

  // Buscar por username
  buscarPorUsername: async (username: string): Promise<Usuario> => {
    const response = await apiClient.get(`/usuarios/username/${username}`);
    return response.data;
  },

  // Buscar por código
  buscarPorCodigo: async (codigo: string): Promise<Usuario> => {
    const response = await apiClient.get(`/usuarios/codigo/${codigo}`);
    return response.data;
  },

  // Buscar por rol
  buscarPorRol: async (rol: string): Promise<Usuario[]> => {
    const response = await apiClient.get(`/usuarios/rol/${rol}`);
    return response.data;
  },

  // Listar todos
  listarTodos: async (): Promise<Usuario[]> => {
    const response = await apiClient.get('/usuarios');
    return response.data;
  },

  // Eliminar usuario
  eliminar: async (id: number): Promise<void> => {
    await apiClient.delete(`/usuarios/${id}`);
  },
};
