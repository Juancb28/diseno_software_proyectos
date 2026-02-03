import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/AppLayout";
import SimpleTest from "./components/SimpleTest";
import TailwindTest from "./components/TailwindTest";
import Diagnostic from "./components/Diagnostic";
import TestSimple from "./components/TestSimple";
import TestBasico from "./components/TestBasico";
import TestFuncional from "./components/TestFuncional";

const theme = createTheme({
  palette: {
    primary: { main: "#1565c0" },
    secondary: { main: "#0d47a1" },
  },
});

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <LoginPage onLogin={(u) => setUsuario(u)} />
            }
          />
          <Route
            path="/app/*"
            element={
              usuario ? (
                <AppLayout usuario={usuario} onLogout={() => setUsuario(null)} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/test-components" element={<SimpleTest />} />
          <Route path="/test-tailwind" element={<TailwindTest />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/test-simple" element={<TestSimple />} />
          <Route path="/test-basico" element={<TestBasico />} />
          <Route path="/test-funcional" element={<TestFuncional />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
