import React from "react";
import { Box, Skeleton, Card, CardContent } from "@mui/material";

const ProductSkeleton: React.FC = () => {
  return (
    <Card sx={{ maxWidth: 345, margin: "0 auto", width: 250 }}>
      <Skeleton variant="rectangular" height={140} />
      <CardContent>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </CardContent>
    </Card>
  );
};

const ProductCarouselSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
      {Array.from(new Array(4)).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </Box>
  );
};

export default ProductCarouselSkeleton;
