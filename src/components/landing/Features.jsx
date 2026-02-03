import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

const features = [
  {
    icon: HowToRegIcon,
    title: "Control de Asistencia",
    description: "Registro automatizado de asistencia con múltiples métodos: QR, reconocimiento facial o manual.",
    color: "primary",
  },
  {
    icon: AssignmentIcon,
    title: "Gestión de Proyectos",
    description: "Seguimiento completo del avance de proyectos académicos con hitos y entregas programadas.",
    color: "secondary",
  },
  {
    icon: BarChartIcon,
    title: "Reportes Analíticos",
    description: "Dashboards interactivos con métricas en tiempo real para tomar decisiones informadas.",
    color: "success",
  },
  {
    icon: NotificationsIcon,
    title: "Notificaciones Inteligentes",
    description: "Alertas automáticas para estudiantes, profesores y coordinadores sobre eventos importantes.",
    color: "primary",
  },
  {
    icon: SecurityIcon,
    title: "Seguridad Institucional",
    description: "Protección de datos con encriptación de nivel empresarial y cumplimiento normativo.",
    color: "secondary",
  },
  {
    icon: PhoneAndroidIcon,
    title: "Acceso Móvil",
    description: "Aplicación responsive que funciona perfectamente en cualquier dispositivo.",
    color: "success",
  },
];

const colorMap = {
  primary: { bg: "rgba(21, 101, 192, 0.12)", icon: "primary.main" },
  secondary: { bg: "rgba(13, 71, 161, 0.12)", icon: "secondary.main" },
  success: { bg: "rgba(46, 125, 50, 0.12)", icon: "success.main" },
};

export default function Features() {
  return (
    <Box
      component="section"
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "background.paper",
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
            Características
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
            Todo lo que necesitas para una{" "}
            <Box component="span" sx={{ background: "linear-gradient(90deg, #1565c0, #0d47a1)", backgroundClip: "text", color: "transparent" }}>
              gestión eficiente
            </Box>
          </Typography>
          <Typography sx={{ fontSize: "1.125rem", color: "text.secondary" }}>
            Herramientas diseñadas específicamente para las necesidades de instituciones educativas de nivel superior.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: { xs: 3, md: 4 },
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorConf = colorMap[feature.color] || colorMap.primary;
            return (
              <Box
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  "&:hover .feature-icon": { transform: "scale(1.1)" },
                  "&:hover .feature-card": { boxShadow: 4, transform: "translateY(-4px)" },
                }}
              >
                <Box
                  className="feature-card"
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    p: { xs: 3, md: 4 },
                    background: "linear-gradient(135deg, rgba(13, 71, 161, 0.02) 0%, rgba(21, 101, 192, 0.04) 100%)",
                    transition: "box-shadow 0.3s, transform 0.3s",
                  }}
                >
                  <Box
                    className="feature-icon"
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: colorConf.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      color: colorConf.icon,
                      transition: "transform 0.3s",
                    }}
                  >
                    <Icon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, color: "text.primary" }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
