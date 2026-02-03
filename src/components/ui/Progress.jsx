import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";

/**
 * Progress - barra de progreso. value entre 0 y 100.
 */
const Progress = React.forwardRef(function Progress({ value, sx, ...props }, ref) {
  return (
    <LinearProgress
      ref={ref}
      variant="determinate"
      value={value ?? 0}
      sx={{
        height: 8,
        width: "100%",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "action.hover",
        "& .MuiLinearProgress-bar": {
          background: "linear-gradient(90deg, #0d47a1, #1565c0)",
        },
        ...sx,
      }}
      {...props}
    />
  );
});
Progress.displayName = "Progress";

export { Progress };
