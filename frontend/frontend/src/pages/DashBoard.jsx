import { Grid, Paper, Typography } from "@mui/material";

function Dashboard() {
  const stats = [
    { title: "Ausencias Pendientes", value: 5 },
    { title: "Proyectos Activos", value: 3 },
    { title: "Personal Registrado", value: 20 },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((s) => (
        <Grid item xs={12} md={4} key={s.title}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">{s.title}</Typography>
            <Typography variant="h4">{s.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default Dashboard;