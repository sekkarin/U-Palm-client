"use client"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import { Box, Container } from "@mui/material";
import { useAppSelector } from "@/libs/hook";

export default function Cart() {

  const cartItem = useAppSelector((state) => state.cart);

  return (
    <>
      <Header />
      <Container maxWidth={"lg"} className="mt-[110px]">
        {cartItem.items.map((item) => {
          return (
            <Box key={item.product_item_id}>
              <h2>{item.product_item_id}</h2>
            </Box>
          );
        })}
      </Container>

      <Footer />
    </>
  );
}
