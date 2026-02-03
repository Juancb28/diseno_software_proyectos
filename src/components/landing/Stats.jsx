import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

function Counter({ end, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let rafId;

    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 50, suffix: "+", label: "Universidades", description: "confían en nuestra plataforma" },
  { value: 125000, suffix: "+", label: "Estudiantes", description: "registrados activamente" },
  { value: 98, suffix: "%", label: "Satisfacción", description: "de nuestros usuarios" },
  { value: 2500000, suffix: "+", label: "Asistencias", description: "registradas mensualmente" },
];

export default function Stats() {
  return (
    <Box
      component="section"
      id="stats"
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Patrón de fondo */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          "& > span": {
            position: "absolute",
            border: "2px solid",
            borderColor: "white",
            borderRadius: "50%",
          },
        }}
      >
        <Box component="span" sx={{ top: 40, left: 40, width: 128, height: 128 }} />
        <Box component="span" sx={{ bottom: 80, right: 80, width: 192, height: 192 }} />
        <Box component="span" sx={{ top: "50%", left: "33%", width: 96, height: 96 }} />
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, position: "relative", zIndex: 1 }}>
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
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "white",
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem", lg: "2.5rem" },
            }}
          >
            Resultados que hablan por sí solos
          </Typography>
          <Typography sx={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.85)" }}>
            Números que demuestran nuestro compromiso con la excelencia educativa.
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
            gap: 4,
          }}
        >
          {stats.map((stat, index) => (
            <Box
              key={index}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              sx={{ textAlign: "center" }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                  fontWeight: 700,
                  color: "white",
                  mb: 1,
                }}
              >
                <Counter end={stat.value} suffix={stat.suffix} duration={2} />
              </Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, color: "white", mb: 0.5 }}>
                {stat.label}
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.75)" }}>
                {stat.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
