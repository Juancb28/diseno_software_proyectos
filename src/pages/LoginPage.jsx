import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { login } from "../api/usuariosService";
import { useNavigate } from "react-router-dom";

// Usuario de prueba solo en frontend (sin backend)
const USUARIO_PRUEBA = {
  correo: "test@test.com",
  contrasena: "123456",
  usuario: {
    id: 0,
    nombre: "Usuario de prueba",
    correo: "test@test.com",
    rol: "ADMINISTRADOR",
    codigo: "TEST001",
  },
};

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    // Si coincide con el usuario de prueba, entrar sin llamar al backend
    if (correo === USUARIO_PRUEBA.correo && contrasena === USUARIO_PRUEBA.contrasena) {
      onLogin(USUARIO_PRUEBA.usuario);
      navigate("/app");
      return;
    }
    try {
      const res = await login({ correo, contrasena });
      if (res.data?.autenticado && res.data?.usuario) {
        onLogin(res.data.usuario);
        navigate("/app");
      } else {
        setError(res.data?.mensaje || "Credenciales incorrectas");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al conectar con el servidor");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" gutterBottom align="center">
          Iniciar sesión
        </Typography>
        <TextField
          label="Correo"
          type="email"
          fullWidth
          margin="normal"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
        <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/")}>
          Volver a inicio
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 2, color: "text.secondary", textAlign: "center" }}>
          Prueba: test@test.com / 123456
        </Typography>
      </Paper>
    </Box>
  );
}
