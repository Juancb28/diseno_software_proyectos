import { useEffect, useState } from "react";
import { listarAusencias } from "../api/ausenciasService";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RegistrarAusenciaForm from "../components/RegistrarAusenciaForm";

function AusenciasPage() {
  const [ausencias, setAusencias] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const cargarAusencias = () => {
    listarAusencias().then((res) => setAusencias(res.data));
  };

  useEffect(() => {
    cargarAusencias();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Ausencias</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Registrar Ausencia
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Personal</TableCell>
            <TableCell>Fecha Inicio</TableCell>
            <TableCell>Fecha Fin</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Motivo</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ausencias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No hay ausencias registradas
              </TableCell>
            </TableRow>
          ) : (
            ausencias.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.personal?.nombres} {a.personal?.apellidos}</TableCell>
                <TableCell>{a.fechaInicio}</TableCell>
                <TableCell>{a.fechaFin}</TableCell>
                <TableCell>{a.tipoAusencia}</TableCell>
                <TableCell>{a.motivo || "-"}</TableCell>
                <TableCell>{a.estadoAusencia}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <RegistrarAusenciaForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={cargarAusencias}
      />
    </Box>
  );
}

export default AusenciasPage;