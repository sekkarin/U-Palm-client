"use client";
import Loading from "@/app/loging";
import Header from "@/components/Header";
import { IProduct } from "@/interfaces/product.interface";
import { getProduct } from "@/libs/getProducts";
import { Container, Grid, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<IProduct>();
  const productQuery = useQuery<IProduct>({
    queryKey: ["products", params.id],
    queryFn: async () => getProduct(params.id),
    refetchInterval: 1000 * 60 * 60 * 5,
  });

  console.log(productQuery.data);
  useEffect(() => {
    if (!productQuery.isLoading) {
      setProduct(productQuery.data);
    }
  }, [productQuery.data, productQuery.isLoading]);
  if (!params.id) {
    return <h2>Error something</h2>;
  }
  if (productQuery.isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Header />
      {product && (
        <Container maxWidth={"lg"} className="mt-[105px]">
          <Grid container spacing={1}>
            <Grid item md={4} className="bg-slate-400 w-64 h-64">
              <p>Image</p>
            </Grid>
            <Grid item md={8} className="bg-slate-500 w-64 h-64">
              <p>{product?.name}</p>
              <p>
                {product &&
                  product.items.reduce(
                    (previous, current) =>
                      Math.min(
                        previous,
                        parseFloat(current?.selling_price as string)
                      ),
                    parseFloat(product.items[0].selling_price as string)
                  )}
              </p>
              <p>
                ซื้อขั้นตํ่า {product?.items.map((value) => value.qty_discount)}{" "}
                ชิ้น, ถูกลง {product?.items.map((value) => value.discount)}
              </p>
              <p>ค่าส่ง {product?.items.map((value) => value.shipping)}</p>
              <p>ตัวเลือกสินค้า</p>
              <p>
                {product.items.map((value) =>
                  value.variations.map((value) => {
                    return (
                      <Stack key={value.value} direction={"row"} spacing={1}>
                        <p>{value.name}</p>
                        <p>{value.value}</p>
                      </Stack>
                    );
                  })
                )}
              </p>
              <p>
                มีสินค้าทั้งหมด{" "}
                {product.items.reduce(
                  (prev, curr) => prev + parseInt(curr.qty_in_stock),
                  0
                )}{" "}
                ชิ้น
              </p>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </Grid>
          </Grid>
        </Container>
      )}
      <footer />
    </>
  );
}
