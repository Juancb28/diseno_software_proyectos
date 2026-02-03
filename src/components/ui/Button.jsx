import * as React from "react";
import MuiButton from "@mui/material/Button";

const variantSx = {
  default: {
    bgcolor: "primary.main",
    color: "primary.contrastText",
    boxShadow: 2,
    "&:hover": { bgcolor: "primary.dark", boxShadow: 3 },
  },
  destructive: {
    bgcolor: "error.main",
    color: "error.contrastText",
    "&:hover": { bgcolor: "error.dark" },
  },
  outline: {
    border: "2px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    "&:hover": { bgcolor: "action.hover" },
  },
  secondary: {
    bgcolor: "secondary.main",
    color: "secondary.contrastText",
    "&:hover": { bgcolor: "secondary.dark" },
  },
  ghost: {
    bgcolor: "transparent",
    "&:hover": { bgcolor: "action.hover" },
  },
  link: {
    bgcolor: "transparent",
    textDecoration: "underline",
    textUnderlineOffset: 4,
    "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
  },
  hero: {
    background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)",
    color: "white",
    boxShadow: 3,
    "&:hover": { boxShadow: 4, transform: "scale(1.02)" },
    "&:active": { transform: "scale(0.98)" },
  },
  heroOutline: {
    border: "2px solid",
    borderColor: "primary.main",
    color: "primary.main",
    bgcolor: "transparent",
    "&:hover": { bgcolor: "rgba(21, 101, 192, 0.1)" },
  },
};

const sizeSx = {
  default: { height: 40, px: 2, py: 1, fontSize: "0.875rem" },
  sm: { height: 36, px: 1.5, borderRadius: 1, fontSize: "0.875rem" },
  lg: { height: 48, px: 3, fontSize: "1rem" },
  xl: { height: 56, px: 4, fontSize: "1.125rem" },
  icon: { width: 40, height: 40, p: 0, "& svg": { fontSize: 20 } },
};

/**
 * Button - con variantes: default | destructive | outline | secondary | ghost | link | hero | heroOutline.
 * Tamaños: default | sm | lg | xl | icon.
 */
const Button = React.forwardRef(function Button(
  { variant = "default", size = "default", className, sx, ...props },
  ref
) {
  const variantStyle = variantSx[variant] || variantSx.default;
  const sizeStyle = sizeSx[size] || sizeSx.default;
  const isContained = ["default", "destructive", "secondary", "hero"].includes(variant);
  return (
    <MuiButton
      ref={ref}
      variant={isContained ? "contained" : "outlined"}
      disableElevation={["ghost", "link"].includes(variant)}
      sx={{
        borderRadius: 2,
        fontWeight: 600,
        textTransform: "none",
        ...sizeStyle,
        ...variantStyle,
        ...sx,
      }}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
