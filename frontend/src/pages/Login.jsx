import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // 🔒 Lista de usuarios válidos (puedes agregar más)
  const usuariosValidos = [
    { usuario: "kevin.palacios@epn.edu.ec", password: "123456" }, // fijo
    { usuario: "admin@empresa.com", password: "admin" },
    { usuario: "usuario@empresa.com", password: "usuario123" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const usuario = formData.get("usuario");
    const password = formData.get("password");

    // Verifica si existe en la lista
    const encontrado = usuariosValidos.find(
      (u) => u.usuario === usuario && u.password === password
    );

    if (encontrado) {
      navigate("/dashboard"); // Redirige al Dashboard
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" gutterBottom align="center">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField name="usuario" label="Usuario" required />
          <TextField name="password" label="Contraseña" type="password" required />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary">
            Acceder
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;