import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // puedes cambiar a "dark" si prefieres
    primary: {
      main: "#000000", // negro
      contrastText: "#FFFFFF", // texto blanco sobre negro
    },
    secondary: {
      main: "#FF0000", // rojo
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF", // fondo blanco
      paper: "#F9F9F9",   // gris muy claro para tarjetas
    },
    text: {
      primary: "#000000", // texto principal negro
      secondary: "#FF0000", // acentos en rojo
    },
    error: {
      main: "#FF0000", // rojo para errores
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 700,
      color: "#000000",
    },
    h6: {
      fontWeight: 600,
      color: "#000000",
    },
    body1: {
      color: "#000000",
    },
    body2: {
      color: "#333333",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: "#000000",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#333333",
          },
        },
        containedSecondary: {
          backgroundColor: "#FF0000",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#CC0000",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "16px",
        },
      },
    },
  },
});

export default theme;