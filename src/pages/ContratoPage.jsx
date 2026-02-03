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
  listarContratos,
  registrarContrato,
  descargarContratoPDF,
  eliminarContrato,
} from "../api/contratosService";

export default function ContratoPage({ modo }) {
  const [contratos, setContratos] = useState([]);
  const [personalId, setPersonalId] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [archivo, setArchivo] = useState(null);

  const cargar = () => {
    listarContratos()
      .then((res) => setContratos(res.data || []))
      .catch(() => setContratos([]));
  };

  useEffect(() => {
    cargar();
  }, [modo]);

  const handleRegistrar = async () => {
    const formData = new FormData();
    formData.append("personalId", personalId);
    formData.append("numeroContrato", numeroContrato);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFin", fechaFin);
    if (archivo) formData.append("archivo", archivo);
    try {
      await registrarContrato(formData);
      cargar();
      setPersonalId("");
      setNumeroContrato("");
      setFechaInicio("");
      setFechaFin("");
      setArchivo(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDescargar = async (id) => {
    try {
      const res = await descargarContratoPDF(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contrato-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarContrato(id);
      cargar();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Contrato - {modo}
      </Typography>

      {(modo === "Registrar" || modo === "Subir PDF") && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Registrar contrato</Typography>
          <TextField label="ID Personal" fullWidth margin="normal" value={personalId} onChange={(e) => setPersonalId(e.target.value)} />
          <TextField label="Número contrato" fullWidth margin="normal" value={numeroContrato} onChange={(e) => setNumeroContrato(e.target.value)} />
          <TextField label="Fecha inicio" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <TextField label="Fecha fin" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Seleccionar PDF
            <input type="file" accept="application/pdf" hidden onChange={(e) => setArchivo(e.target.files?.[0])} />
          </Button>
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegistrar}>Guardar</Button>
        </Paper>
      )}

      <Paper sx={{ overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Número</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Inicio</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fin</TableCell>
              {(modo === "Descargar PDF" || modo === "Eliminar") && (
                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {contratos.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.numeroContrato}</TableCell>
                <TableCell>{c.fechaInicio}</TableCell>
                <TableCell>{c.fechaFin}</TableCell>
                {(modo === "Descargar PDF" || modo === "Eliminar") && (
                  <TableCell align="center">
                    {modo === "Descargar PDF" && (
                      <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleDescargar(c.id)}>PDF</Button>
                    )}
                    {modo === "Eliminar" && (
                      <Button size="small" color="error" variant="outlined" onClick={() => handleEliminar(c.id)}>Eliminar</Button>
                    )}
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
