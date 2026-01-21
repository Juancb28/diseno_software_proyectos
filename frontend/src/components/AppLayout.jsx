import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import UsuariosPage from "../pages/UsuariosPage";
import ProyectosPage from "../pages/ProyectosPage";
import PersonalPage from "../pages/PersonalPage";
import AusenciasPage from "../pages/AusenciasPage";
import AsistenciaPage from "../pages/AsistenciaPage";
import ContratoPage from "../pages/ContratoPage";

function AppLayout({ usuario }) {
  const [pantalla, setPantalla] = useState("Usuarios");

  const menuPorRol = {
    JEFATURA: ["Usuarios", "Proyectos", "Personal", "Ausencias", "Asistencia", "Contrato"],
    DIRECTOR: ["Proyectos", "Ausencias", "Asistencia"],
    PASANTE: ["Contrato", "Asistencia"],
  };

  console.log("Usuario recibido en AppLayout:", usuario);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Box sx={{ width: 200, p: 2, borderRight: "1px solid #ccc" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Bienvenido, {usuario.nombre}
        </Typography>
        {menuPorRol[usuario.rol] ? (
          menuPorRol[usuario.rol].map((item) => (
            <Button
              key={item}
              fullWidth
              variant={pantalla === item ? "contained" : "text"}
              onClick={() => setPantalla(item)}
              sx={{ mb: 1 }}
            >
              {item}
            </Button>
          ))
        ) : (
          <Typography color="error">Rol no válido</Typography>
        )}
      </Box>

      {/* Contenido */}
      <Box sx={{ flex: 1, p: 3 }}>
        {pantalla === "Usuarios" && <UsuariosPage />}
        {pantalla === "Proyectos" && <ProyectosPage />}
        {pantalla === "Personal" && <PersonalPage />}
        {pantalla === "Ausencias" && <AusenciasPage />}
        {pantalla === "Asistencia" && <AsistenciaPage />}
        {pantalla === "Contrato" && <ContratoPage />}
      </Box>
    </Box>
  );
}

export default AppLayout;