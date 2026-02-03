import * as React from "react";
import MuiInputBase from "@mui/material/InputBase";
import { Box } from "@mui/material";

/**
 * Input - campo de texto con estilos del tema.
 */
const Input = React.forwardRef(function Input({ sx, ...props }, ref) {
  return (
    <MuiInputBase
      ref={ref}
      sx={{
        height: 40,
        width: "100%",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        px: 1.5,
        py: 1,
        fontSize: "0.875rem",
        "&.Mui-focused": { borderColor: "primary.main", outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
        "&.Mui-disabled": { cursor: "not-allowed", opacity: 0.5 },
        "&::placeholder": { color: "text.secondary" },
        ...sx,
      }}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
