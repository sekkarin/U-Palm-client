"use client";
import Loading from "@/app/loging";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IProduct } from "@/interfaces/product.interface";
import { getProduct } from "@/libs/getProducts";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  IconButton,
  ImageListItem,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import DOMPurify from "dompurify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useAppDispatch } from "@/libs/hook";
import { addCart } from "@/libs/features/cart/cartSclice";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [open, setOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [quantity, setQuantity] = useState<number | null>(1);
  const [previousQuantity, setPreviousQuantity] = useState<number>(1); // เก็บค่าก่อนหน้า
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<{
    variation_id: string;
    value: string;
    item_id: string;
  } | null>(null);

  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (!selectedOption?.item_id || !selectedOption.variation_id || !quantity) {
      return;
    }
    console.log(selectedOption?.item_id,selectedOption.variation_id,quantity,params.id);
    
    dispatch(
      addCart({
        product_item_id: selectedOption?.item_id,
        qty: quantity,
        productItems: [
          {
            item: selectedOption?.item_id,
            variant_id: selectedOption?.variation_id,
          },
        ],
      })
    );
    setQuantity(1);
    setPreviousQuantity(1);
    setSelectedOption(null);
  };

  const [product, setProduct] = useState<IProduct>();
  const productQuery = useQuery<IProduct>({
    queryKey: ["products", params.id],
    queryFn: async () => getProduct(params.id),
    refetchInterval: 1000 * 60 * 60 * 5,
  });

  const handleOpen = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleCloseCart = () => {
    setOpenCart(false);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };
  const increaseQuantity = () => setQuantity((prev) => (prev ? prev + 1 : 0));
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev ?? 0 > 1 ? prev ?? 0 - 1 : 1));
  const handleOptionSelect = (
    id: string | undefined,
    item_id: string,
    value: string
  ) => {
    if (id) {
      setSelectedOption({
        variation_id: id,
        value: value,
        item_id,
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
      setPreviousQuantity(value); // อัปเดตค่าก่อนหน้าทุกครั้งที่มีการเปลี่ยนแปลง
    } else if (e.target.value === "") {
      setQuantity(null); // กำหนดค่าเป็น null ถ้าฟิลด์ว่างเปล่า
    }
  };
  const handleBlur = () => {
    if (quantity === null) {
      setQuantity(previousQuantity);
    }
  };
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
  console.log(product);

  return (
    <>
      <Header />

      <Container maxWidth={"lg"} className="mt-[110px]">
        <Breadcrumbs aria-label="breadcrumb" className="my-4">
          <Link color="inherit" href="/">
            หน้าแรก
          </Link>
          <Link color="inherit" href="#">
            {product?.category_id.category_name}
          </Link>
          <Typography sx={{ color: "text.primary" }}>
            {product?.name}
          </Typography>
        </Breadcrumbs>
        {product && (
          <Grid container spacing={1}>
            <Grid item sm={12} md={12} lg={12}>
              <Image
                src={product.image_banner_adverting}
                width={970}
                height={250}
                alt={"image_banner_adverting" + product.name}
                className="rounded-sm object-cover w-full h-[250px] mx-auto" // Responsive utility classes
              />
            </Grid>
            <Grid item sm={12} md={12} lg={12}>
              {/* detail product */}
              <Paper elevation={4} className="p-2 rounded-md">
                <Grid container spacing={2}>
                  <Grid item sm={12} md={7} className="w-[300] h-full">
                    <Carousel navButtonsAlwaysVisible={true}>
                      {product.product_image.map((image, i) => (
                        <ImageListItem
                          key={i}
                          onClick={() => handleOpen(image)}
                        >
                          <Image
                            src={image}
                            width={250}
                            height={250}
                            alt={product.name}
                            className="mx-auto cursor-pointer"
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </Carousel>
                  </Grid>
                  <Grid item sm={12} md={5} className="w-64 h-full">
                    <Typography variant="h5">{product?.name}</Typography>
                    <Typography variant="body2">
                      ราคา{" "}
                      {product &&
                        product.items.reduce(
                          (previous, current) =>
                            Math.min(
                              previous,
                              parseFloat(current?.selling_price as string)
                            ),
                          parseFloat(product.items[0].selling_price as string)
                        )}{" "}
                      -{" "}
                      {product &&
                        product.items.reduce(
                          (previous, current) =>
                            Math.max(
                              previous,
                              parseFloat(current?.selling_price as string)
                            ),
                          parseFloat(product.items[0].selling_price as string)
                        )}
                    </Typography>
                    <Typography variant="body1">
                      ซื้อขั้นตํ่า{" "}
                      {product?.items.map((value) => value.qty_discount)} ชิ้น,
                      ถูกลง{" "}
                      <b>{product?.items.map((value) => value.discount)}</b>
                    </Typography>
                    <Typography variant="body1">
                      ค่าส่ง{" "}
                      {product &&
                        product.items.reduce(
                          (previous, current) =>
                            Math.min(
                              previous,
                              parseFloat(current?.shipping as string)
                            ),
                          parseFloat(product.items[0].shipping as string)
                        )}{" "}
                      -{" "}
                      {product &&
                        product.items.reduce(
                          (previous, current) =>
                            Math.max(
                              previous,
                              parseFloat(current?.shipping as string)
                            ),
                          parseFloat(product.items[0].shipping as string)
                        )}
                    </Typography>
                    <Typography variant="body1">
                      มีสินค้าทั้งหมด{" "}
                      {product.items.reduce(
                        (prev, curr) => prev + parseInt(curr.qty_in_stock),
                        0
                      )}{" "}
                      ชิ้น
                    </Typography>

                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <Typography variant="body2">ผู้จำหน่าย</Typography>
                      <Image
                        src={product.supplier_id.profileImage}
                        width={50}
                        height={50}
                        alt={product.supplier_id.name}
                        onClick={() =>
                          handleOpen(product.supplier_id.profileImage)
                        }
                        className="cursor-pointer"
                      />
                      <Link
                        href={"#"}
                        className="hover:text-blue-500 hover:underline"
                      >
                        {product.supplier_id.name}
                      </Link>
                    </Stack>
                    <Typography variant="body1">ตัวเลือกสินค้า</Typography>
                    <Stack direction={"row"} spacing={1}>
                      {product.items.map((item) =>
                        item.variations.map((variation, i) => (
                          <Button
                            key={i}
                            variant={
                              selectedOption?.value === variation.value
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() =>
                              handleOptionSelect(
                                variation?.variation_id,
                                item.product_item_id,
                                variation.value
                              )
                            }
                          >
                            {variation.name} - {variation.value}
                          </Button>
                        ))
                      )}
                    </Stack>
                    <Box
                      sx={{
                        // border: "1px solid black",
                        padding: 2,
                        display: "inline-block",

                        // backgroundColor: "#F0F0F0",
                      }}
                    >
                      <Box
                        sx={{
                          marginTop: 2,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          size="large"
                          onClick={decreaseQuantity}
                          aria-label="add cart"
                          sx={{
                            color: "green",
                          }}
                        >
                          <RemoveCircleIcon sx={{ fontSize: "35px" }} />
                        </IconButton>
                        <TextField
                          value={quantity}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="number"
                          variant="outlined"
                          inputProps={{
                            min: 1,
                            style: {
                              textAlign: "center",
                            },
                          }}
                          sx={{
                            width: "100px",
                            marginX: "10px",
                          }}
                        />
                        <IconButton
                          size="large"
                          onClick={increaseQuantity}
                          aria-label="add cart"
                          sx={{
                            color: "green",
                          }}
                        >
                          <AddCircleIcon sx={{ fontSize: "35px" }} />
                        </IconButton>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={handleAddToCart}
                      fullWidth
                    >
                      เพิ่มในตะกร้า
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              {/* show image */}
              <Modal open={open} onClose={handleClose}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                    outline: "none",
                  }}
                >
                  {selectedImage && (
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "80vh",
                      }}
                      width={500}
                      height={600}
                    />
                  )}
                </Box>
              </Modal>
              {/* show cart */}
              <Modal open={openCart} onClose={handleCloseCart}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                    outline: "none",
                  }}
                >
                  {product.items.length > 0 &&
                    product.items.map((item, i) => {
                      return (
                        <Box key={i}>
                          <p>
                            {" "}
                            {item.variations.map(
                              (variation) => variation.value
                            )}{" "}
                            {item.selling_price}
                          </p>
                        </Box>
                      );
                    })}
                </Box>
              </Modal>
              {/* description product */}
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  mt: 2,
                }}
                className="rounded-md"
              >
                <Typography variant="h4">คำอธิบายสินค้า</Typography>
                <Box
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.description),
                  }}
                  component={"div"}
                  sx={{
                    whiteSpace: "pre-wrap",
                    "& h1": {
                      fontSize: "2rem",
                      color: "#333",
                      margin: "1rem 0",
                    },
                    "& h2": {
                      fontSize: "1.75rem",
                      color: "#555",
                      margin: "0.8rem 0",
                    },
                    "& h3": {
                      fontSize: "1.5rem",
                      color: "#777",
                      margin: "0.6rem 0",
                    },
                    "& p": {
                      fontSize: "1rem",
                      color: "#000",
                      margin: "0.5rem 0",
                    },
                    "& ul": {
                      paddingLeft: "20px",
                      margin: "1rem 0",
                      listStyleType: "disc",
                    }, // Force numbering for ul
                    "& li": { marginBottom: "0.5rem" },
                    "& ol": {
                      listStyleType: "decimal",
                      paddingLeft: "20px",
                    },
                    "& em": { fontStyle: "italic" },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
}
