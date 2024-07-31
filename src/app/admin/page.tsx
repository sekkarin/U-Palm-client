/* eslint-disable react/no-unescaped-entities */
"use client";

import Header from "@/components/Header";
import { Role } from "@/constants/enums/Role";
import useRole from "@/libs/hooks/useRole";
import { redirect } from "next/navigation";

export default function Admin() {
  const isAdmin = useRole(Role.ADMIN);
  console.log(isAdmin);
  if (!isAdmin) {
    redirect("/deny");
  }

  return (
    <>
      <Header />
      <h1>Admin</h1>
    </>
  );
}
