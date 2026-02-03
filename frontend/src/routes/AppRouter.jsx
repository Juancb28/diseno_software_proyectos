import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import Dashboard from "../pages/DashBoard.jsx";
import Ausencias from "../pages/Ausencias";
import PersonalPage from "../pages/PersonalPage";
import Proyectos from "../pages/Proyectos";
import Asistencia from "../pages/Asistencia";
import Usuarios from "../pages/Usuarios";
import Login from "../pages/Login";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/ausencias" element={<Layout><Ausencias /></Layout>} />
      <Route path="/personal" element={<Layout><PersonalPage /></Layout>} />
      <Route path="/proyectos" element={<Layout><Proyectos /></Layout>} />
      <Route path="/asistencia" element={<Layout><Asistencia /></Layout>} />
      <Route path="/usuarios" element={<Layout><Usuarios /></Layout>} />
    </Routes>
  );
}

export default AppRouter;