"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import { Box, Container, Grid, Stack, Typography, Button } from "@mui/material";
import { useAppDispatch } from "@/libs/hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { Loading } from "@/components/Loading";
import {
  Cart as ICart,
  CartProductItem,
  CartVariation,
} from "@/interfaces/cart.interface";
import Image from "next/image";
import { IProduct } from "@/interfaces/product.interface";
import { clearCart, initialCart } from "@/libs/features/cart/cartSlice";

interface AdjustBody {
  productItemId: string;
  qty: number;
  variationId: string;
}

export default function Cart() {
  const axiosAuth = useAxiosAuth();

  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const cartQuery = useQuery<ICart[]>({
    queryKey: ["get-cart"],
    queryFn: async () => (await axiosAuth.get(`/carts/get-items-cart`)).data,
  });
  const mutationAdjustCart = useMutation({
    mutationFn: async (body: AdjustBody) => {
      return await axiosAuth.post<ICart>("/carts/adjust", body);
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess(data) {
      const itemCart = data.data.items.flat();

      if (data.data.items.length < 1) {
        dispatch(clearCart());
      } else {
        dispatch(clearCart());
        itemCart.map((item) =>
          dispatch(
            initialCart({
              product_item_id: item.product_item_id,
              qty: item.qty,
              variation_id: item.variation_id,
              product_id: item.product_id,
              cart_item_id: item.cart_item_id,
            })
          )
        );
      }
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    },
  });
  const handleAdjust = (
    productItemID: string,
    variationId: string,
    qty: number
  ) => {
    mutationAdjustCart.mutate({
      productItemId: productItemID,
      qty: qty,
      variationId,
    });
  };

  if (cartQuery.isLoading) {
    return <Loading />;
  }

  const cart = cartQuery.data;
  // console.log(cart);

  return (
    <>
      <Header />
      <Container maxWidth={"lg"} sx={{ mt: "110px" }} className="min-h-screen">
        {/* Render Cart Items */}
        {cart &&
          cart.map((cart) =>
            cart.items.length > 0 ? (
              cart.items.map((item) => (
                <Box
                  key={item.cart_item_id}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                  }}
                >
                  <Grid container spacing={2}>
                    {/* Product Image and Details */}
                    <Grid item xs={12} md={6}>
                      <Stack direction={"row"} spacing={2}>
                        <Image
                          src={
                            (item.product_id as IProduct).image_banner_adverting
                          }
                          alt={(item.product_id as IProduct).name}
                          width={120}
                          height={120}
                        />
                        <Box>
                          <Typography variant="h6">
                            {(item.product_id as IProduct).name}
                          </Typography>
                          <Typography variant="subtitle1" color="textSecondary">
                            Supplier:{" "}
                            {(item.product_id as IProduct).supplier_name}
                          </Typography>
                          <Typography variant="body2">
                            Box: {item.qty} Pcs.
                          </Typography>
                          <Typography variant="body2">
                            Price:{" "}
                            {
                              (item.product_item_id as CartProductItem)
                                .selling_price
                            }{" "}
                            USD/pcs
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Quantity Control and Total Price */}
                    <Grid item xs={12} md={6}>
                      <Stack
                        direction={"row"}
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                      >
                        {/* Quantity Controls */}
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            handleAdjust(
                              (item.product_item_id as CartProductItem)
                                .product_item_id,
                              (item.variation_id as CartVariation).variation_id,
                              (item.qty -= 1)
                            );
                          }}
                        >
                          -
                        </Button>
                        <Typography variant="h6" sx={{ mx: 2 }}>
                          {item.qty}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            handleAdjust(
                              (item.product_item_id as CartProductItem)
                                .product_item_id,
                              (item.variation_id as CartVariation).variation_id,
                              (item.qty += 1)
                            );
                          }}
                        >
                          +
                        </Button>
                        {/* Total Price */}
                        <Box>
                          <Typography variant="body2">
                            Total{" "}
                            {item.qty *
                              (item.product_item_id as CartProductItem)
                                .selling_price}{" "}
                            บาท
                          </Typography>

                          <Typography variant="body1">
                            Discount Price:{" "}
                            {(item.qty >=
                            (item.product_item_id as CartProductItem)
                              .qty_discount
                              ? (item.product_item_id as CartProductItem)
                                  .discount
                              : 0
                            ).toFixed(2)}{" "}
                            บาท
                          </Typography>
                          <Typography variant="h6">
                            Total Price:{" "}
                            {(item.qty >=
                            (item.product_item_id as CartProductItem)
                              .qty_discount
                              ? (item.product_item_id as CartProductItem)
                                  .discount * item.qty
                              : item.qty *
                                (item.product_item_id as CartProductItem)
                                  .selling_price
                            ).toFixed(2)}{" "}
                            บาท
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              ))
            ) : (
              <p key={cart._id}>Empty Item</p>
            )
          )}
      </Container>
      <Footer />
    </>
  );
}
