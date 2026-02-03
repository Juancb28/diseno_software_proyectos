import { motion } from "framer-motion";
import { Box, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const benefits = [
  "Sin costos de implementación",
  "Soporte técnico 24/7",
  "Capacitación incluida",
  "Migración de datos gratuita",
];

export default function CTA() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            p: { xs: 3, md: 4, lg: 5 },
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(13, 71, 161, 0.04) 0%, rgba(21, 101, 192, 0.06) 50%, rgba(25, 118, 210, 0.04) 100%)",
          }}
        >
          {/* Decoraciones de fondo */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 256,
              height: 256,
              borderRadius: "50%",
              bgcolor: "primary.main",
              opacity: 0.05,
              filter: "blur(40px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 192,
              height: 192,
              borderRadius: "50%",
              bgcolor: "secondary.main",
              opacity: 0.05,
              filter: "blur(40px)",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 720, mx: "auto" }}>
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
              Comienza Hoy
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
              ¿Listo para transformar la gestión de tu universidad?
            </Typography>

            <Typography
              sx={{
                fontSize: "1.125rem",
                color: "text.secondary",
                mb: 4,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Únete a las instituciones que ya confían en nuestro sistema para optimizar
              sus procesos académicos y administrativos.
            </Typography>

            {/* Beneficios */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                mb: 4,
              }}
            >
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  component={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 20, color: "success.main", flexShrink: 0 }} />
                  <Typography component="span" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Botones CTA */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
                endIcon={<ArrowForwardIcon sx={{ transition: "transform 0.2s", "&:hover": { transform: "translateX(4px)" } }} />}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Acceder al sistema
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              >
                Contactar ventas
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
