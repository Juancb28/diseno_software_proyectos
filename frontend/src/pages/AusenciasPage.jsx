import { useEffect, useState } from "react";
import { listarAusencias } from "../api/ausenciasService";
import { listarProyectos } from "../api/proyectosService";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RegistrarAusenciaForm from "../components/RegistrarAusenciaForm";

function AusenciasPage() {
  const [ausencias, setAusencias] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState("");
  const [openForm, setOpenForm] = useState(false);

  const cargarAusencias = () => {
    listarAusencias().then((res) => setAusencias(res.data));
  };

  useEffect(() => {
    cargarAusencias();
    listarProyectos().then((res) => setProyectos(res.data));
  }, []);

  const ausenciasFiltradas = proyectoSeleccionado
    ? ausencias.filter((a) => a.proyecto === proyectoSeleccionado)
    : ausencias;

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

      <TextField
        select
        label="Filtrar por proyecto"
        value={proyectoSeleccionado}
        onChange={(e) => setProyectoSeleccionado(e.target.value)}
        sx={{ mb: 2, minWidth: 200 }}
      >
        <MenuItem value="">Todos</MenuItem>
        {proyectos.map((p) => (
          <MenuItem key={p.id} value={p.nombre}>
            {p.nombre}
          </MenuItem>
        ))}
      </TextField>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Personal</TableCell>
            <TableCell>Proyecto</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Motivo</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ausenciasFiltradas.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.personal}</TableCell>
              <TableCell>{a.proyecto}</TableCell>
              <TableCell>{a.fecha}</TableCell>
              <TableCell>{a.motivo}</TableCell>
              <TableCell>{a.estado}</TableCell>
            </TableRow>
          ))}
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