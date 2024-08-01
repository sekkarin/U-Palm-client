import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Person,
  People,
  Inventory,
  ShoppingCart,
  Dashboard,
} from "@mui/icons-material";
import Link from "next/link";

const Sidebar: React.FC = () => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem button component={Link} href="/admin/overview">
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItem>
        <ListItem button component={Link} href="/admin/users">
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Manage Users" />
        </ListItem>
        <ListItem button component={Link} href="/admin/suppliers">
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Manage Suppliers" />
        </ListItem>
        <ListItem button component={Link} href="/admin/products">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="Manage Products" />
        </ListItem>
        <ListItem button component={Link} href="/admin/orders">
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Manage Orders" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
