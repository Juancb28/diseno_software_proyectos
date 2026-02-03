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

const ROLES = ["ADMINISTRADOR", "JEFATURA", "DIRECTOR_DE_PROYECTO", "AYUDANTE"];

export default function UsuariosPage({ modo }) {
  const [usuarios, setUsuarios] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [codigo, setCodigo] = useState("");

  const cargarUsuarios = () => {
    listarUsuarios()
      .then((res) => setUsuarios(res.data || []))
      .catch(() => setUsuarios([]));
  };

  useEffect(() => {
    if (modo === "Listar" || modo === "Modificar/Eliminar" || modo === "Registrar") {
      cargarUsuarios();
    }
  }, [modo]);

  const handleRegistrar = async () => {
    try {
      await registro({ nombre, correo, contrasena, rol, codigo });
      cargarUsuarios();
      setOpenForm(false);
      setNombre("");
      setCorreo("");
      setContrasena("");
      setRol("");
      setCodigo("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarUsuario(id);
      cargarUsuarios();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Usuarios - {modo}
      </Typography>

      {(modo === "Listar" || modo === "Modificar/Eliminar" || modo === "Buscar por rol") && (
        <Paper sx={{ overflow: "hidden", mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Correo</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rol</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Código</TableCell>
                {(modo === "Modificar/Eliminar") && (
                  <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.correo}</TableCell>
                  <TableCell>{u.rol}</TableCell>
                  <TableCell>{u.codigo}</TableCell>
                  {(modo === "Modificar/Eliminar") && (
                    <TableCell align="center">
                      <Button variant="outlined" color="error" size="small" onClick={() => handleEliminar(u.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {modo === "Registrar" && (
        <Button variant="contained" onClick={() => setOpenForm(true)} sx={{ mb: 2 }}>
          Registrar usuario
        </Button>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Registrar usuario</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre" margin="normal" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <TextField fullWidth label="Correo" type="email" margin="normal" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <TextField fullWidth label="Contraseña" type="password" margin="normal" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
          <TextField fullWidth label="Código" margin="normal" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          <Select fullWidth value={rol} onChange={(e) => setRol(e.target.value)} displayEmpty sx={{ mt: 2 }}>
            <MenuItem value="" disabled>Selecciona un rol</MenuItem>
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleRegistrar}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
