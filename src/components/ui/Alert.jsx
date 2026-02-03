import * as React from "react";
import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Box, Typography } from "@mui/material";

const variantMap = {
  default: "standard",
  destructive: "error",
};

/**
 * Alert - contenedor con variantes default | destructive.
 */
const Alert = React.forwardRef(function Alert({ variant = "default", children, sx, ...props }, ref) {
  const muiVariant = variantMap[variant] || "standard";
  return (
    <MuiAlert
      ref={ref}
      role="alert"
      variant={muiVariant}
      severity={variant === "destructive" ? "error" : "info"}
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: variant === "destructive" ? "error.main" : "divider",
        "& .MuiAlert-message": { width: "100%" },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiAlert>
  );
});
Alert.displayName = "Alert";

const AlertTitleRef = React.forwardRef(function AlertTitleRef(props, ref) {
  return (
    <AlertTitle ref={ref} sx={{ mb: 0.5, fontWeight: 600, fontSize: "0.875rem" }} {...props} />
  );
});
AlertTitleRef.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(function AlertDescription({ children, sx, ...props }, ref) {
  return (
    <Typography
      ref={ref}
      component="div"
      variant="body2"
      sx={{ fontSize: "0.875rem", "& p": { lineHeight: 1.6 }, ...sx }}
      {...props}
    >
      {children}
    </Typography>
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitleRef as AlertTitle, AlertDescription };
