// components/ProductCarousel.tsx

import React from "react";
import Carousel from "react-material-ui-carousel";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";

interface Product {
  product_image: string;
  name: string;
  description: string;
}

interface ProductCarouselProps {
  data: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ data }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const itemsPerSlide = isLargeScreen ? 4 : isMediumScreen ? 3 : 1;

  // Divide data into chunks based on the current screen size
  const chunkedData = [];
  for (let i = 0; i < data.length; i += itemsPerSlide) {
    chunkedData.push(data.slice(i, i + itemsPerSlide));
  }

  return (
    <Carousel duration={10} navButtonsAlwaysVisible>
      {chunkedData.map((chunk, index) => (
        <Box
          key={index}
          sx={{ display: "flex", justifyContent: "center", gap: 2 }}
        >
          {chunk.map((item, i) => (
            <Card key={i} sx={{ maxWidth: 345, margin: "0 auto", width: 250 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.product_image}
                  alt={item.name}
                />
                <Divider />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
