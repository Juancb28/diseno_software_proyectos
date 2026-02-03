import * as React from "react";
import MuiCard from "@mui/material/Card";
import MuiCardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const Card = React.forwardRef(function Card({ sx, ...props }, ref) {
  return (
    <MuiCard
      ref={ref}
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "none",
        ...sx,
      }}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(function CardHeader({ sx, ...props }, ref) {
  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        p: 3,
        ...sx,
      }}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(function CardTitle(props, ref) {
  return (
    <Typography
      ref={ref}
      component="h3"
      variant="h6"
      sx={{ fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em" }}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(function CardDescription(props, ref) {
  return (
    <Typography ref={ref} variant="body2" color="text.secondary" {...props} />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(function CardContent({ sx, ...props }, ref) {
  return (
    <MuiCardContent ref={ref} sx={{ p: 3, pt: 0, "&:last-child": { pb: 3 }, ...sx }} {...props} />
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(function CardFooter({ sx, ...props }, ref) {
  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 3,
        pt: 0,
        ...sx,
      }}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
