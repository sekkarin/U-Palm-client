"use client";
import React, { useEffect, useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import AdminAppBar from "@/components/Admin/Header";
import AdminDrawer from "@/components/Admin/Drawer";
import AdminContent from "@/components/Admin/Content";
import useRole from "@/libs/hooks/useRole";
import { Role } from "@/constants/enums/Role";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const isAdmin = useRole(Role.ADMIN);

  const router = useRouter();
  const { loading } = useAuth();
  const toggleDrawer = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push("/deny");
    }
  }, []);
  if (loading) {
    return <Loading />; // Show a loading state while checking the role
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminAppBar open={open} toggleDrawer={toggleDrawer} />
      <AdminDrawer open={open} toggleDrawer={toggleDrawer} />
      <AdminContent>{children}</AdminContent>
    </Box>
  );
}
