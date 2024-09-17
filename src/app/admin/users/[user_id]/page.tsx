"use client";
import React from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";
import Layout from "@/components/Admin/Layout";

export default function ViewUser({ params }: { params: { user_id: string } }) {
  return (
    <Layout>
      <Breadcrumbs aria-label="breadcrumb">
        <Link className="hover:underline" color="inherit" href="../users">
          User
        </Link>
        <Typography color="text.primary">Users {params.user_id}</Typography>
      </Breadcrumbs>
    </Layout>
  );
}
