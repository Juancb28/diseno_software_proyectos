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
  listarAsistencia,
  registrarAsistencia,
  eliminarAsistencia,
} from "../api/asistenciaService";

function AsistenciaPage() {
  const [asistencias, setAsistencias] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [personalId, setPersonalId] = useState("");
  const [estado, setEstado] = useState("");

  const cargarAsistencias = () => {
    listarAsistencia().then((res) => setAsistencias(res.data));
  };

  useEffect(() => {
    cargarAsistencias();
  }, []);

  const handleRegistrarAsistencia = async () => {
    await registrarAsistencia({ personalId, estado });
    cargarAsistencias();
    setOpenForm(false);
    setPersonalId("");
    setEstado("");
  };

  const handleEliminarAsistencia = async (id) => {
    await eliminarAsistencia(id);
    cargarAsistencias();
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: "center" }}>
        Gestión de Asistencia
      </Typography>

      <Paper sx={{ width: "90%", overflow: "hidden", mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID Personal</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asistencias.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.personalId}</TableCell>
                <TableCell>{a.fecha}</TableCell>
                <TableCell>{a.estado}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleEliminarAsistencia(a.id)}
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
        Registrar Asistencia
      </Button>

      {/* Botón registrar asistencia desde pasantes */}
      <Button variant="outlined" color="success" sx={{ mt: 2 }}>
        Registrar Asistencia (Pasante)
      </Button>

      {/* QR de respaldo */}
      <Box sx={{ mt: 2 }}>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RegistrarAsistenciaPasante"
          alt="QR Registrar Asistencia"
        />
        <Typography variant="caption" display="block" textAlign="center">
          Escanea este QR si no puedes registrar asistencia desde el sistema
        </Typography>
      </Box>

      {/* Formulario modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Registrar Asistencia</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="ID del Personal"
            margin="normal"
            value={personalId}
            onChange={(e) => setPersonalId(e.target.value)}
          />
          <TextField
            fullWidth
            label="Estado"
            margin="normal"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleRegistrarAsistencia}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AsistenciaPage;