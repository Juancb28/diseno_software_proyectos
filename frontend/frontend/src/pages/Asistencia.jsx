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
const tipoRegistro = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "SALIDA", label: "Salida" },
];

function Asistencia() {
  const [open, setOpen] = useState(false);
  const [registros, setRegistros] = useState([
    { id: 1, empleado: "Juan Pérez", tipo: "Entrada", fecha: "2026-01-15 08:00" },
    { id: 2, empleado: "Juan Pérez", tipo: "Salida", fecha: "2026-01-15 17:00" },
    { id: 3, empleado: "María López", tipo: "Entrada", fecha: "2026-01-15 09:00" },
  ]);

  const handleAddRegistro = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevoRegistro = {
      id: registros.length + 1,
      empleado: formData.get("empleado"),
      tipo: formData.get("tipo"),
      fecha: formData.get("fecha"),
    };
    setRegistros([...registros, nuevoRegistro]);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Registro de Asistencia
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Registrar Asistencia
      </Button>

      {/* Tabla de registros */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.empleado}</TableCell>
                <TableCell>{r.tipo}</TableCell>
                <TableCell>{r.fecha}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal para registrar asistencia */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Registrar Nuevo Registro</DialogTitle>
        <Box component="form" onSubmit={handleAddRegistro}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField name="empleado" label="Empleado" required />
            <TextField select name="tipo" label="Tipo de Registro" required>
              {tipoRegistro.map((t) => (
                <MenuItem key={t.value} value={t.label}>{t.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              type="datetime-local"
              name="fecha"
              label="Fecha y Hora"
              InputLabelProps={{ shrink: true }}
              required
            />
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

export default Asistencia;