import apiClient from './api';

export interface Proyecto {
  id?: number;
  nombre: string;
  codigoProyecto?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  presupuesto?: number;
  objetivos?: string;
  cliente?: string;
  estadoProyecto: 'PLANIFICACION' | 'EN_EJECUCION' | 'SUSPENDIDO' | 'FINALIZADO' | 'CANCELADO';
  director?: {
    cedula: string;
    nombres: string;
    apellidos: string;
  };
}

export interface AsignacionProyecto {
  id: number;
  proyecto: Proyecto;
  personal: {
    cedula: string;
    nombres: string;
    apellidos: string;
    email: string;
  };
  rolEnProyecto: string;
  fechaAsignacion: string;
  horasDedicadas?: number;
}

export const proyectosService = {
  // Crear proyecto
  crear: async (proyecto: Proyecto): Promise<Proyecto> => {
    const response = await apiClient.post('/proyectos', proyecto);
    return response.data;
  },

  // Modificar proyecto
  modificar: async (id: number, proyecto: Proyecto): Promise<Proyecto> => {
    const response = await apiClient.put(`/proyectos/${id}`, proyecto);
    return response.data;
  },

  // Asignar personal
  asignarPersonal: async (proyectoId: number, cedula: string, rol: string): Promise<void> => {
    await apiClient.post(`/proyectos/${proyectoId}/asignar/${cedula}?rol=${rol}`);
  },

  // Obtener proyectos activos
  obtenerActivos: async (): Promise<Proyecto[]> => {
    const response = await apiClient.get('/proyectos/activos');
    return response.data;
  },

  // Cambiar estado
  cambiarEstado: async (id: number, estado: string): Promise<void> => {
    await apiClient.patch(`/proyectos/${id}/estado?estado=${estado}`);
  },

  // Buscar por ID
  buscarPorId: async (id: number): Promise<Proyecto> => {
    const response = await apiClient.get(`/proyectos/${id}`);
    return response.data;
  },

  // Listar todos
  listarTodos: async (): Promise<Proyecto[]> => {
    const response = await apiClient.get('/proyectos');
    return response.data;
  },

  // Buscar por estado
  buscarPorEstado: async (estado: string): Promise<Proyecto[]> => {
    const response = await apiClient.get(`/proyectos/estado/${estado}`);
    return response.data;
  },

  // Obtener personal asignado
  obtenerPersonal: async (proyectoId: number): Promise<AsignacionProyecto[]> => {
    const response = await apiClient.get(`/proyectos/${proyectoId}/personal`);
    return response.data;
  },

  // Subir documento
  subirDocumento: async (proyectoId: number, archivo: File): Promise<void> => {
    const formData = new FormData();
    formData.append('archivo', archivo);
    await apiClient.post(`/proyectos/${proyectoId}/documento`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Descargar documento
  descargarDocumento: async (proyectoId: number): Promise<Blob> => {
    const response = await apiClient.get(`/proyectos/${proyectoId}/documento`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Eliminar proyecto
  eliminar: async (id: number): Promise<void> => {
    await apiClient.delete(`/proyectos/${id}`);
  },
};
