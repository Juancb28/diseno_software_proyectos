import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import BoltIcon from "@mui/icons-material/Bolt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const steps = [
  {
    number: "01",
    icon: SettingsIcon,
    title: "Configuración Inicial",
    description: "Configura tu institución, carreras, materias y usuarios en minutos con nuestro asistente guiado.",
  },
  {
    number: "02",
    icon: PeopleIcon,
    title: "Registro de Participantes",
    description: "Importa estudiantes y docentes masivamente o regístralos individualmente con perfiles completos.",
  },
  {
    number: "03",
    icon: BoltIcon,
    title: "Seguimiento Automático",
    description: "El sistema registra asistencias y actualiza avances de proyectos automáticamente.",
  },
  {
    number: "04",
    icon: TrendingUpIcon,
    title: "Análisis y Mejora",
    description: "Obtén insights valiosos para mejorar el rendimiento académico y la gestión institucional.",
  },
];

export default function HowItWorks() {
  return (
    <Box
      component="section"
      id="how-it-works"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "action.hover",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        {/* Section Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 6 }}
        >
          <Typography
            component="span"
            sx={{
              display: "inline-block",
              color: "primary.main",
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              mb: 2,
            }}
          >
            Proceso Simple
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem", lg: "2.5rem" },
            }}
          >
            Comienza en{" "}
            <Box component="span" sx={{ background: "linear-gradient(90deg, #1565c0, #0d47a1)", backgroundClip: "text", color: "transparent" }}>
              4 pasos simples
            </Box>
          </Typography>
          <Typography sx={{ fontSize: "1.125rem", color: "text.secondary" }}>
            Implementa el sistema en tu universidad de forma rápida y sin complicaciones técnicas.
          </Typography>
        </Box>

        {/* Steps */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
            gap: 4,
          }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Box
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                sx={{ position: "relative", textAlign: "center" }}
              >
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", lg: "block" },
                      position: "absolute",
                      top: 48,
                      left: "60%",
                      width: "100%",
                      height: 2,
                      background: "linear-gradient(90deg, rgba(21, 101, 192, 0.3), transparent)",
                    }}
                  />
                )}
                <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                  <Box
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 14px rgba(21, 101, 192, 0.25)",
                    }}
                  >
                    <Icon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "secondary.main",
                      color: "white",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {step.number}
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, color: "text.primary" }}>
                  {step.title}
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {step.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
