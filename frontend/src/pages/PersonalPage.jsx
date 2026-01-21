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
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { listarPersonal, registrarPersonal } from "../api/personalService";

function PersonalPage() {
  const [personal, setPersonal] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [nui, setNui] = useState("");
  const [codigo, setCodigo] = useState("");

  const cargarPersonal = () => {
    listarPersonal().then((res) => setPersonal(res.data));
  };

  useEffect(() => {
    cargarPersonal();
  }, []);

  const handleRegistrarPersonal = async () => {
    try {
      const data = { nombre, nui, codigo };
      await registrarPersonal(data);
      cargarPersonal();
      setOpenForm(false);
      setNombre("");
      setNui("");
      setCodigo("");
    } catch (err) {
      console.error("Error al registrar personal", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Personal</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Registrar Personal
        </Button>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>NUI</TableCell>
            <TableCell>Código</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personal.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>{p.nui}</TableCell>
              <TableCell>{p.codigo}</TableCell>
              <TableCell>{p.estado}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Formulario para registrar personal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Registrar Personal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre"
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            fullWidth
            label="NUI"
            margin="normal"
            value={nui}
            onChange={(e) => setNui(e.target.value)}
          />
          <TextField
            fullWidth
            label="Código"
            margin="normal"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleRegistrarPersonal}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PersonalPage;