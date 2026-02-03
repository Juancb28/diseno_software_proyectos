import * as React from "react";
import MuiRadioGroup from "@mui/material/RadioGroup";
import MuiRadio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

/**
 * RadioGroup - contenedor de opciones tipo radio.
 */
const RadioGroup = React.forwardRef(function RadioGroup({ sx, ...props }, ref) {
  return (
    <MuiRadioGroup
      ref={ref}
      sx={{ display: "grid", gap: 1, ...sx }}
      {...props}
    />
  );
});
RadioGroup.displayName = "RadioGroup";

/**
 * RadioGroupItem - cada opción. Uso con FormControlLabel:
 * <RadioGroup>
 *   <FormControlLabel value="a" control={<RadioGroupItem />} label="Opción A" />
 * </FormControlLabel>
 * </RadioGroup>
 */
const RadioGroupItem = React.forwardRef(function RadioGroupItem({ sx, ...props }, ref) {
  return (
    <MuiRadio
      ref={ref}
      size="small"
      sx={{
        color: "primary.main",
        "&.Mui-checked": { color: "primary.main" },
        "& .MuiSvgIcon-root": { fontSize: 20 },
        ...sx,
      }}
      {...props}
    />
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
