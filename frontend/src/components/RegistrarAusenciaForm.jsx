import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { notificarAusencia } from "../api/ausenciasService";
import { listarPersonal } from "../api/personalService";

function RegistrarAusenciaForm({ open, onClose, onSuccess }) {
  const [personal, setPersonal] = useState([]);
  const [personalId, setPersonalId] = useState("");
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    listarPersonal().then((res) => setPersonal(res.data));
  }, []);

  const handleSubmit = async () => {
    try {
      const data = { fecha, motivo };
      await notificarAusencia(personalId, data);
      onSuccess(); // refresca la lista en AusenciasPage
      onClose();
    } catch (err) {
      console.error("Error al registrar ausencia", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar Ausencia</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          label="Personal"
          margin="normal"
          value={personalId}
          onChange={(e) => setPersonalId(e.target.value)}
        >
          {personal.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="date"
          label="Fecha"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <TextField
          fullWidth
          label="Motivo"
          margin="normal"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RegistrarAusenciaForm;