import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import UsuariosPage from "../pages/UsuariosPage";
import ProyectosPage from "../pages/ProyectosPage";
import PersonalPage from "../pages/PersonalPage";
import AusenciasPage from "../pages/AusenciasPage";
import AsistenciaPage from "../pages/AsistenciaPage";
import ContratoPage from "../pages/ContratoPage";

function AppLayout({ usuario, onLogout }) {
  const [pantalla, setPantalla] = useState("Usuarios");

  const menuPorRol = {
    ADMINISTRADOR: ["Usuarios", "Proyectos", "Personal", "Ausencias", "Asistencia", "Contrato"],
    JEFATURA: ["Usuarios", "Proyectos", "Personal", "Ausencias", "Asistencia", "Contrato"],
    DIRECTOR_PROYECTO: ["Proyectos", "Ausencias", "Asistencia"],
    PERSONAL: ["Contrato", "Asistencia"],
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 🔹 Header superior */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        {/* Logo + título animado */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src="/logo-epn-vertical.png"
            alt="Logo"
            style={{ width: "40px", height: "40px" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              animation: "fadeIn 2s ease-in-out infinite alternate",
            }}
          >
            SISTEMA DE GESTIÓN: JEFATURA INGENIERÍA SW
          </Typography>
        </Box>

        {/* Usuario + logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">Bienvenido, {usuario.nombre}</Typography>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{ borderRadius: 2 }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>

      {/* 🔹 Contenido principal */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Paper
          elevation={3}
          sx={{
            width: 220,
            p: 2,
            borderRight: "1px solid #e5e7eb",
            bgcolor: "background.paper",
          }}
        >
          {menuPorRol[usuario.tipoRol] ? (
            menuPorRol[usuario.tipoRol].map((item) => (
              <Button
                key={item}
                fullWidth
                variant={pantalla === item ? "contained" : "text"}
                onClick={() => setPantalla(item)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: pantalla === item ? "bold" : "normal",
                  color: pantalla === item ? "white" : "primary.main",
                  bgcolor: pantalla === item ? "primary.main" : "transparent",
                  "&:hover": {
                    bgcolor: pantalla === item ? "black" : "#f0f0f0",
                  },
                }}
              >
                {item}
              </Button>
            ))
          ) : (
            <Typography color="error">Rol no válido</Typography>
          )}
        </Paper>

        {/* Contenido dinámico */}
        <Box sx={{ flex: 1, p: 3 }}>
          {pantalla === "Usuarios" && <UsuariosPage />}
          {pantalla === "Proyectos" && <ProyectosPage />}
          {pantalla === "Personal" && <PersonalPage />}
          {pantalla === "Ausencias" && <AusenciasPage />}
          {pantalla === "Asistencia" && <AsistenciaPage />}
          {pantalla === "Contrato" && <ContratoPage />}
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;