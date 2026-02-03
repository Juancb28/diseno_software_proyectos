import { useEffect, useState } from "react";
import { Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { listarProyectosActivos } from "../api/proyectosService";
import { ausenciasPendientes } from "../api/ausenciasService";
import { listarPersonal } from "../api/personalService";

export default function DashBoard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ausenciasPendientes: 0,
    proyectosActivos: 0,
    personalRegistrado: 0,
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const [ausenciasRes, proyectosRes, personalRes] = await Promise.allSettled([
          ausenciasPendientes(),
          listarProyectosActivos(),
          listarPersonal(),
        ]);
        setStats({
          ausenciasPendientes: ausenciasRes.status === "fulfilled" ? (ausenciasRes.value?.data?.length ?? 0) : 0,
          proyectosActivos: proyectosRes.status === "fulfilled" ? (proyectosRes.value?.data?.length ?? 0) : 0,
          personalRegistrado: personalRes.status === "fulfilled" ? (personalRes.value?.data?.length ?? 0) : 0,
        });
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const items = [
    { title: "Ausencias pendientes", value: stats.ausenciasPendientes },
    { title: "Proyectos activos", value: stats.proyectosActivos },
    { title: "Personal registrado", value: stats.personalRegistrado },
  ];

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {items.map((s) => (
        <Grid item xs={12} md={4} key={s.title}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary">
              {s.title}
            </Typography>
            <Typography variant="h4">{s.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
