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
const estadoLaboral = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
  { value: "SUSPENDIDO", label: "Suspendido" },
];

const departamentos = [
  { value: "TI", label: "Tecnología" },
  { value: "RRHH", label: "Recursos Humanos" },
  { value: "ADM", label: "Administración" },
];

function Personal() {
  const [open, setOpen] = useState(false);
  const [personal, setPersonal] = useState([
    { id: 1, nombre: "Juan Pérez", departamento: "Tecnología", estado: "Activo" },
    { id: 2, nombre: "María López", departamento: "Recursos Humanos", estado: "Inactivo" },
  ]);

  const handleAddPersonal = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevoPersonal = {
      id: personal.length + 1,
      nombre: formData.get("nombre"),
      departamento: formData.get("departamento"),
      estado: formData.get("estado"),
    };
    setPersonal([...personal, nuevoPersonal]);
    setOpen(false);
  };

  return (
    <Box>
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
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personal.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.departamento}</TableCell>
                <TableCell>{p.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal para registrar personal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Registrar Nuevo Personal</DialogTitle>
        <Box component="form" onSubmit={handleAddPersonal}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField name="nombre" label="Nombre" required />
            <TextField select name="departamento" label="Departamento" required>
              {departamentos.map((d) => (
                <MenuItem key={d.value} value={d.label}>{d.label}</MenuItem>
              ))}
            </TextField>
            <TextField select name="estado" label="Estado Laboral" required>
              {estadoLaboral.map((e) => (
                <MenuItem key={e.value} value={e.label}>{e.label}</MenuItem>
              ))}
            </TextField>
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

export default Personal;