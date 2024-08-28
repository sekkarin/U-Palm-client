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
} from "@mui/material";
import { IProduct } from "@/interfaces/product.interface";
import Link from "next/link";

interface ProductCarouselProps {
  data: IProduct[];
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
          {chunk.map((item, i) => {
            const replaceEmpty = item.name.replace(" ", "-");

            return (
              <Link href={`./products/${replaceEmpty}`} key={i}>
                <Card
                  key={i}
                  sx={{
                    maxWidth: 450,
                    margin: "0 auto",
                    width: 250,
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.product_image[0]}
                      alt={item.name}
                      className="rounded-lg"
                    />

                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        className="truncate"
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock{" "}
                        {item.items?.reduce(
                          (previous, current) =>
                            previous + parseFloat(current.qty_in_stock),
                          0
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ราคา{" "}
                        {item.items &&
                          item.items?.reduce(
                            (previous, current) =>
                              Math.min(
                                previous,
                                parseFloat(current?.selling_price as string)
                              ),
                            parseFloat(item.items[0].selling_price as string)
                          )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.supplier_id.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            );
          })}
        </Box>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
