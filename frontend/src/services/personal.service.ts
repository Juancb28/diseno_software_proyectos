import apiClient from './api';

export interface Personal {
  id?: number;
  cedula: string;
  codigo?: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaIngreso?: string;
  tipoContrato?: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'POR_HORAS' | 'OCASIONAL' | 'SERVICIOS_PROFESIONALES';
  tieneContrato?: boolean;
  departamento?: string;
  estadoLaboral: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'DESPEDIDO';
}

export interface PersonalConProyectoDTO {
  personal: Personal;
  proyectoId: number;
  rolEnProyecto: string;
}

export const personalService = {
  // Registrar personal
  registrar: async (personal: Personal): Promise<Personal> => {
    const response = await apiClient.post('/personal', personal);
    return response.data;
  },

  // Registrar personal con proyecto
  registrarConProyecto: async (dto: PersonalConProyectoDTO): Promise<Personal> => {
    const response = await apiClient.post('/personal/con-proyecto', dto);
    return response.data;
  },

  // Modificar personal
  modificar: async (cedula: string, personal: Personal): Promise<Personal> => {
    const response = await apiClient.put(`/personal/${cedula}`, personal);
    return response.data;
  },

  // Cambiar estado laboral
  cambiarEstado: async (cedula: string, estado: string): Promise<void> => {
    await apiClient.patch(`/personal/${cedula}/estado?estado=${estado}`);
  },

  // Buscar por cédula
  buscarPorCedula: async (cedula: string): Promise<Personal> => {
    const response = await apiClient.get(`/personal/${cedula}`);
    return response.data;
  },

  // Buscar por código (usa cedula en backend)
  buscarPorCodigo: async (codigo: string): Promise<Personal> => {
    const response = await apiClient.get(`/personal/${codigo}`);
    return response.data;
  },

  // Buscar por estado
  buscarPorEstado: async (estado: string): Promise<Personal[]> => {
    const response = await apiClient.get(`/personal/estado/${estado}`);
    return response.data;
  },

  // Listar todos
  listarTodos: async (): Promise<Personal[]> => {
    const response = await apiClient.get('/personal');
    return response.data;
  },

  // Contabilizar por estado
  contabilizar: async (estado: string): Promise<number> => {
    const response = await apiClient.get(`/personal/contar/${estado}`);
    return response.data;
  },
};
