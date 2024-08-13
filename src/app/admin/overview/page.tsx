"use client"
import React from "react";
import { Grid, Typography } from "@mui/material";
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
