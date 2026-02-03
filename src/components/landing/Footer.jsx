import { Box, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const links = {
  producto: ["Características", "Precios", "Integraciones", "Actualizaciones"],
  recursos: ["Documentación", "Tutoriales", "Blog", "Webinars"],
  empresa: ["Sobre Nosotros", "Carreras", "Contacto", "Partners"],
  legal: ["Privacidad", "Términos", "Seguridad", "GDPR"],
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "grey.900",
        color: "white",
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" },
            gap: 4,
            mb: 4,
          }}
        >
          {/* Brand */}
          <Box sx={{ gridColumn: { xs: "span 2", lg: "span 2" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
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
              <Typography variant="h6" fontWeight="bold">
                Sistema Asistencia
              </Typography>
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 2, maxWidth: 280 }}>
              La plataforma líder en gestión de asistencia y proyectos para universidades.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography
                component="a"
                href="mailto:info@universidad.edu"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                <EmailIcon sx={{ fontSize: 18 }} />
                info@universidad.edu
              </Typography>
              <Typography
                component="a"
                href="tel:+1234567890"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                <PhoneIcon sx={{ fontSize: 18 }} />
                +1 (234) 567-890
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.875rem",
                }}
              >
                <LocationOnIcon sx={{ fontSize: 18 }} />
                Ciudad Universitaria
              </Box>
            </Box>
          </Box>

          {/* Link columns */}
          <Box>
            <Typography component="h4" sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}>
              Producto
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {links.producto.map((link) => (
                <li key={link}>
                  <Typography
                    component="a"
                    href="#"
                    sx={{
                      display: "block",
                      py: 0.75,
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                      "&:hover": { color: "white" },
                    }}
                  >
                    {link}
                  </Typography>
                </li>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography component="h4" sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}>
              Recursos
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {links.recursos.map((link) => (
                <li key={link}>
                  <Typography
                    component="a"
                    href="#"
                    sx={{
                      display: "block",
                      py: 0.75,
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                      "&:hover": { color: "white" },
                    }}
                  >
                    {link}
                  </Typography>
                </li>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography component="h4" sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}>
              Empresa
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {links.empresa.map((link) => (
                <li key={link}>
                  <Typography
                    component="a"
                    href="#"
                    sx={{
                      display: "block",
                      py: 0.75,
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                      "&:hover": { color: "white" },
                    }}
                  >
                    {link}
                  </Typography>
                </li>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography component="h4" sx={{ fontWeight: 600, mb: 2, fontSize: "1rem" }}>
              Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {links.legal.map((link) => (
                <li key={link}>
                  <Typography
                    component="a"
                    href="#"
                    sx={{
                      display: "block",
                      py: 0.75,
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                      "&:hover": { color: "white" },
                    }}
                  >
                    {link}
                  </Typography>
                </li>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "rgba(255,255,255,0.1)",
            pt: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
            © {new Date().getFullYear()} Sistema Asistencia. Todos los derechos reservados.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography
              component="a"
              href="#"
              sx={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                "&:hover": { color: "white" },
              }}
            >
              Política de Privacidad
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                "&:hover": { color: "white" },
              }}
            >
              Términos de Uso
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
