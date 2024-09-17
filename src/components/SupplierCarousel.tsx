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
import Link from "next/link";
import { ISupplier } from "@/interfaces/supplier.interface";

interface SupplierCarouselProps {
  data: ISupplier[];
}

const SupplierCarousel: React.FC<SupplierCarouselProps> = ({ data }) => {
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
            <Link href={`#`} key={i}>
              <Card
                key={i}
                sx={{ maxWidth: 450, margin: "0 auto", width: 250 }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.profileImage}
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
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Box>
      ))}
    </Carousel>
  );
};

export default SupplierCarousel;
