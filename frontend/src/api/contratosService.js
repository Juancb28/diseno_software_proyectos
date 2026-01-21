import axios from "axios";

const USE_MOCK = true; // cambia a false para usar API real

const API_URL = "http://localhost:5174/api/contratos";

// 🔹 Mock con datos quemados
const mockData = {
  registrarContrato: (formData) =>
    Promise.resolve({
      data: {
        id: 1,
        numeroContrato: "C-001",
        fechaInicio: "2026-01-01",
        fechaFin: "2026-12-31",
        salario: 500,
        tipoContrato: "Pasante",
        personalId: 3,
        archivo: "contrato.pdf",
      },
    }),

  listarContratos: () =>
    Promise.resolve({
      data: [
        {
          id: 1,
          numeroContrato: "C-001",
          fechaInicio: "2026-01-01",
          fechaFin: "2026-12-31",
          salario: 500,
          tipoContrato: "Pasante",
          personalId: 3,
        },
        {
          id: 2,
          numeroContrato: "C-002",
          fechaInicio: "2026-02-01",
          fechaFin: "2026-08-31",
          salario: 700,
          tipoContrato: "Temporal",
          personalId: 2,
        },
      ],
    }),

  buscarContratoPorId: (id) =>
    Promise.resolve({
      data: {
        id,
        numeroContrato: "C-001",
        fechaInicio: "2026-01-01",
        fechaFin: "2026-12-31",
        salario: 500,
        tipoContrato: "Pasante",
        personalId: 3,
      },
    }),

  listarContratosPorPersonal: (personalId) =>
    Promise.resolve({
      data: [
        {
          id: 1,
          numeroContrato: "C-001",
          fechaInicio: "2026-01-01",
          fechaFin: "2026-12-31",
          salario: 500,
          tipoContrato: "Pasante",
          personalId,
        },
      ],
    }),

  listarContratosVigentes: (personalId) =>
    Promise.resolve({
      data: [
        {
          id: 1,
          numeroContrato: "C-001",
          fechaInicio: "2026-01-01",
          fechaFin: "2026-12-31",
          salario: 500,
          tipoContrato: "Pasante",
          personalId,
        },
      ],
    }),

  descargarContratoPDF: (id) =>
    Promise.resolve({ data: "PDF bytes simulados" }),

  eliminarContrato: (id, personalId) =>
    Promise.resolve({ status: 204 }),
};

// 🔹 API real con Axios
const apiData = {
  registrarContrato: (formData) =>
    axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  listarContratos: () => axios.get(API_URL),

  buscarContratoPorId: (id) => axios.get(`${API_URL}/${id}`),

  listarContratosPorPersonal: (personalId) =>
    axios.get(`${API_URL}/personal/${personalId}`),

  listarContratosVigentes: (personalId) =>
    axios.get(`${API_URL}/personal/${personalId}/vigentes`),

  descargarContratoPDF: (id) =>
    axios.get(`${API_URL}/${id}/documento`, { responseType: "blob" }),

  eliminarContrato: (id, personalId) =>
    axios.delete(`${API_URL}/${id}?personalId=${personalId}`),
};

// 🔹 Exportar según bandera
export const registrarContrato = USE_MOCK ? mockData.registrarContrato : apiData.registrarContrato;
export const listarContratos = USE_MOCK ? mockData.listarContratos : apiData.listarContratos;
export const buscarContratoPorId = USE_MOCK ? mockData.buscarContratoPorId : apiData.buscarContratoPorId;
export const listarContratosPorPersonal = USE_MOCK ? mockData.listarContratosPorPersonal : apiData.listarContratosPorPersonal;
export const listarContratosVigentes = USE_MOCK ? mockData.listarContratosVigentes : apiData.listarContratosVigentes;
export const descargarContratoPDF = USE_MOCK ? mockData.descargarContratoPDF : apiData.descargarContratoPDF;
export const eliminarContrato = USE_MOCK ? mockData.eliminarContrato : apiData.eliminarContrato;