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
const tipoAusencia = [
  { value: "VACACIONES", label: "Vacaciones" },
  { value: "PERMISO", label: "Permiso" },
  { value: "INCAPACIDAD", label: "Incapacidad" },
];

const estadoAusencia = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "APROBADA", label: "Aprobada" },
  { value: "RECHAZADA", label: "Rechazada" },
];

function Ausencias() {
  const [open, setOpen] = useState(false);
  const [ausencias, setAusencias] = useState([
    { id: 1, empleado: "Juan Pérez", tipo: "Vacaciones", estado: "Pendiente", inicio: "2026-01-10", fin: "2026-01-15" },
    { id: 2, empleado: "María López", tipo: "Permiso", estado: "Aprobada", inicio: "2026-01-12", fin: "2026-01-12" },
  ]);

  const handleAddAusencia = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevaAusencia = {
      id: ausencias.length + 1,
      empleado: formData.get("empleado"),
      tipo: formData.get("tipo"),
      estado: "Pendiente",
      inicio: formData.get("inicio"),
      fin: formData.get("fin"),
    };
    setAusencias([...ausencias, nuevaAusencia]);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Ausencias
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Registrar Ausencia
      </Button>

      {/* Tabla de ausencias */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ausencias.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.id}</TableCell>
                <TableCell>{a.empleado}</TableCell>
                <TableCell>{a.tipo}</TableCell>
                <TableCell>{a.estado}</TableCell>
                <TableCell>{a.inicio}</TableCell>
                <TableCell>{a.fin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal para registrar ausencia */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Registrar Nueva Ausencia</DialogTitle>
        <Box component="form" onSubmit={handleAddAusencia}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField name="empleado" label="Empleado" required />
            <TextField select name="tipo" label="Tipo de Ausencia" required>
              {tipoAusencia.map((t) => (
                <MenuItem key={t.value} value={t.label}>{t.label}</MenuItem>
              ))}
            </TextField>
            <TextField type="date" name="inicio" label="Fecha Inicio" InputLabelProps={{ shrink: true }} required />
            <TextField type="date" name="fin" label="Fecha Fin" InputLabelProps={{ shrink: true }} required />
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

export default Ausencias;