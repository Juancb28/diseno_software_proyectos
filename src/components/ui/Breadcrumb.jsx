import * as React from "react";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

/**
 * Breadcrumb - nav con aria-label="breadcrumb"
 */
const Breadcrumb = React.forwardRef(function Breadcrumb({ separator, sx, ...props }, ref) {
  return (
    <MuiBreadcrumbs
      ref={ref}
      aria-label="breadcrumb"
      separator={separator ?? <NavigateNextIcon fontSize="small" sx={{ color: "text.secondary" }} />}
      sx={{ color: "text.secondary", fontSize: "0.875rem", ...sx }}
      {...props}
    />
  );
});
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef(function BreadcrumbList({ children, sx, ...props }, ref) {
  return (
    <MuiBreadcrumbs ref={ref} sx={{ ...sx }} {...props}>
      {children}
    </MuiBreadcrumbs>
  );
});
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef(function BreadcrumbItem({ children, sx, ...props }, ref) {
  return (
    <span ref={ref} style={{ display: "inline-flex", alignItems: "center" }} {...props}>
      {children}
    </span>
  );
});
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef(function BreadcrumbLink(
  { asChild, href, children, sx, ...props },
  ref
) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ref, ...props });
  }
  return (
    <Link
      ref={ref}
      href={href}
      underline="hover"
      color="inherit"
      sx={{ "&:hover": { color: "text.primary" }, ...sx }}
      {...props}
    >
      {children}
    </Link>
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef(function BreadcrumbPage({ children, sx, ...props }, ref) {
  return (
    <Typography ref={ref} component="span" fontWeight={500} color="text.primary" {...props}>
      {children}
    </Typography>
  );
});
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, ...props }) => (
  <NavigateNextIcon fontSize="small" sx={{ color: "text.secondary", mx: 0.5 }} {...props} />
);

const BreadcrumbEllipsis = (props) => (
  <MoreHorizIcon fontSize="small" sx={{ color: "text.secondary", mx: 0.5 }} aria-hidden {...props} />
);

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
