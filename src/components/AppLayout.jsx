import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import UsuariosPage from "../pages/UsuariosPage";
import ProyectosPage from "../pages/ProyectosPage";
import PersonalPage from "../pages/PersonalPage";
import AusenciasPage from "../pages/AusenciasPage";
import AsistenciaPage from "../pages/AsistenciaPage";
import ContratoPage from "../pages/ContratoPage";
import DashBoard from "../pages/DashBoard";

function AppLayout({ usuario, onLogout }) {
  const [pantalla, setPantalla] = useState(null);

  const menuPorRol = {
    ADMINISTRADOR: [
      { nombre: "Dashboard", modos: ["Resumen"] },
      { nombre: "Usuarios", modos: ["Registrar", "Listar", "Modificar/Eliminar"] },
      { nombre: "Proyectos", modos: ["Crear", "Listar", "Modificar/Eliminar"] },
      { nombre: "Personal", modos: ["Registrar", "Listar", "Cambiar estado"] },
      { nombre: "Ausencias", modos: ["Listar todas", "Aprobar/Rechazar"] },
      { nombre: "Asistencia", modos: ["Registrar biométrica", "Visualizar registros"] },
      { nombre: "Contrato", modos: ["Registrar", "Listar", "Descargar PDF", "Eliminar"] },
    ],
    JEFATURA: [
      { nombre: "Dashboard", modos: ["Resumen"] },
      { nombre: "Proyectos", modos: ["Listar activos"] },
      { nombre: "Personal", modos: ["Listar personal"] },
      { nombre: "Usuarios", modos: ["Buscar por rol"] },
      { nombre: "Ausencias", modos: ["Revisar", "Pendientes"] },
      { nombre: "Asistencia", modos: ["Revisar"] },
    ],
    DIRECTOR_DE_PROYECTO: [
      { nombre: "Dashboard", modos: ["Resumen"] },
      { nombre: "Proyectos", modos: ["Creación", "Edición"] },
      { nombre: "Personal", modos: ["Ligar con proyecto", "Ver contrato"] },
      { nombre: "Ausencias", modos: ["Registrar ayudantes", "Visualizar ayudantes"] },
      { nombre: "Asistencia", modos: ["Registrar pasantes", "Visualizar pasantes"] },
    ],
    AYUDANTE: [
      { nombre: "Contrato", modos: ["Subir PDF"] },
      { nombre: "Asistencia", modos: ["Laboratorio", "QR"] },
    ],
  };

  const tituloSistema = `Sistema de Gestión: ${usuario.rol} - Ingeniería SW`;
  const colorPorRol = {
    ADMINISTRADOR: "secondary.main",
    JEFATURA: "warning.main",
    DIRECTOR_DE_PROYECTO: "info.main",
    AYUDANTE: "text.secondary",
  };

  const opciones = menuPorRol[usuario.rol] || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
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
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: colorPorRol[usuario.rol] || "primary.contrastText",
          }}
        >
          {tituloSistema}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">Bienvenido, {usuario.nombre}</Typography>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{ borderRadius: 2 }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Paper
          elevation={2}
          sx={{
            width: 260,
            minWidth: 260,
            p: 2,
            borderRight: "1px solid",
            borderColor: "divider",
            overflow: "auto",
          }}
        >
          {opciones.length > 0 ? (
            opciones.map((modulo) => (
              <Accordion key={modulo.nombre} sx={{ mb: 1 }} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">{modulo.nombre}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {modulo.modos.map((modo) => (
                    <Button
                      key={modo}
                      fullWidth
                      variant={
                        pantalla?.nombre === modulo.nombre && pantalla?.modo === modo
                          ? "contained"
                          : "text"
                      }
                      onClick={() => setPantalla({ nombre: modulo.nombre, modo })}
                      sx={{ mb: 1, borderRadius: 2, textTransform: "none" }}
                    >
                      {modo}
                    </Button>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography color="error">Rol no configurado</Typography>
          )}
        </Paper>

        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
          {pantalla?.nombre === "Dashboard" && <DashBoard />}
          {pantalla?.nombre === "Usuarios" && <UsuariosPage modo={pantalla.modo} />}
          {pantalla?.nombre === "Proyectos" && <ProyectosPage modo={pantalla.modo} />}
          {pantalla?.nombre === "Personal" && <PersonalPage modo={pantalla.modo} />}
          {pantalla?.nombre === "Ausencias" && <AusenciasPage modo={pantalla.modo} />}
          {pantalla?.nombre === "Asistencia" && <AsistenciaPage modo={pantalla.modo} />}
          {pantalla?.nombre === "Contrato" && <ContratoPage modo={pantalla.modo} />}
          {!pantalla && (
            <Typography color="text.secondary">
              Selecciona un módulo del menú para comenzar.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
