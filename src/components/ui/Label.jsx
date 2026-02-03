import * as React from "react";
import FormLabel from "@mui/material/FormLabel";

/**
 * Label - etiqueta para formularios.
 */
const Label = React.forwardRef(function Label({ sx, ...props }, ref) {
  return (
    <FormLabel
      ref={ref}
      sx={{
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: "none",
        color: "text.primary",
        "&.Mui-disabled": { cursor: "not-allowed", opacity: 0.7 },
        ...sx,
      }}
      {...props}
    />
  );
});
Label.displayName = "Label";

export { Label };
