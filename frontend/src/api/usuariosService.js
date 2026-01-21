import axios from "axios";

const USE_MOCK = true; // 🔹 cambia a false para usar API real
const API_URL = "http://localhost:5174/api/usuarios";

// 🔹 Mock con datos iniciales
const mockUsuarios = [
  { id: 1, nombre: "Kevin Palacios", correo: "kevin.palacios@epn.edu.ec", contrasena: "123456", rol: "JEFATURA", codigo: "JEF001" },
  { id: 2, nombre: "María López", correo: "maria@empresa.com", contrasena: "123456", rol: "DIRECTOR", codigo: "DIR001" },
  { id: 3, nombre: "Carlos Gómez", correo: "carlos@empresa.com", contrasena: "123456", rol: "PASANTE", codigo: "PAS001" },
];

let usuariosMock = [...mockUsuarios];

// 🔹 Funciones mock
const mockData = {
  registro: (usuario) => {
    const nuevo = { id: Date.now(), ...usuario };
    usuariosMock.push(nuevo);
    return Promise.resolve({ data: nuevo });
  },

  login: ({ correo, contrasena }) => {
    const usuario = usuariosMock.find(u => u.correo === correo && u.contrasena === contrasena);
    if (!usuario) {
      return Promise.resolve({ data: { autenticado: false, mensaje: "Credenciales inválidas" } });
    }
    return Promise.resolve({
      data: {
        autenticado: true,
        mensaje: "Login exitoso",
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol, // 🔹 siempre en mayúsculas
          codigo: usuario.codigo,
        },
      },
    });
  },

  listarUsuarios: () => Promise.resolve({ data: usuariosMock }),

  eliminarUsuario: (id) => {
    usuariosMock = usuariosMock.filter(u => u.id !== id);
    return Promise.resolve({ status: 204 });
  },

  modificarUsuario: (id, usuario) => {
    usuariosMock = usuariosMock.map(u => (u.id === id ? { ...u, ...usuario } : u));
    return Promise.resolve({ data: usuariosMock.find(u => u.id === id) });
  },

  buscarPorId: (id) => Promise.resolve({ data: usuariosMock.find(u => u.id === id) }),
  buscarPorCorreo: (correo) => Promise.resolve({ data: usuariosMock.find(u => u.correo === correo) }),
  buscarPorCodigo: (codigo) => Promise.resolve({ data: usuariosMock.find(u => u.codigo === codigo) }),
  buscarPorRol: (rol) => Promise.resolve({ data: usuariosMock.filter(u => u.rol === rol) }),
};

// 🔹 API real con Axios
const apiData = {
  registro: (usuario) => axios.post(`${API_URL}/registro`, usuario),
  login: (credenciales) => axios.post(`${API_URL}/login`, credenciales),
  modificarUsuario: (id, usuario) => axios.put(`${API_URL}/${id}`, usuario),
  buscarPorId: (id) => axios.get(`${API_URL}/${id}`),
  buscarPorCorreo: (correo) => axios.get(`${API_URL}/correo/${correo}`),
  buscarPorCodigo: (codigo) => axios.get(`${API_URL}/codigo/${codigo}`),
  buscarPorRol: (rol) => axios.get(`${API_URL}/rol/${rol}`),
  listarUsuarios: () => axios.get(API_URL),
  eliminarUsuario: (id) => axios.delete(`${API_URL}/${id}`),
};

// 🔹 Exportar según bandera
export const registro = USE_MOCK ? mockData.registro : apiData.registro;
export const login = USE_MOCK ? mockData.login : apiData.login;
export const modificarUsuario = USE_MOCK ? mockData.modificarUsuario : apiData.modificarUsuario;
export const buscarPorId = USE_MOCK ? mockData.buscarPorId : apiData.buscarPorId;
export const buscarPorCorreo = USE_MOCK ? mockData.buscarPorCorreo : apiData.buscarPorCorreo;
export const buscarPorCodigo = USE_MOCK ? mockData.buscarPorCodigo : apiData.buscarPorCodigo;
export const buscarPorRol = USE_MOCK ? mockData.buscarPorRol : apiData.buscarPorRol;
export const listarUsuarios = USE_MOCK ? mockData.listarUsuarios : apiData.listarUsuarios;
export const eliminarUsuario = USE_MOCK ? mockData.eliminarUsuario : apiData.eliminarUsuario;