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
  Select,
  MenuItem,
} from "@mui/material";
import {
  listarProyectos,
  listarProyectosActivos,
  crearProyecto,
  eliminarProyecto,
} from "../api/proyectosService";

const ESTADOS = ["ACTIVO", "EN_DESARROLLO", "FINALIZADO", "SUSPENDIDO"];

export default function ProyectosPage({ modo }) {
  const [proyectos, setProyectos] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("ACTIVO");

  const cargarProyectos = () => {
    const api = modo === "Listar activos" ? listarProyectosActivos : listarProyectos;
    api()
      .then((res) => setProyectos(res.data || []))
      .catch(() => setProyectos([]));
  };

  useEffect(() => {
    cargarProyectos();
  }, [modo]);

  const handleCrear = async () => {
    try {
      await crearProyecto({ nombre, descripcion, estado });
      cargarProyectos();
      setOpenForm(false);
      setNombre("");
      setDescripcion("");
      setEstado("ACTIVO");
    } catch (e) {
      console.error(e);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarProyecto(id);
      cargarProyectos();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Proyectos - {modo}
      </Typography>

      <Paper sx={{ overflow: "hidden", mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
              {(modo === "Modificar/Eliminar") && (
                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {proyectos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.descripcion}</TableCell>
                <TableCell>{p.estado}</TableCell>
                {(modo === "Modificar/Eliminar") && (
                  <TableCell align="center">
                    <Button variant="outlined" color="error" size="small" onClick={() => handleEliminar(p.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {(modo === "Crear" || modo === "Creación") && (
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Crear proyecto
        </Button>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Crear proyecto</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre" margin="normal" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <TextField fullWidth label="Descripción" margin="normal" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <Select fullWidth value={estado} onChange={(e) => setEstado(e.target.value)} sx={{ mt: 2 }}>
            {ESTADOS.map((e) => (
              <MenuItem key={e} value={e}>{e}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCrear}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
