import axios from "axios";

const USE_MOCK = true; // cambia a false para usar API real
const API_URL = "http://localhost:5174/api/asistencia";

// 🔹 Mock con datos quemados
const mockData = {
  registrarAsistencia: (asistencia) =>
    Promise.resolve({
      data: { id: 1, ...asistencia, fecha: new Date().toISOString().split("T")[0] },
    }),

  listarAsistencia: () =>
    Promise.resolve({
      data: [
        { id: 1, personalId: 3, fecha: "2026-01-21", estado: "Presente" },
        { id: 2, personalId: 2, fecha: "2026-01-20", estado: "Ausente" },
      ],
    }),

  buscarAsistenciaPorId: (id) =>
    Promise.resolve({
      data: { id, personalId: 3, fecha: "2026-01-21", estado: "Presente" },
    }),

  eliminarAsistencia: (id) => Promise.resolve({ status: 204 }),
};

// 🔹 API real con Axios
const apiData = {
  registrarAsistencia: (asistencia) => axios.post(API_URL, asistencia),
  listarAsistencia: () => axios.get(API_URL),
  buscarAsistenciaPorId: (id) => axios.get(`${API_URL}/${id}`),
  eliminarAsistencia: (id) => axios.delete(`${API_URL}/${id}`),
};

// 🔹 Exportar según bandera
export const registrarAsistencia = USE_MOCK ? mockData.registrarAsistencia : apiData.registrarAsistencia;
export const listarAsistencia = USE_MOCK ? mockData.listarAsistencia : apiData.listarAsistencia;
export const buscarAsistenciaPorId = USE_MOCK ? mockData.buscarAsistenciaPorId : apiData.buscarAsistenciaPorId;
export const eliminarAsistencia = USE_MOCK ? mockData.eliminarAsistencia : apiData.eliminarAsistencia;