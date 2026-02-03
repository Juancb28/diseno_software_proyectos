import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
} from "@mui/material";
import {
  listarPersonal,
  registrarPersonal,
  cambiarEstadoPersonal,
} from "../api/personalService";

const ESTADOS_LABORAL = ["ACTIVO", "INACTIVO", "VACACIONES"];

export default function PersonalPage({ modo }) {
  const [personal, setPersonal] = useState([]);
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nui, setNui] = useState("");
  const [estadoId, setEstadoId] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("ACTIVO");

  const cargar = () => {
    listarPersonal()
      .then((res) => setPersonal(res.data || []))
      .catch(() => setPersonal([]));
  };

  useEffect(() => {
    cargar();
  }, [modo]);

  const handleRegistrar = async () => {
    try {
      await registrarPersonal({ nombre, codigo, nui });
      cargar();
      setNombre("");
      setCodigo("");
      setNui("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleCambiarEstado = async () => {
    if (!estadoId) return;
    try {
      await cambiarEstadoPersonal(estadoId, nuevoEstado);
      cargar();
      setEstadoId("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Personal - {modo}
      </Typography>

      {(modo === "Registrar" || modo === "Ligar con proyecto") && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Registrar personal</Typography>
          <TextField label="Nombre" fullWidth margin="normal" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <TextField label="Código" fullWidth margin="normal" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          <TextField label="NUI" fullWidth margin="normal" value={nui} onChange={(e) => setNui(e.target.value)} />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleRegistrar}>Guardar</Button>
        </Paper>
      )}

      {(modo === "Cambiar estado") && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Cambiar estado laboral</Typography>
          <TextField label="ID del personal" fullWidth margin="normal" value={estadoId} onChange={(e) => setEstadoId(e.target.value)} />
          <Select fullWidth margin="normal" value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
            {ESTADOS_LABORAL.map((e) => (
              <MenuItem key={e} value={e}>{e}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleCambiarEstado}>Actualizar estado</Button>
        </Paper>
      )}

      <Paper sx={{ overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Código</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>NUI</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personal.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.codigo}</TableCell>
                <TableCell>{p.nui}</TableCell>
                <TableCell>{p.estadoLaboral}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
