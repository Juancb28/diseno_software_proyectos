import { useState } from "react";
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
} from "@mui/material";

// Enums simulados (luego se importan de src/enums)
const estadoProyecto = [
  { value: "ACTIVO", label: "Activo" },
  { value: "FINALIZADO", label: "Finalizado" },
  { value: "EN_PAUSA", label: "En Pausa" },
];

function Proyectos() {
  const [open, setOpen] = useState(false);
  const [proyectos, setProyectos] = useState([
    { id: 1, nombre: "Sistema de Gestión", estado: "Activo", responsable: "Juan Pérez" },
    { id: 2, nombre: "Portal Web", estado: "Finalizado", responsable: "María López" },
  ]);

  const handleAddProyecto = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevoProyecto = {
      id: proyectos.length + 1,
      nombre: formData.get("nombre"),
      estado: formData.get("estado"),
      responsable: formData.get("responsable"),
    };
    setProyectos([...proyectos, nuevoProyecto]);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Proyectos
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Registrar Proyecto
      </Button>

      {/* Tabla de proyectos */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Responsable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proyectos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.estado}</TableCell>
                <TableCell>{p.responsable}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal para registrar proyecto */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Registrar Nuevo Proyecto</DialogTitle>
        <Box component="form" onSubmit={handleAddProyecto}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField name="nombre" label="Nombre del Proyecto" required />
            <TextField select name="estado" label="Estado" required>
              {estadoProyecto.map((e) => (
                <MenuItem key={e.value} value={e.label}>{e.label}</MenuItem>
              ))}
            </TextField>
            <TextField name="responsable" label="Responsable" required />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Guardar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Proyectos;