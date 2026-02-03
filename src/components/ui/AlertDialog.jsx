import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * AlertDialog - raíz. Controlar con open + onOpenChange.
 * Uso: <AlertDialog open={open} onOpenChange={setOpen}><AlertDialogContent>...</AlertDialogContent></AlertDialog>
 */
const AlertDialog = ({ open, onOpenChange, children, ...props }) => (
  <Dialog
    open={!!open}
    onClose={() => onOpenChange?.(false)}
    maxWidth="sm"
    fullWidth
    PaperProps={{ sx: { borderRadius: 2 } }}
    {...props}
  >
    {children}
  </Dialog>
);

const AlertDialogTrigger = ({ asChild, children, ...props }) => {
  if (asChild) return React.cloneElement(React.Children.only(children), props);
  return <Button {...props}>{children}</Button>;
};

const AlertDialogPortal = ({ children }) => children;

const AlertDialogOverlay = () => null;

const AlertDialogContent = React.forwardRef(function AlertDialogContent(
  { children, sx, ...props },
  ref
) {
  return (
    <DialogContent ref={ref} sx={{ pt: 3, pb: 2, ...sx }} {...props}>
      {children}
    </DialogContent>
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({ children, sx, ...props }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, textAlign: { xs: "center", sm: "left" }, ...sx }} {...props}>
    {children}
  </Box>
);

const AlertDialogFooter = ({ children, sx, ...props }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column-reverse", sm: "row" },
      justifyContent: "flex-end",
      gap: 1,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

const AlertDialogTitle = React.forwardRef(function AlertDialogTitle(props, ref) {
  return <DialogTitle ref={ref} sx={{ fontSize: "1.125rem", fontWeight: 600 }} {...props} />;
});

const AlertDialogDescription = React.forwardRef(function AlertDialogDescription(
  { children, ...props },
  ref
) {
  return (
    <DialogContentText ref={ref} sx={{ color: "text.secondary", fontSize: "0.875rem" }} {...props}>
      {children}
    </DialogContentText>
  );
});

const AlertDialogAction = React.forwardRef(function AlertDialogAction(props, ref) {
  return <Button ref={ref} variant="contained" color="primary" {...props} />;
});

const AlertDialogCancel = React.forwardRef(function AlertDialogCancel(props, ref) {
  return <Button ref={ref} variant="outlined" color="inherit" {...props} />;
});

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
