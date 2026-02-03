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
} from "@mui/material";
import {
  listarAusencias,
  ausenciasPendientes,
  notificarAusencia,
  aprobarAusencia,
  rechazarAusencia,
} from "../api/ausenciasService";

export default function AusenciasPage({ modo }) {
  const [ausencias, setAusencias] = useState([]);
  const [personalId, setPersonalId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [motivo, setMotivo] = useState("");
  const [rechazoMotivo, setRechazoMotivo] = useState("");

  const cargar = () => {
    const api = modo === "Pendientes" || modo === "Aprobar/Rechazar" ? ausenciasPendientes : listarAusencias;
    api()
      .then((res) => setAusencias(res.data || []))
      .catch(() => setAusencias([]));
  };

  useEffect(() => {
    cargar();
  }, [modo]);

  const handleNotificar = async () => {
    if (!personalId) return;
    try {
      await notificarAusencia(personalId, { fechaInicio, fechaFin, motivo });
      cargar();
      setPersonalId("");
      setFechaInicio("");
      setFechaFin("");
      setMotivo("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAprobar = async (ausenciaId, aprobadorId) => {
    try {
      await aprobarAusencia(ausenciaId, aprobadorId);
      cargar();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRechazar = async (ausenciaId, aprobadorId) => {
    try {
      await rechazarAusencia(ausenciaId, aprobadorId, rechazoMotivo);
      cargar();
      setRechazoMotivo("");
    } catch (e) {
      console.error(e);
    }
  };

  const esPendientes = modo === "Pendientes" || modo === "Aprobar/Rechazar" || modo === "Revisar";

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Ausencias - {modo}
      </Typography>

      {(modo === "Listar todas" || modo === "Notificar ausencia" || modo === "Registrar ayudantes") && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Notificar ausencia</Typography>
          <TextField label="ID Personal" fullWidth margin="normal" value={personalId} onChange={(e) => setPersonalId(e.target.value)} />
          <TextField label="Fecha inicio" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <TextField label="Fecha fin" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          <TextField label="Motivo" fullWidth margin="normal" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleNotificar}>Enviar</Button>
        </Paper>
      )}

      <Paper sx={{ overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Personal ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha inicio</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha fin</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
              {esPendientes && (
                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {ausencias.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.id}</TableCell>
                <TableCell>{a.personalId ?? a.personal?.id}</TableCell>
                <TableCell>{a.fechaInicio}</TableCell>
                <TableCell>{a.fechaFin}</TableCell>
                <TableCell>{a.estado}</TableCell>
                {esPendientes && (
                  <TableCell align="center">
                    <Button size="small" variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleAprobar(a.id, 1)}>Aprobar</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleRechazar(a.id, 1)}>Rechazar</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
