import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { Link } from "react-router-dom";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Ausencias", icon: <EventIcon />, path: "/ausencias" },
  { text: "Personal", icon: <PeopleIcon />, path: "/personal" },
  { text: "Proyectos", icon: <WorkIcon />, path: "/proyectos" },
  { text: "Asistencia", icon: <AssignmentIndIcon />, path: "/asistencia" },
  { text: "Usuarios", icon: <PeopleIcon />, path: "/usuarios" },
];

function Sidebar() {
  return (
    <Drawer variant="permanent" sx={{ width: 240 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem button component={Link} to={item.path} key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;