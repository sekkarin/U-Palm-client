"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductResponse } from "@/interfaces/product.interface";
import { getProducts } from "@/libs/getProducts";
import { Loading } from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function Search({ params }: { params: { query: string } }) {
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const paramQuery = decodeURI(params.query);
  const productQuery = useQuery<ProductResponse>({
    queryKey: ["products", page],
    queryFn: async () => await getProducts(page, paramQuery),
    refetchInterval: 1000 * 60 * 60 * 5,
  });
  const route = useRouter();
  if (productQuery.isLoading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Header />
      <Container maxWidth={"lg"} className="mt-[110px] min-h-dvh">
        <Typography variant="h5">ค้นหาสินค้า {paramQuery}</Typography>
        <Divider className="my-2" />
        {productQuery.data?.data && productQuery.data?.data.length < 1 && (
          <Typography variant="h2" className="text-center">
            ไม่มีผลลัพธ์
          </Typography>
        )}
        <Grid container spacing={2}>
          {productQuery.data?.data &&
            productQuery.data?.data.length > 0 &&
            productQuery.data.data.map((product) => {
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
                        <Typography gutterBottom variant="h5" component="div">
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
                                  parseFloat(current?.selling_price as string)
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
        {productQuery.data?.data && productQuery.data?.data.length > 0 && (
          <Stack
            spacing={1}
            direction={"row"}
            useFlexGap
            sx={{
              justifyContent: "center",
              alignItems: "center",
              my: 2,
            }}
          >
            {/* <Typography>Page: {page}</Typography> */}
            <Pagination
              count={productQuery.data?.metadata.pageCount}
              page={productQuery.data?.metadata.page}
              // boundaryCount={1}
              onChange={handleChange}
              hideNextButton={!productQuery.data?.metadata.hasNextPage}
              hidePrevButton={!productQuery.data?.metadata.hasPreviousPage}
            />
          </Stack>
        )}
      </Container>
      <Footer />
    </Suspense>
  );
}
