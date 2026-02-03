import * as React from "react";
import MuiDialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";

const Dialog = MuiDialog;

const DialogTrigger = ({ asChild, children, ...props }) => {
  if (asChild && React.isValidElement(children)) return React.cloneElement(children, props);
  return children;
};

const DialogPortal = ({ children }) => children;

const DialogClose = ({ asChild, children, ...props }) => {
  if (asChild && React.isValidElement(children)) return React.cloneElement(children, props);
  return children;
};

const DialogOverlay = () => null;

const DialogContent = React.forwardRef(function DialogContent(
  { children, sx, onClose, ...props },
  ref
) {
  return (
    <MuiDialogContent
      ref={ref}
      sx={{
        pt: 3,
        ...sx,
      }}
      {...props}
    >
      {children}
      {onClose && (
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </MuiDialogContent>
  );
});

const DialogHeader = ({ children, sx, ...props }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 0.75,
      textAlign: { xs: "center", sm: "left" },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

const DialogFooter = ({ children, sx, ...props }) => (
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

const DialogTitle = React.forwardRef(function DialogTitle(props, ref) {
  return (
    <MuiDialogTitle
      ref={ref}
      sx={{ fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.3 }}
      {...props}
    />
  );
});

const DialogDescription = React.forwardRef(function DialogDescription(
  { children, ...props },
  ref
) {
  return (
    <Box ref={ref} component="p" sx={{ fontSize: "0.875rem", color: "text.secondary", m: 0 }} {...props}>
      {children}
    </Box>
  );
});

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
