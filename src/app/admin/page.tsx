"use client";
import React, { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import AdminAppBar from "@/components/Admin/Header";
import AdminDrawer from "@/components/Admin/Drawer";
import AdminContent from "@/components/Admin/Content";

export default function Admin() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminAppBar open={open} toggleDrawer={toggleDrawer} />
      <AdminDrawer open={open} toggleDrawer={toggleDrawer} />
      <AdminContent>
        <h1>Hello word</h1>
      </AdminContent>
    </Box>
  );
}
