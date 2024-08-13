"use client";
import React from "react";
import Layout from "@/components/Admin/Layout";
import { Loading } from "@/components/Loading";
import { Supplier } from "@/interfaces/supplier.interface";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { Box, Breadcrumbs, Typography, Divider, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

export default function DetailSupplier({ params }: { params: { id: string } }) {
  const axiosAuth = useAxiosAuth();

  const {
    data: supplier,
    isLoading,
    isError,
  } = useQuery<Supplier>({
    queryKey: ["get-supplier", params.id],
    queryFn: async () => (await axiosAuth.get(`/suppliers/${params.id}`)).data,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Layout>
        <Typography variant="h6" color="error">
          Failed to load supplier details.
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/admin/suppliers" className="underline">
          Suppliers
        </Link>
        <Typography color="text.primary">Supplier Details</Typography>
      </Breadcrumbs>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          {supplier?.name}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">General Information</Typography>
        <Box mt={2}>
          <Typography>
            <strong>Email:</strong> {supplier?.email}
          </Typography>
          <Typography>
            <strong>Telephone:</strong> {supplier?.contacts_person_1.telephone}
          </Typography>
          <Typography>
            <strong>State:</strong> {supplier?.state}
          </Typography>
          <Typography>
            <strong>Country:</strong> {supplier?.country}
          </Typography>
          <Typography>
            <strong>City:</strong> {supplier?.city}
          </Typography>
          <Typography>
            <strong>ZIP:</strong> {supplier?.zip}
          </Typography>
          <Typography>
            <strong>Address:</strong> {supplier?.address}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Contact Person 1</Typography>
        <Box mt={2}>
          <Typography>
            <strong>Name:</strong> {supplier?.contacts_person_1.con_person}
          </Typography>
          <Typography>
            <strong>Email:</strong> {supplier?.contacts_person_1.email}
          </Typography>
          <Typography>
            <strong>Telephone:</strong> {supplier?.contacts_person_1.telephone}
          </Typography>
          <Typography>
            <strong>Address:</strong> {supplier?.contacts_person_1.address}
          </Typography>
          <Typography>
            <strong>Remark:</strong> {supplier?.contacts_person_1.con_remark}
          </Typography>
        </Box>

        {supplier?.contacts_person_2 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Contact Person 2</Typography>
            <Box mt={2}>
              <Typography>
                <strong>Name:</strong> {supplier.contacts_person_2.con_person}
              </Typography>
              <Typography>
                <strong>Email:</strong> {supplier.contacts_person_2.email}
              </Typography>
              <Typography>
                <strong>Telephone:</strong>{" "}
                {supplier.contacts_person_2.telephone}
              </Typography>
              <Typography>
                <strong>Address:</strong> {supplier.contacts_person_2.address}
              </Typography>
              <Typography>
                <strong>Remark:</strong> {supplier.contacts_person_2.con_remark}
              </Typography>
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Profile Image</Typography>
        {supplier?.profileImage && (
          <Box mt={2}>
            <Image
              src={supplier.profileImage}
              alt={`${supplier.name} profile`}
              width={200}
              height={200}
            />
          </Box>
        )}
      </Box>
      {/* Products list */}
      <Divider />
      <Box sx={{ mt: 2 }} display={"flex"} flexDirection={"column"}>
        <Box flexDirection={"row"} display={"flex"} component={'div'} sx={{
          justifyContent:"space-between"
        }} width={"100%"}>

        <Typography variant="h4" gutterBottom>
          Products
        </Typography>
        <Button variant="contained" >เพิ่ม Product</Button>
        </Box>
        <Box>
          Product....
        </Box>
      </Box>
    </Layout>
  );
}
