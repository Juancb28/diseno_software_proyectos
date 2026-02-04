import apiClient from './api';

export interface RegistroAsistencia {
  id: number;
  personal: {
    cedula: string;
    nombres: string;
    apellidos: string;
  };
  fechaHora: string;
  tipoRegistro: 'ENTRADA' | 'SALIDA';
  metodo: 'BIOMETRIA' | 'QR';
}

export interface DatoBiometrico {
  id: number;
  personal: {
    cedula: string;
    nombres: string;
    apellidos: string;
  };
  huella: string; // Base64
  estaActivo: boolean;
}

export const biometriaService = {
  // Registrar dato biométrico
  registrarDato: async (personalCedula: string, huella: Uint8Array): Promise<void> => {
    await apiClient.post(`/biometria/registrar/${personalCedula}`, huella, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  },

  // Activar biometría
  activar: async (datoBiometricoId: number): Promise<void> => {
    await apiClient.patch(`/biometria/activar/${datoBiometricoId}`);
  },

  // Desactivar biometría
  desactivar: async (datoBiometricoId: number): Promise<void> => {
    await apiClient.patch(`/biometria/desactivar/${datoBiometricoId}`);
  },

  // Verificar huella
  verificar: async (huella: Uint8Array): Promise<any> => {
    const response = await apiClient.post('/biometria/verificar', huella, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
    return response.data;
  },

  // Registrar asistencia
  registrarAsistencia: async (personalCedula: string, tipoRegistro: 'ENTRADA' | 'SALIDA'): Promise<RegistroAsistencia> => {
    const response = await apiClient.post(`/biometria/asistencia/${personalCedula}?tipoRegistro=${tipoRegistro}`);
    return response.data;
  },

  // Obtener datos biométricos
  obtenerDatos: async (personalCedula: string): Promise<DatoBiometrico[]> => {
    const response = await apiClient.get(`/biometria/datos/${personalCedula}`);
    return response.data;
  },

  // Obtener registros de asistencia
  obtenerAsistencias: async (personalCedula: string): Promise<RegistroAsistencia[]> => {
    const response = await apiClient.get(`/biometria/asistencia/${personalCedula}`);
    return response.data;
  },

  // Obtener registros por fecha
  obtenerAsistenciasPorFecha: async (personalCedula: string, fecha: string): Promise<RegistroAsistencia[]> => {
    const response = await apiClient.get(`/biometria/asistencia/${personalCedula}/fecha?fecha=${fecha}`);
    return response.data;
  },
};
