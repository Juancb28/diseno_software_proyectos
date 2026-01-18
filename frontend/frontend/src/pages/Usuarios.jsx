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
const tipoRol = [
  { value: "ADMIN", label: "Administrador" },
  { value: "GESTOR", label: "Gestor" },
  { value: "EMPLEADO", label: "Empleado" },
];

function Usuarios() {
  const [open, setOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Juan Pérez", correo: "juan@empresa.com", rol: "Administrador" },
    { id: 2, nombre: "María López", correo: "maria@empresa.com", rol: "Empleado" },
  ]);

  const handleAddUsuario = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre: formData.get("nombre"),
      correo: formData.get("correo"),
      rol: formData.get("rol"),
    };
    setUsuarios([...usuarios, nuevoUsuario]);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administración de Usuarios
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Registrar Usuario
      </Button>

      {/* Tabla de usuarios */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>{u.rol}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal para registrar usuario */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
        <Box component="form" onSubmit={handleAddUsuario}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField name="nombre" label="Nombre" required />
            <TextField name="correo" label="Correo Electrónico" type="email" required />
            <TextField select name="rol" label="Rol" required>
              {tipoRol.map((r) => (
                <MenuItem key={r.value} value={r.label}>{r.label}</MenuItem>
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

export default Usuarios;