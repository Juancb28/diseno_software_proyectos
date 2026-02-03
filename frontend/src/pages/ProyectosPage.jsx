import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
} from "@mui/material";
import {
  listarProyectos,
  crearProyecto,
  eliminarProyecto,
} from "../api/proyectosService";

function ProyectosPage() {
  const [proyectos, setProyectos] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const cargarProyectos = () => {
    listarProyectos().then((res) => setProyectos(res.data));
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const handleCrearProyecto = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const nuevoProyecto = {
      codigoProyecto: formData.get("codigoProyecto"),
      titulo: formData.get("titulo"),
      descripcion: formData.get("descripcion") || null,
      fechaInicio: formData.get("fechaInicio") || null,
      fechaFinEstimada: formData.get("fechaFinEstimada") || null,
      presupuesto: formData.get("presupuesto") ? parseFloat(formData.get("presupuesto")) : null,
      estadoProyecto: formData.get("estadoProyecto") || "PLANIFICACION",
      director: formData.get("directorId") ? { id: parseInt(formData.get("directorId")) } : null,
      departamento: formData.get("departamentoId") ? { id: parseInt(formData.get("departamentoId")) } : null,
    };

    await crearProyecto(nuevoProyecto);
    cargarProyectos();
    setOpenForm(false);
  };

  const handleEliminarProyecto = async (id) => {
    await eliminarProyecto(id);
    cargarProyectos();
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: "center" }}>
        Gestión de Proyectos
      </Typography>

      <Paper sx={{ width: "90%", overflow: "hidden", mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Presupuesto</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proyectos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.codigoProyecto}</TableCell>
                <TableCell>{p.titulo}</TableCell>
                <TableCell>{p.descripcion || "-"}</TableCell>
                <TableCell>{p.estadoProyecto}</TableCell>
                <TableCell>${p.presupuesto || 0}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleEliminarProyecto(p.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Button variant="contained" onClick={() => setOpenForm(true)}>
        Crear Proyecto
      </Button>

      {/* Formulario modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
        <DialogTitle>Crear Proyecto</DialogTitle>
        <Box component="form" onSubmit={handleCrearProyecto}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField 
              name="codigoProyecto" 
              label="Código del Proyecto" 
              required 
              helperText="Código único del proyecto"
            />
            <TextField 
              name="titulo" 
              label="Título" 
              required 
              helperText="Nombre del proyecto"
            />
            <TextField 
              name="descripcion" 
              label="Descripción" 
              multiline 
              rows={3}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField 
                name="fechaInicio" 
                label="Fecha de Inicio" 
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField 
                name="fechaFinEstimada" 
                label="Fecha Fin Estimada" 
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
            <TextField 
              name="presupuesto" 
              label="Presupuesto" 
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              helperText="Presupuesto del proyecto"
            />
            <TextField 
              select 
              name="estadoProyecto" 
              label="Estado del Proyecto" 
              defaultValue="PLANIFICACION"
              SelectProps={{ native: true }}
            >
              <option value="PLANIFICACION">Planificación</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADO">Completado</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="SUSPENDIDO">Suspendido</option>
            </TextField>
            <TextField 
              name="directorId" 
              label="ID Director" 
              type="number"
              helperText="Opcional: ID del usuario director del proyecto"
            />
            <TextField 
              name="departamentoId" 
              label="ID Departamento" 
              type="number"
              helperText="Opcional: ID del departamento responsable"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Guardar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default ProyectosPage;