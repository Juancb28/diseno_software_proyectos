import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Button, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: "Características" },
    { href: "#how-it-works", label: "Cómo Funciona" },
    { href: "#stats", label: "Resultados" },
  ];

  return (
    <Box
      component={motion.header}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: { xs: 56, md: 64 },
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SchoolIcon sx={{ fontSize: 24, color: "white" }} />
            </Box>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Sistema Asistencia
            </Typography>
          </Box>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 4 }}>
            {navLinks.map((link) => (
              <Typography
                key={link.href}
                component="a"
                href={link.href}
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": { color: "text.primary" },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* Desktop CTA */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
            <Button variant="text" color="inherit" onClick={() => navigate("/login")} sx={{ fontWeight: 600 }}>
              Iniciar Sesión
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Acceder al sistema
            </Button>
          </Box>

          {/* Mobile menu button */}
          <Button
            sx={{ display: { md: "none" }, minWidth: 48 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </Button>
        </Box>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              sx={{
                py: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {navLinks.map((link) => (
                  <Typography
                    key={link.href}
                    component="a"
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                      textDecoration: "none",
                      py: 1,
                      "&:hover": { color: "text.primary" },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 2 }}>
                  <Button variant="outlined" fullWidth onClick={() => { navigate("/login"); setIsMenuOpen(false); }}>
                    Iniciar Sesión
                  </Button>
                  <Button variant="contained" fullWidth onClick={() => { navigate("/login"); setIsMenuOpen(false); }}>
                    Acceder al sistema
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
