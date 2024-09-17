"use client";
import React from "react";
import Layout from "@/components/Admin/Layout";
import { Loading } from "@/components/Loading";
import {
  Box,
  Breadcrumbs,
  Typography,
  Divider,
  Button,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { IProduct } from "@/interfaces/product.interface";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const axiosAuth = useAxiosAuth();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<IProduct>({
    queryKey: ["get-product", params.id],
    queryFn: async () => (await axiosAuth.get(`/products/${params.id}`)).data,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Layout>
        <Typography variant="h6" color="error">
          Failed to load product details.
        </Typography>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/admin/products" passHref>
          <Typography
            color="inherit"
            component="a"
            sx={{ textDecoration: "underline" }}
          >
            Products
          </Typography>
        </Link>
        <Typography color="text.primary">Product Details</Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Banner Image */}
          <Grid item xs={12} sm={6}>
            <Box>
              <Image
                src={product.image_banner_adverting}
                alt="Banner"
                width={600}
                height={400}
                layout="responsive"
                style={{ borderRadius: 8 }}
              />
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} sm={6}>
            <Stack spacing={2}>
              <Typography variant="h4" component="h1">
                {product.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </Typography>
              <Divider />
              <Typography variant="subtitle1">
                <strong>Category:</strong> {product.category_id.category_name}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Supplier:</strong> {product.supplier_id.name}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Product ID:</strong> {product.product_id}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Product Images */}
        <Typography variant="h6" gutterBottom>
          Product Images
        </Typography>
        <Grid container spacing={2}>
          {product.product_image.map((image, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                width={300}
                height={300}
                layout="responsive"
                style={{ borderRadius: 8 }}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Supplier Details */}
        <Typography variant="h6" gutterBottom>
          Supplier Details
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Name:</strong> {product.supplier_id.name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {product.supplier_id.email}
              </Typography>
              <Typography variant="body1">
                <strong>Country:</strong> {product.supplier_id.country}
              </Typography>
              <Typography variant="body1">
                <strong>City:</strong> {product.supplier_id.city}
              </Typography>
              <Typography variant="body1">
                <strong>State:</strong> {product.supplier_id.state}
              </Typography>
              <Typography variant="body1">
                <strong>ZIP Code:</strong> {product.supplier_id.zip}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {product.supplier_id.address}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Image
              src={product.supplier_id.profileImage}
              alt="Supplier Profile"
              width={300}
              height={300}
              layout="responsive"
              style={{ borderRadius: 8 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Supplier Contact Person Details */}
        <Typography variant="h6" gutterBottom>
          Supplier Contact Person
        </Typography>
        {/* <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Contact Person:</strong>{" "}
                {product.supplier_id.contacts_person_1.con_person}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong>{" "}
                {product.supplier_id.contacts_person_1.email}
              </Typography>
              <Typography variant="body1">
                <strong>Telephone:</strong>{" "}
                {product.supplier_id.contacts_person_1.telephone}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong>{" "}
                {product.supplier_id.contacts_person_1.address}
              </Typography>
              <Typography variant="body1">
                <strong>Remark:</strong>{" "}
                {product.supplier_id.contacts_person_1.con_remark}
              </Typography>
            </Stack>
          </Grid>
        </Grid> */}
      </Paper>
    </Layout>
  );
}
