import axios from "axios";

const USE_MOCK = true; // cambia a false para usar API real
const API_URL = "http://localhost:5174/api/proyectos";

// 🔹 Mock con datos quemados
const mockData = {
  crearProyecto: (proyecto) =>
    Promise.resolve({ data: { id: 1, ...proyecto } }),

  listarProyectos: () =>
    Promise.resolve({
      data: [
        { id: 1, nombre: "Sistema de Gestión", descripcion: "Proyecto interno", estado: "Activo" },
        { id: 2, nombre: "App Móvil", descripcion: "Aplicación para clientes", estado: "En desarrollo" },
      ],
    }),

  buscarProyectoPorId: (id) =>
    Promise.resolve({
      data: { id, nombre: "Proyecto Mock", descripcion: "Demo", estado: "Activo" },
    }),

  actualizarProyecto: (id, proyecto) =>
    Promise.resolve({ data: { id, ...proyecto } }),

  eliminarProyecto: (id) =>
    Promise.resolve({ status: 204 }),
};

// 🔹 API real con Axios
const apiData = {
  crearProyecto: (proyecto) => axios.post(API_URL, proyecto),
  listarProyectos: () => axios.get(API_URL),
  buscarProyectoPorId: (id) => axios.get(`${API_URL}/${id}`),
  actualizarProyecto: (id, proyecto) => axios.put(`${API_URL}/${id}`, proyecto),
  eliminarProyecto: (id) => axios.delete(`${API_URL}/${id}`),
};

// 🔹 Exportar según bandera
export const crearProyecto = USE_MOCK ? mockData.crearProyecto : apiData.crearProyecto;
export const listarProyectos = USE_MOCK ? mockData.listarProyectos : apiData.listarProyectos;
export const buscarProyectoPorId = USE_MOCK ? mockData.buscarProyectoPorId : apiData.buscarProyectoPorId;
export const actualizarProyecto = USE_MOCK ? mockData.actualizarProyecto : apiData.actualizarProyecto;
export const eliminarProyecto = USE_MOCK ? mockData.eliminarProyecto : apiData.eliminarProyecto;