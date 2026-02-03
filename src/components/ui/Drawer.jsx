import * as React from "react";
import MuiDrawer from "@mui/material/Drawer";
import { Box } from "@mui/material";

const Drawer = ({ children, ...props }) => (
  <MuiDrawer {...props}>{children}</MuiDrawer>
);

const DrawerTrigger = ({ asChild, children, ...props }) => {
  if (asChild && React.isValidElement(children)) return React.cloneElement(children, props);
  return children;
};

const DrawerPortal = ({ children }) => children;

const DrawerClose = ({ asChild, children, ...props }) => {
  if (asChild && React.isValidElement(children)) return React.cloneElement(children, props);
  return children;
};

const DrawerOverlay = () => null;

const DrawerContent = React.forwardRef(function DrawerContent(
  { children, sx, ...props },
  ref
) {
  return (
    <Box
      ref={ref}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        mt: 3,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        maxHeight: "calc(100vh - 96px)",
        overflow: "auto",
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ mx: "auto", mt: 2, width: 100, height: 4, borderRadius: 2, bgcolor: "action.hover" }} />
      {children}
    </Box>
  );
});

const DrawerHeader = ({ children, sx, ...props }) => (
  <Box sx={{ p: 2, display: "grid", gap: 0.75, textAlign: { xs: "center", sm: "left" }, ...sx }} {...props}>
    {children}
  </Box>
);

const DrawerFooter = ({ children, sx, ...props }) => (
  <Box sx={{ mt: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1, ...sx }} {...props}>
    {children}
  </Box>
);

const DrawerTitle = React.forwardRef(function DrawerTitle(props, ref) {
  return (
    <Box
      ref={ref}
      component="h2"
      sx={{ fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.3, m: 0 }}
      {...props}
    />
  );
});

const DrawerDescription = React.forwardRef(function DrawerDescription(
  { children, ...props },
  ref
) {
  return (
    <Box ref={ref} sx={{ fontSize: "0.875rem", color: "text.secondary" }} {...props}>
      {children}
    </Box>
  );
});

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
