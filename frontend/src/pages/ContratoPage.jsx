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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  listarContratos,
  registrarContrato,
  descargarContratoPDF,
  eliminarContrato,
} from "../api/contratosService";

function ContratoPage() {
  const [contratos, setContratos] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [numeroContrato, setNumeroContrato] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [salario, setSalario] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [personalId, setPersonalId] = useState("");
  const [archivo, setArchivo] = useState(null);

  const cargarContratos = () => {
    listarContratos().then((res) => setContratos(res.data));
  };

  useEffect(() => {
    cargarContratos();
  }, []);

  const handleRegistrarContrato = async () => {
    const formData = new FormData();
    formData.append("numeroContrato", numeroContrato);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFin", fechaFin);
    formData.append("salario", salario);
    formData.append("tipoContrato", tipoContrato);
    formData.append("personalId", personalId);
    if (archivo) formData.append("archivo", archivo);

    await registrarContrato(formData);
    cargarContratos();
    setOpenForm(false);
    // limpiar formulario
    setNumeroContrato("");
    setFechaInicio("");
    setFechaFin("");
    setSalario("");
    setTipoContrato("");
    setPersonalId("");
    setArchivo(null);
  };

  const handleDescargarPDF = async (id) => {
    try {
      const res = await descargarContratoPDF(id);
      const blob =
        res.data instanceof Blob
          ? res.data
          : new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contrato-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar contrato PDF", err);
    }
  };

  const handleEliminarContrato = async (id, personalId) => {
    try {
      await eliminarContrato(id, personalId);
      cargarContratos();
    } catch (err) {
      console.error("Error al eliminar contrato", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 3, textAlign: "center", fontWeight: "bold", color: "primary.main" }}
      >
        Gestión de Contratos
      </Typography>

      {/* Tabla estilizada */}
      <Paper elevation={3} sx={{ width: "100%", mb: 3, borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Número</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Inicio</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fin</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Salario</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tipo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Personal</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contratos.map((c, i) => (
              <TableRow
                key={c.id}
                sx={{
                  bgcolor: i % 2 === 0 ? "#F9F9F9" : "white",
                  "&:hover": { bgcolor: "#F3F4F6" },
                }}
              >
                <TableCell>{c.numeroContrato}</TableCell>
                <TableCell>{c.fechaInicio}</TableCell>
                <TableCell>{c.fechaFin}</TableCell>
                <TableCell>{c.salario}</TableCell>
                <TableCell>{c.tipoContrato}</TableCell>
                <TableCell>{c.personalId}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PictureAsPdfIcon />}
                    sx={{ mr: 1, borderRadius: 2 }}
                    onClick={() => handleDescargarPDF(c.id)}
                  >
                    PDF
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<DeleteIcon />}
                    sx={{ borderRadius: 2 }}
                    onClick={() => handleEliminarContrato(c.id, c.personalId)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Botón registrar */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => setOpenForm(true)}
        >
          Registrar Contrato
        </Button>
      </Box>

      {/* Formulario modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
          Registrar Contrato
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Número de Contrato" margin="normal" value={numeroContrato} onChange={(e) => setNumeroContrato(e.target.value)} />
          <TextField fullWidth type="date" label="Fecha Inicio" margin="normal" InputLabelProps={{ shrink: true }} value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <TextField fullWidth type="date" label="Fecha Fin" margin="normal" InputLabelProps={{ shrink: true }} value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          <TextField fullWidth label="Salario" margin="normal" type="number" value={salario} onChange={(e) => setSalario(e.target.value)} />
          <TextField fullWidth label="Tipo de Contrato" margin="normal" value={tipoContrato} onChange={(e) => setTipoContrato(e.target.value)} />
          <TextField fullWidth label="ID del Personal" margin="normal" value={personalId} onChange={(e) => setPersonalId(e.target.value)} />
          <Button variant="outlined" component="label" sx={{ mt: 2, borderRadius: 2 }}>
            Subir PDF
            <input type="file" hidden accept="application/pdf" onChange={(e) => setArchivo(e.target.files[0])} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleRegistrarContrato}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContratoPage;