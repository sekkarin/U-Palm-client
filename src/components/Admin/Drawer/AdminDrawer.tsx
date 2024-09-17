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
import { useTheme } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse, ListItemButton } from "@mui/material";

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
    isCollapse: false,
  },
  {
    name: "Manage Users",
    icon: <ManageAccountsIcon />,
    path: "/admin/users",
    isCollapse: false,
  },
  {
    name: "Manage Suppliers",
    icon: <AddBusinessOutlinedIcon />,
    path: "/admin/suppliers",
    isCollapse: false,
  },
  {
    name: "products",
    icon: "",
    path: "",
    isCollapse: true,
    component: ({
      handleClick,
      pathname,
      openCollapseProduct,
    }: {
      handleClick: () => void;
      pathname: string;
      openCollapseProduct: boolean;
    }) => {
      return (
        <>
          <ListItemButton
            onClick={handleClick}
            className={`hover:bg-primary-200 hover:rounded-sm hover:text-white ${
              pathname.split("/")[2].includes("products")
                ? "bg-primary-500 rounded-sm text-white"
                : ""
            }`}
          >
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Products" />
            {openCollapseProduct ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCollapseProduct} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link href={"/admin/products"}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <NextWeekIcon />
                  </ListItemIcon>
                  <ListItemText primary="Products" />
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
        </>
      );
    },
  },
  {
    name: "Manage Categories",
    icon: <CategoryIcon />,
    path: "/admin/categories",
    isCollapse: false,
  },
];

const AdminDrawer: React.FC<DrawerProps> = ({ open, toggleDrawer }) => {
  const [openCollapseProduct, setOpenCollapseProduct] = React.useState(true);

  const handleClick = () => {
    setOpenCollapseProduct(!openCollapseProduct);
  };
  const theme = useTheme();
  const pathname = usePathname();
  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: [1],
        }}
      >
        <h1 className="ml-1">Logo</h1>
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
          <>
            {!menu.isCollapse && (
              <ListItem
                key={menu.name}
                component={Link}
                href={menu.path}
                className={`hover:bg-primary-200 hover:rounded-sm hover:text-white ${
                  pathname.split("/")[2].includes(menu.path.split("/")[2])
                    ? "bg-primary-500 rounded-sm text-white"
                    : ""
                }`}
              >
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.name} />
              </ListItem>
            )}

            {menu.isCollapse &&
              menu.component &&
              menu?.component({
                handleClick,
                pathname,
                openCollapseProduct,
              })}
          </>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminDrawer;
