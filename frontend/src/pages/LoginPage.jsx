import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { login } from "../api/usuariosService";

function LoginPage({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login({ correo, contrasena });
      if (res.data.autenticado) {
        onLogin(res.data.usuario); // ✅ pasa el usuario correcto
      } else {
        setError(res.data.mensaje);
      }
    } catch (err) {
      setError("Error en login");
    }
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" gutterBottom>
        Iniciar Sesión
      </Typography>
      <TextField
        label="Correo"
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
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
        Entrar
      </Button>
    </Box>
  );
}

export default LoginPage;