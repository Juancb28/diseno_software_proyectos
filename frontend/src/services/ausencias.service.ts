import apiClient from './api';

export interface Ausencia {
  id?: number;
  personal: {
    cedula: string;
    codigo?: string;
    nombres: string;
    apellidos: string;
  };
  tipoAusencia: 'PERMISO' | 'ENFERMEDAD' | 'VACACIONES' | 'MATERNIDAD' | 'OTRO';
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  aprobador?: {
    cedula: string;
    nombres: string;
    apellidos: string;
  };
  motivoRechazo?: string;
}

// Mapeo de tipos de ausencia del frontend al backend
const tipoAusenciaMap: Record<string, string> = {
  'PERMISO': 'PERMISO_PERSONAL',
  'VACACIONES': 'VACACIONES',
  'ENFERMEDAD': 'ENFERMEDAD',
  'MATERNIDAD': 'MATERNIDAD_PATERNIDAD',
  'OTRO': 'OTRO'
};

export const ausenciasService = {
  // Notificar ausencia
  notificar: async (personalCedula: string, ausencia: Partial<Ausencia>): Promise<Ausencia> => {
    // Mapear el tipo de ausencia al formato del backend
    const ausenciaPayload = {
      ...ausencia,
      tipoAusencia: tipoAusenciaMap[ausencia.tipoAusencia || 'OTRO']
    };
    const response = await apiClient.post(`/ausencias/personal/${personalCedula}`, ausenciaPayload);
    return response.data;
  },

  // Aprobar ausencia
  aprobar: async (ausenciaId: number, aprobadorCedula: string): Promise<void> => {
    await apiClient.patch(`/ausencias/${ausenciaId}/aprobar/${aprobadorCedula}`);
  },

  // Rechazar ausencia
  rechazar: async (ausenciaId: number, aprobadorCedula: string, motivo: string): Promise<void> => {
    await apiClient.patch(`/ausencias/${ausenciaId}/rechazar/${aprobadorCedula}?motivo=${encodeURIComponent(motivo)}`);
  },

  // Buscar por ID
  buscarPorId: async (id: number): Promise<Ausencia> => {
    const response = await apiClient.get(`/ausencias/${id}`);
    return response.data;
  },

  // Obtener por personal
  obtenerPorPersonal: async (personalCedula: string): Promise<Ausencia[]> => {
    const response = await apiClient.get(`/ausencias/personal/${personalCedula}`);
    return response.data;
  },

  // Obtener pendientes
  obtenerPendientes: async (): Promise<Ausencia[]> => {
    const response = await apiClient.get('/ausencias/pendientes');
    return response.data;
  },

  // Listar todas
  listarTodas: async (): Promise<Ausencia[]> => {
    const response = await apiClient.get('/ausencias');
    return response.data;
  },
};
