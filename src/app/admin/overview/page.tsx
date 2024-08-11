"use client";
import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Grid, Toolbar, Typography } from "@mui/material";
import AdminAppBar from "@/components/Admin/Header";
import AdminDrawer from "@/components/Admin/Drawer";
import AdminContent from "@/components/Admin/Content";
import useRole from "@/libs/hooks/useRole";
import { Role } from "@/constants/enums/Role";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import api from "@/services/api";
import Layout from "@/components/Admin/Layout";

export default function Overview() {
  return (
    <Layout>
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
    </Layout>
  );
}
