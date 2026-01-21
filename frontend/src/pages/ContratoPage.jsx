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
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: "center" }}>
        Gestión de Contratos
      </Typography>

      <Paper sx={{ width: "90%", overflow: "hidden", mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Salario</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Personal</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contratos.map((c) => (
              <TableRow key={c.id}>
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
                    onClick={() => handleDescargarPDF(c.id)}
                    sx={{ mr: 1 }}
                  >
                    Descargar PDF
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
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

      <Button variant="contained" onClick={() => setOpenForm(true)}>
        Registrar Contrato
      </Button>

      {/* Formulario modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Registrar Contrato</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Número de Contrato"
            margin="normal"
            value={numeroContrato}
            onChange={(e) => setNumeroContrato(e.target.value)}
          />
          <TextField
            fullWidth
            type="date"
            label="Fecha Inicio"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <TextField
            fullWidth
            type="date"
            label="Fecha Fin"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          <TextField
            fullWidth
            label="Salario"
            margin="normal"
            type="number"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
          />
          <TextField
            fullWidth
            label="Tipo de Contrato"
            margin="normal"
            value={tipoContrato}
            onChange={(e) => setTipoContrato(e.target.value)}
          />
          <TextField
            fullWidth
            label="ID del Personal"
            margin="normal"
            value={personalId}
            onChange={(e) => setPersonalId(e.target.value)}
          />
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Subir PDF
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={(e) => setArchivo(e.target.files[0])}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleRegistrarContrato}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContratoPage;