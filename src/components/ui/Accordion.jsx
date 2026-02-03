import * as React from "react";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";

/**
 * Accordion - raíz. Puede contener varios AccordionItem.
 */
const Accordion = React.forwardRef(function Accordion({ children, sx, ...props }, ref) {
  return (
    <Box ref={ref} sx={sx} {...props}>
      {children}
    </Box>
  );
});
Accordion.displayName = "Accordion";

/**
 * AccordionItem - cada ítem (un MUI Accordion) con borde inferior.
 */
const AccordionItem = React.forwardRef(function AccordionItem({ className, sx, ...props }, ref) {
  return (
    <MuiAccordion
      ref={ref}
      disableGutters
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:before": { display: "none" },
        ...sx,
      }}
      {...props}
    />
  );
});
AccordionItem.displayName = "AccordionItem";

/**
 * AccordionTrigger - cabecera expandible (con chevron).
 */
const AccordionTrigger = React.forwardRef(function AccordionTrigger({ children, className, sx, ...props }, ref) {
  return (
    <MuiAccordionSummary
      ref={ref}
      expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
      sx={{
        py: 2,
        fontWeight: 500,
        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": { transform: "rotate(180deg)" },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiAccordionSummary>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

/**
 * AccordionContent - contenido expandible.
 */
const AccordionContent = React.forwardRef(function AccordionContent({ children, className, sx, ...props }, ref) {
  return (
    <MuiAccordionDetails ref={ref} sx={{ pt: 0, pb: 2, ...sx }} {...props}>
      {children}
    </MuiAccordionDetails>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
