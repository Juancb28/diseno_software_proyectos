import apiClient from './api';

export interface Contrato {
  id?: number;
  personal: {
    cedula: string;
    codigo?: string;
    nombres: string;
    apellidos: string;
  };
  fechaInicio: string;
  fechaFin?: string;
  salario?: number;
  estaActivo?: boolean;
  archivoSubido?: boolean;
  nombreDocumento?: string;
}

export const contratosService = {
  // Crear contrato
  crear: async (cedula: string, contrato: Partial<Contrato>, archivo?: File): Promise<Contrato> => {
    const formData = new FormData();
    formData.append('contrato', new Blob([JSON.stringify(contrato)], { type: 'application/json' }));
    if (archivo) {
      formData.append('archivo', archivo);
    }
    const response = await apiClient.post(`/contratos/crear/${cedula}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Modificar contrato
  modificar: async (id: number, contrato: Partial<Contrato>): Promise<Contrato> => {
    const response = await apiClient.put(`/contratos/${id}`, contrato);
    return response.data;
  },

  // Buscar por ID
  buscarPorId: async (id: number): Promise<Contrato> => {
    const response = await apiClient.get(`/contratos/${id}`);
    return response.data;
  },

  // Buscar por personal
  buscarPorPersonal: async (cedula: string): Promise<Contrato[]> => {
    const response = await apiClient.get(`/contratos/personal/${cedula}`);
    return response.data;
  },

  // Obtener último contrato por personal (solo ID)
  obtenerUltimoIdPorPersonal: async (cedula: string): Promise<number | null> => {
    try {
      const response = await apiClient.get(`/contratos/personal/${cedula}/ultimo-id`);
      return response.data ?? null;
    } catch (error) {
      return null;
    }
  },

  // Subir documento
  subirDocumento: async (id: number, archivo: File): Promise<void> => {
    const formData = new FormData();
    formData.append('archivo', archivo);
    await apiClient.post(`/contratos/${id}/archivo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Descargar archivo
  descargarArchivo: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/contratos/${id}/archivo`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Listar todos
  listarTodos: async (): Promise<Contrato[]> => {
    const response = await apiClient.get('/contratos');
    return response.data;
  },

  // Eliminar
  eliminar: async (id: number): Promise<void> => {
    await apiClient.delete(`/contratos/${id}`);
  },
};
