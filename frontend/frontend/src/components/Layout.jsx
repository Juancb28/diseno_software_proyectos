import { Box } from "@mui/material";
import Navbar from "../components/NavBar.jsx";
import Sidebar from "../components/SideBar.jsx";

function Layout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;