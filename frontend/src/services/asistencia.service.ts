import apiClient from './api';

export interface AsistenciaApi {
  id: number;
  personal: { cedula: string; nombres?: string; apellidos?: string };
  fecha: string;
  horaEntrada?: string;
  horaSalida?: string;
  tipoRegistro:
    | 'PRESENCIAL_OFICINA'
    | 'PRESENCIAL_LABORATORIO'
    | 'REMOTO'
    | 'TRABAJO_CAMPO'
    | 'VIAJE_NEGOCIOS'
    | 'ENTRADA'
    | 'SALIDA';
  estadoAsistencia: 'PUNTUAL' | 'RETRASO' | 'SALIDA_ANTICIPADA' | 'AUSENTE' | 'JUSTIFICADO' | 'PRESENTE';
  comentarios?: string;
}

export const asistenciaService = {
  registrar: async (
    cedula: string,
    tipoRegistro: 'LABORATORIO' | 'QR',
    estadoAsistencia: 'PRESENTE' | 'TARDE' | 'AUSENTE' = 'PRESENTE'
  ): Promise<AsistenciaApi> => {
    const tipoMap: Record<typeof tipoRegistro, AsistenciaApi['tipoRegistro']> = {
      LABORATORIO: 'PRESENCIAL_LABORATORIO',
      QR: 'ENTRADA',
    };
    const estadoMap: Record<typeof estadoAsistencia, AsistenciaApi['estadoAsistencia']> = {
      PRESENTE: 'PUNTUAL',
      TARDE: 'RETRASO',
      AUSENTE: 'AUSENTE',
    };
    const response = await apiClient.post(
      `/asistencias/${cedula}?tipoRegistro=${tipoMap[tipoRegistro]}&estadoAsistencia=${estadoMap[estadoAsistencia]}`
    );
    return response.data;
  },

  listarPorPersonal: async (cedula: string): Promise<AsistenciaApi[]> => {
    const response = await apiClient.get(`/asistencias/personal/${cedula}`);
    return response.data;
  },

  listarPorFecha: async (cedula: string, fecha: string): Promise<AsistenciaApi[]> => {
    const response = await apiClient.get(`/asistencias/personal/${cedula}/fecha?fecha=${fecha}`);
    return response.data;
  },
};
