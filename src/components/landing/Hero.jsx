import { motion } from "framer-motion";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

const benefits = [
  "Control de asistencia automatizado",
  "Seguimiento de proyectos en tiempo real",
  "Reportes detallados al instante",
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)",
        overflow: "hidden",
        pt: { xs: 10, md: 12 },
      }}
    >
      {/* Decoraciones de fondo */}
      <Box sx={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            right: -80,
            width: 384,
            height: 384,
            borderRadius: "50%",
            bgcolor: "primary.main",
            opacity: 0.1,
            filter: "blur(60px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "25%",
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: "secondary.main",
            opacity: 0.1,
            filter: "blur(60px)",
          }}
        />
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: { xs: 4, md: 6 }, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 4,
            alignItems: "center",
          }}
        >
          {/* Columna izquierda */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: { xs: "center", lg: "left" } }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(255,255,255,0.15)",
                color: "white",
                px: 2,
                py: 1,
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 600,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "white",
                  animation: "ping 1.5s ease-in-out infinite",
                  "@keyframes ping": {
                    "75%, 100%": { transform: "scale(1.5)", opacity: 0 },
                  },
                }}
              />
              Plataforma líder en gestión universitaria
            </Box>

            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                lineHeight: 1.2,
              }}
            >
              Gestiona la{" "}
              <Box component="span" sx={{ background: "linear-gradient(90deg, #90caf9, #e3f2fd)", backgroundClip: "text", color: "transparent" }}>
                asistencia
              </Box>{" "}
              y{" "}
              <Box component="span" sx={{ background: "linear-gradient(90deg, #90caf9, #e3f2fd)", backgroundClip: "text", color: "transparent" }}>
                proyectos
              </Box>{" "}
              de tu universidad
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                color: "rgba(255,255,255,0.9)",
                mb: 3,
                maxWidth: 540,
                mx: { xs: "auto", lg: 0 },
              }}
            >
              Una plataforma integral para el seguimiento de asistencia estudiantil y el control de avances en proyectos académicos. Simple, eficiente y confiable.
            </Typography>

            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mb: 3 }}>
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  component={motion.li}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "rgba(255,255,255,0.9)",
                    justifyContent: { xs: "center", lg: "flex-start" },
                    mb: 1,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 20, color: "success.light", flexShrink: 0 }} />
                  <span>{benefit}</span>
                </Box>
              ))}
            </Box>

            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: { xs: "center", lg: "flex-start" },
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
                endIcon={<ArrowForwardIcon sx={{ transition: "transform 0.2s", "&:hover": { transform: "translateX(4px)" } }} />}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                Comenzar Ahora
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { borderColor: "grey.300", bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                Ver Demo
              </Button>
            </Box>
          </Box>

          {/* Columna derecha - Panel de control */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            sx={{ position: "relative" }}
          >
            <Box
              sx={{
                borderRadius: 2,
                boxShadow: 6,
                border: "1px solid",
                borderColor: "divider",
                p: 3,
                bgcolor: "background.paper",
                background: "linear-gradient(135deg, rgba(13, 71, 161, 0.03) 0%, rgba(21, 101, 192, 0.05) 100%)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography fontWeight={600} color="text.primary">
                  Panel de Control
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    bgcolor: "action.hover",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "9999px",
                  }}
                >
                  En vivo
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
                <Box sx={{ bgcolor: "action.hover", borderRadius: 2, p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Asistencia Hoy
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    94.5%
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +2.3% vs ayer
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: "action.hover", borderRadius: 2, p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Proyectos Activos
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    127
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    en 12 facultades
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ "& > div": { mb: 2 } }}>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ingeniería de Software
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      78%
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, bgcolor: "action.hover", borderRadius: 1, overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: "78%", background: "linear-gradient(90deg, #0d47a1, #1565c0)", borderRadius: 1 }} />
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Bases de Datos
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      92%
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, bgcolor: "action.hover", borderRadius: 1, overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: "92%", background: "linear-gradient(90deg, #1565c0, #1976d2)", borderRadius: 1 }} />
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* Tarjeta flotante */}
            <Box
              component={motion.div}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              sx={{
                position: "absolute",
                top: -16,
                right: -16,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
                border: "1px solid",
                borderColor: "divider",
                p: 2,
                width: 200,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1565c0, #1976d2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 20, color: "white" }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Entrega Exitosa
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hace 2 min
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
