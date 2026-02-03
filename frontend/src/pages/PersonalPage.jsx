import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { listarPersonal, registrarConProyecto } from "../api/personalService";
import { listarProyectosActivos } from "../api/proyectoService";

// Enums de estado laboral
const estadoLaboral = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
  { value: "SUSPENDIDO", label: "Suspendido" },
  { value: "RETIRADO", label: "Retirado" },
];

function PersonalPage() {
  const [open, setOpen] = useState(false);
  const [personal, setPersonal] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Cargar personal al montar el componente
  useEffect(() => {
    cargarPersonal();
    cargarProyectos();
  }, []);

  const cargarPersonal = async () => {
    try {
      setLoading(true);
      const response = await listarPersonal();
      console.log("Respuesta completa:", response);
      console.log("Datos:", response.data);
      setPersonal(response.data);
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Error response:", error.response);
      setSnackbar({
        open: true,
        message: `Error al cargar el personal: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarProyectos = async () => {
    try {
      const response = await listarProyectosActivos();
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  };

  const handleAddPersonal = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const nuevoPersonal = {
      codigoInterno: formData.get("codigoInterno"),
      nombres: formData.get("nombres"),
      apellidos: formData.get("apellidos"),
      nui: formData.get("nui"),
      fechaNacimiento: formData.get("fechaNacimiento") || null,
      telefono: formData.get("telefono") || null,
      estadoLaboral: formData.get("estadoLaboral"),
      departamentoId: formData.get("departamento") ? parseInt(formData.get("departamento")) : null,
      proyectoId: formData.get("proyecto") ? parseInt(formData.get("proyecto")) : null,
      rolEnProyecto: formData.get("rolEnProyecto") || null,
      porcentajeDedicacion: formData.get("porcentajeDedicacion") ? parseInt(formData.get("porcentajeDedicacion")) : 100,
    };

    try {
      setLoading(true);
      await registrarConProyecto(nuevoPersonal);
      setSnackbar({
        open: true,
        message: "Personal registrado exitosamente",
        severity: "success",
      });
      setOpen(false);
      cargarPersonal(); // Recargar la lista
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error al registrar personal",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Personal
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Registrar Personal
      </Button>

      {/* Tabla de personal */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>NUI</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : personal.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay personal registrado
                </TableCell>
              </TableRow>
            ) : (
              personal.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.codigoInterno}</TableCell>
                  <TableCell>{`${p.nombres} ${p.apellidos}`}</TableCell>
                  <TableCell>{p.nui}</TableCell>
                  <TableCell>{p.telefono || "-"}</TableCell>
                  <TableCell>{p.departamento?.nombre || "Sin departamento"}</TableCell>
                  <TableCell>{p.estadoLaboral}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal para registrar personal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Registrar Nuevo Personal</DialogTitle>
        <Box component="form" onSubmit={handleAddPersonal}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField 
              name="codigoInterno" 
              label="Código Interno" 
              required 
              helperText="Código único del empleado"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField 
                name="nombres" 
                label="Nombres" 
                required 
                fullWidth
              />
              <TextField 
                name="apellidos" 
                label="Apellidos" 
                required 
                fullWidth
              />
            </Box>
            <TextField 
              name="nui" 
              label="NUI (Cédula/Pasaporte)" 
              required
              helperText="Número único de identificación"
            />
            <TextField 
              name="fechaNacimiento" 
              label="Fecha de Nacimiento" 
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField 
              name="telefono" 
              label="Teléfono" 
              type="tel"
            />
            <TextField 
              select 
              name="estadoLaboral" 
              label="Estado Laboral" 
              required
              defaultValue="ACTIVO"
            >
              {estadoLaboral.map((e) => (
                <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
              ))}
            </TextField>
            <TextField 
              name="departamento" 
              label="ID de Departamento" 
              type="number"
              helperText="Opcional: ID del departamento (dejar vacío si no aplica)"
            />

            {/* Campos de Proyecto */}
            <TextField 
              select 
              name="proyecto" 
              label="Proyecto" 
              helperText="Opcional: Asignar a un proyecto"
            >
              <MenuItem value="">Sin proyecto</MenuItem>
              {proyectos.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nombre} - {p.codigo}
                </MenuItem>
              ))}
            </TextField>
            <TextField 
              name="rolEnProyecto" 
              label="Rol en Proyecto"
              placeholder="Ej: Desarrollador, Analista, Líder"
              helperText="Opcional: Rol que desempeñará en el proyecto"
            />
            <TextField 
              name="porcentajeDedicacion" 
              label="% Dedicación" 
              type="number"
              defaultValue={100}
              inputProps={{ min: 0, max: 100 }}
              helperText="Porcentaje de tiempo dedicado al proyecto (0-100)"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PersonalPage;