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
  listarUsuarios,
  registro,
  eliminarUsuario,
} from "../api/usuariosService";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [tipoRol, setTipoRol] = useState("");

  const cargarUsuarios = () => {
    listarUsuarios().then((res) => setUsuarios(res.data));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleRegistrarUsuario = async () => {
    await registro({ nombre, correo, contrasena, tipoRol });
    cargarUsuarios();
    setOpenForm(false);
    setNombre("");
    setCorreo("");
    setContrasena("");
    setTipoRol("");
  };

  const handleEliminarUsuario = async (id) => {
    await eliminarUsuario(id);
    cargarUsuarios();
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: "center" }}>
        Gestión de Usuarios
      </Typography>

      <Paper sx={{ width: "90%", overflow: "hidden", mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleEliminarUsuario(u.id)}
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
        Registrar Usuario
      </Button>

      {/* Formulario modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Registrar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre"
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            fullWidth
            label="Correo"
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          {/* 🔹 Select para roles */}
          <Select
            fullWidth
            value={tipoRol}
            onChange={(e) => setTipoRol(e.target.value)}
            displayEmpty
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>
              Selecciona un rol
            </MenuItem>
            <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
            <MenuItem value="DIRECTOR_PROYECTO">DIRECTOR PROYECTO</MenuItem>
            <MenuItem value="JEFATURA">JEFATURA</MenuItem>
            <MenuItem value="PERSONAL">PERSONAL</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleRegistrarUsuario}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UsuariosPage;