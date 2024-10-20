"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "@/interfaces/product.interface";
import { Loading } from "@/components/Loading";
import { useRouter } from "next/navigation";
import { getSupplierAndproducts } from "@/libs/getSupplier";
import { ISupplier } from "@/interfaces/supplier.interface";
import Image from "next/image";

interface ResponseBody {
  supplier: ISupplier;
  products: IProduct[];
}
export default function Supplier({ params }: { params: { id: string } }) {
  const route = useRouter();

  const supplierAndProductsQuery = useQuery<ResponseBody>({
    queryKey: ["supplier", params.id],
    queryFn: async () => await getSupplierAndproducts(params.id),
    refetchInterval: 1000 * 60 * 60 * 5,
  });

  if (supplierAndProductsQuery.isLoading) {
    return <Loading />;
  }
  console.log(supplierAndProductsQuery.data);

  return (
    <Suspense fallback={<Loading />}>
      <Header />
      <Container maxWidth={"lg"} className="mt-[110px] min-h-dvh">
        {supplierAndProductsQuery.data && (
          <>
            <Paper elevation={3} className="p-2">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Image
                    src={supplierAndProductsQuery.data.supplier.profileImage}
                    width={250}
                    height={250}
                    className="mx-auto"
                    alt={supplierAndProductsQuery.data.supplier.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h3">
                    {supplierAndProductsQuery.data.supplier.name}
                  </Typography>
                  <Typography variant="body1">
                    <b>Email:</b> {supplierAndProductsQuery.data.supplier.email}
                  </Typography>
                  <Typography variant="body1">
                    <b>Country:</b>{" "}
                    {supplierAndProductsQuery.data.supplier.country}
                  </Typography>
                  <Typography variant="body1">
                    <b>City:</b> {supplierAndProductsQuery.data.supplier.city}
                  </Typography>
                  <Typography variant="body1">
                    <b>Contact 1 :</b>{" "}
                    {
                      supplierAndProductsQuery.data.supplier.contacts_person_1
                        .con_person
                    }
                  </Typography>
                  <Typography variant="body1">
                    <b>Contact Email 1 :</b>{" "}
                    {
                      supplierAndProductsQuery.data.supplier.contacts_person_1
                        .email
                    }
                  </Typography>
                  <Typography variant="body1">
                    <b>Contact 2 :</b>{" "}
                    {supplierAndProductsQuery.data.supplier?.contacts_person_2
                      ? supplierAndProductsQuery.data.supplier?.contacts_person_2.con_person
                      : "-"}
                  </Typography>
                  <Typography variant="body1">
                    <b>Contact Email 2 :</b>{" "}
                    {supplierAndProductsQuery.data.supplier?.contacts_person_2
                      ? supplierAndProductsQuery.data.supplier?.contacts_person_2.email
                      : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="h4" className="w-full my-6">
              สินค้าที่เกี่ยวข้อง
            </Typography>

            <Grid container spacing={2}>
              {supplierAndProductsQuery.data?.products &&
                supplierAndProductsQuery.data.products.map((product) => {
                  return (
                    <Grid
                      key={product.product_id}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                    >
                      <Card
                        sx={{
                          maxWidth: 355,
                          margin: "0 auto",
                          height: 345,
                        }}
                        onClick={() => {
                          route.push("/products/" + product.product_id);
                        }}
                      >
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            image={product.product_image[0]}
                            alt={product.name}
                            className="rounded-lg h-52 object-contain"
                          />

                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Stock{" "}
                              {product.items?.reduce(
                                (previous, current) =>
                                  previous + parseFloat(current.qty_in_stock),
                                0
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ราคา{" "}
                              {product.items &&
                                product.items?.reduce(
                                  (previous, current) =>
                                    Math.min(
                                      previous,
                                      parseFloat(
                                        current?.selling_price as string
                                      )
                                    ),
                                  parseFloat(
                                    product.items[0].selling_price as string
                                  )
                                )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.supplier_id.name}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>
          </>
        )}
      </Container>
      <Footer />
    </Suspense>
  );
}
