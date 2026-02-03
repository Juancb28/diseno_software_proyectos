import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import {
  obtenerRegistrosAsistencia,
  obtenerRegistrosPorFecha,
  registrarAsistencia,
} from "../api/biometriaService";

export default function AsistenciaPage({ modo }) {
  const [registros, setRegistros] = useState([]);
  const [personalId, setPersonalId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [tipoRegistro, setTipoRegistro] = useState("ENTRADA");

  const cargarRegistros = () => {
    if (!personalId) return;
    const api = fecha
      ? () => obtenerRegistrosPorFecha(personalId, fecha)
      : () => obtenerRegistrosAsistencia(personalId);
    api()
      .then((res) => setRegistros(res.data || []))
      .catch(() => setRegistros([]));
  };

  useEffect(() => {
    if (personalId) cargarRegistros();
    else setRegistros([]);
  }, [personalId, fecha]);

  const handleRegistrar = async () => {
    if (!personalId) return;
    try {
      await registrarAsistencia(personalId, tipoRegistro);
      cargarRegistros();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Asistencia - {modo}
      </Typography>

      {(modo === "Registrar biométrica" || modo === "Laboratorio" || modo === "QR") && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Registrar asistencia</Typography>
          <TextField label="ID Personal" fullWidth margin="normal" value={personalId} onChange={(e) => setPersonalId(e.target.value)} />
          <Select fullWidth margin="normal" value={tipoRegistro} onChange={(e) => setTipoRegistro(e.target.value)}>
            <MenuItem value="ENTRADA">Entrada</MenuItem>
            <MenuItem value="SALIDA">Salida</MenuItem>
          </Select>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleRegistrar}>Registrar</Button>
        </Paper>
      )}

      {(modo === "Visualizar registros" || modo === "Revisar") && (
        <>
          <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <TextField label="ID Personal" value={personalId} onChange={(e) => setPersonalId(e.target.value)} />
            <TextField label="Fecha" type="date" InputLabelProps={{ shrink: true }} value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </Box>
          <Paper sx={{ overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha/Hora</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tipo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registros.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.fechaHora ?? r.fecha}</TableCell>
                    <TableCell>{r.tipoRegistro}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </Box>
  );
}
