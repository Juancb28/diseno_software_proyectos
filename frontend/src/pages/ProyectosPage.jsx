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
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");

  const cargarProyectos = () => {
    listarProyectos().then((res) => setProyectos(res.data));
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const handleCrearProyecto = async () => {
    await crearProyecto({ nombre, descripcion, estado });
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
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proyectos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.descripcion}</TableCell>
                <TableCell>{p.estado}</TableCell>
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
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Crear Proyecto</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre" margin="normal" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <TextField fullWidth label="Descripción" margin="normal" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <TextField fullWidth label="Estado" margin="normal" value={estado} onChange={(e) => setEstado(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCrearProyecto}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProyectosPage;