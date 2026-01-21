// src/api/loginService.js
export const usuariosMock = [
  {
    correo: "kevin.palacios@epn.edu.ec",
    password: "123456",
    nombre: "Kevin Palacios",
    rol: "JEFATURA",
  },
  {
    correo: "maria@empresa.com",
    password: "123456",
    nombre: "María López",
    rol: "DIRECTOR",
  },
  {
    correo: "carlos@empresa.com",
    password: "123456",
    nombre: "Carlos Gómez",
    rol: "PASANTE",
  },
];

// Función de login
export const login = (correo, password) => {
  const usuario = usuariosMock.find(
    (u) => u.correo === correo && u.password === password
  );
  if (!usuario) {
    return Promise.resolve({
      autenticado: false,
      mensaje: "Credenciales inválidas",
    });
  }
  return Promise.resolve({
    autenticado: true,
    mensaje: "Login exitoso",
    usuario,
  });
};