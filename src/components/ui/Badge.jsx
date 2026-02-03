import * as React from "react";
import { Box, Typography } from "@mui/material";

const variantStyles = {
  default: { bg: "primary.main", color: "primary.contrastText", border: "transparent" },
  secondary: { bg: "secondary.main", color: "secondary.contrastText", border: "transparent" },
  destructive: { bg: "error.main", color: "error.contrastText", border: "transparent" },
  outline: { bg: "transparent", color: "text.primary", border: "divider" },
};

/**
 * Badge - etiqueta pequeña con variantes: default | secondary | destructive | outline.
 */
function Badge({ variant = "default", children, sx, ...props }) {
  const styles = variantStyles[variant] || variantStyles.default;
  return (
    <Box
      component="span"
      role="status"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "9999px",
        border: "1px solid",
        px: 1.25,
        py: 0.25,
        fontSize: "0.75rem",
        fontWeight: 600,
        bgcolor: styles.bg,
        color: styles.color,
        borderColor: styles.border,
        ...sx,
      }}
      {...props}
    >
      {typeof children === "string" ? (
        <Typography component="span" variant="caption" sx={{ fontWeight: 600 }}>
          {children}
        </Typography>
      ) : (
        children
      )}
    </Box>
  );
}

export { Badge };
