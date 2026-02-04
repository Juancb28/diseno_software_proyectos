import apiClient from './api';

export interface Avance {
  id: number;
  proyectoId: number;
  proyectoNombre: string;
  directorId: number;
  directorNombre: string;
  jefaturaId?: number;
  jefaturaNombre?: string;
  semestre: string;
  fechaCreacion: string;
  estadoAvance: 'APROBADO' | 'PENDIENTE' | 'RECHAZADO';
  fechaRevision?: string;
  observaciones?: string;
  nombreArchivo?: string;
}

export const avancesService = {
  // Subir avance
  subirAvance: async (proyectoId: number, directorId: number, semestre: string, archivo: File): Promise<Avance> => {
    const formData = new FormData();
    formData.append('proyectoId', proyectoId.toString());
    formData.append('directorId', directorId.toString());
    formData.append('semestre', semestre);
    formData.append('archivo', archivo);

    const response = await apiClient.post('/avances/subir', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Listar avances por proyecto
  listarPorProyecto: async (proyectoId: number): Promise<Avance[]> => {
    const response = await apiClient.get(`/avances/proyecto/${proyectoId}`);
    return response.data;
  },

  // Descargar PDF
  descargarPdf: async (avanceId: number): Promise<Blob> => {
    const response = await apiClient.get(`/avances/${avanceId}/descargar`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Eliminar PDF
  eliminarPdf: async (avanceId: number): Promise<void> => {
    await apiClient.delete(`/avances/${avanceId}/pdf`);
  },

  // Aprobar avance
  aprobarAvance: async (avanceId: number, jefaturaId: number, observaciones: string): Promise<Avance> => {
    const response = await apiClient.put(`/avances/${avanceId}/revisar`, {
      jefaturaId,
      estado: 'APROBADO',
      observaciones,
    });
    return response.data;
  },

  // Rechazar avance
  rechazarAvance: async (avanceId: number, jefaturaId: number, observaciones: string): Promise<Avance> => {
    const response = await apiClient.put(`/avances/${avanceId}/revisar`, {
      jefaturaId,
      estado: 'RECHAZADO',
      observaciones,
    });
    return response.data;
  },
};
