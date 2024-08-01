"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Inbox as InboxIcon, Mail as MailIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import Link from "next/link";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface DrawerProps {
  open: boolean;
  toggleDrawer: () => void;
}
const Menus = [
  {
    name: "Overview",
    icon: <LeaderboardIcon />,
    path: "/admin/overview",
  },
  {
    name: "Manage Users",
    icon: <ManageAccountsIcon />,
    path: "/admin/users",
  },
  {
    name: "Manage Suppliers",
    icon: <AddBusinessOutlinedIcon />,
    path: "/admin/suppliers",
  },
  {
    name: "Manage Products",
    icon: <InventoryIcon />,
    path: "/admin/products",
  },
];

const AdminDrawer: React.FC<DrawerProps> = ({ open, toggleDrawer }) => {
  const theme = useTheme();

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {Menus.map((menu) => (
          <ListItem key={menu.name} component={Link} href="/admin/overview">
            <ListItemIcon>{menu.icon}</ListItemIcon>
            <ListItemText primary={menu.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminDrawer;
