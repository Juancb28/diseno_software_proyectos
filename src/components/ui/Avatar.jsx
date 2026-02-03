import * as React from "react";
import MuiAvatar from "@mui/material/Avatar";

/**
 * Avatar - contenedor redondo. Uso: <Avatar><AvatarImage src="..." /></Avatar> o <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
 */
const Avatar = React.forwardRef(function Avatar({ sx, ...props }, ref) {
  return (
    <MuiAvatar
      ref={ref}
      sx={{
        width: 40,
        height: 40,
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: "50%",
        ...sx,
      }}
      {...props}
    />
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(function AvatarImage({ src, alt, ...props }, ref) {
  return <MuiAvatar ref={ref} src={src} alt={alt} sx={{ width: "100%", height: "100%" }} {...props} />;
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(function AvatarFallback({ children, sx, ...props }, ref) {
  return (
    <MuiAvatar
      ref={ref}
      sx={{
        bgcolor: "action.hover",
        color: "text.secondary",
        fontSize: "0.875rem",
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiAvatar>
  );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
