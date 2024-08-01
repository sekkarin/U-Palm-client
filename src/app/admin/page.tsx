"use client";
import React, { useState } from "react";
import { Box, CssBaseline, Grid, Toolbar, Typography } from "@mui/material";
import AdminAppBar from "@/components/Admin/Header";
import AdminDrawer from "@/components/Admin/Drawer";
import AdminContent from "@/components/Admin/Content";
import useRole from "@/libs/hooks/useRole";
import { Role } from "@/constants/enums/Role";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";

export default function Admin() {
  const [open, setOpen] = useState(true);
  const isAdmin = useRole(Role.ADMIN);
  const router = useRouter();
  const { loading } = useAuth();

  if (loading) {
    return <Loading />; // Show a loading state while checking the role
  }
  if (!isAdmin) {
    router.push("/deny");
  }
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminAppBar open={open} toggleDrawer={toggleDrawer} />
      <AdminDrawer open={open} toggleDrawer={toggleDrawer} />
      <AdminContent>
        <Typography variant="h1">Overview</Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <h1>xs=8</h1>
          </Grid>
          <Grid item xs={4}>
            <h1>xs=4</h1>
          </Grid>
          <Grid item xs={4}>
            <h1>xs=4</h1>
          </Grid>
          <Grid item xs={8}>
            <h1>xs=8</h1>
          </Grid>
        </Grid>
      </AdminContent>
    </Box>
  );
}
