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
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoAusencia, setTipoAusencia] = useState("");
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    listarPersonal().then((res) => setPersonal(res.data));
  }, []);

  const handleSubmit = async () => {
    try {
      const data = { 
        fechaInicio, 
        fechaFin, 
        tipoAusencia,
        motivo 
      };
      await notificarAusencia(personalId, data);
      onSuccess(); // refresca la lista en AusenciasPage
      onClose();
      // Limpiar campos
      setPersonalId("");
      setFechaInicio("");
      setFechaFin("");
      setTipoAusencia("");
      setMotivo("");
    } catch (err) {
      console.error("Error al registrar ausencia", err);
      alert("Error al registrar ausencia: " + (err.response?.data?.message || err.message));
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
              {p.nombres} {p.apellidos}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="date"
          label="Fecha Inicio"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />

        <TextField
          fullWidth
          type="date"
          label="Fecha Fin"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          required
        />

        <TextField
          select
          fullWidth
          label="Tipo de Ausencia"
          margin="normal"
          value={tipoAusencia}
          onChange={(e) => setTipoAusencia(e.target.value)}
          required
        >
          <MenuItem value="VACACIONES">Vacaciones</MenuItem>
          <MenuItem value="ENFERMEDAD">Enfermedad</MenuItem>
          <MenuItem value="PERMISO_PERSONAL">Permiso Personal</MenuItem>
          <MenuItem value="LICENCIA_MATERNIDAD">Licencia de Maternidad</MenuItem>
          <MenuItem value="SUSPENSION">Suspensión</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Motivo"
          margin="normal"
          multiline
          rows={3}
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