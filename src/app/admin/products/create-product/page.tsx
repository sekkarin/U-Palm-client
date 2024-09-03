/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Layout from "@/components/Admin/Layout";
import SnackbarAlert from "@/components/SnackbarAlert";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import {
  Box,
  Breadcrumbs,
  Button,
  TextField,
  Typography,
  Divider,
  ImageList,
  ImageListItem,
  Autocomplete,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
// debounce
import debounce from "lodash/debounce";
import { Loading } from "@/components/Loading";
import { ISupplier } from "@/interfaces/supplier.interface";
import { ICategory } from "@/interfaces/category.interface";

import { IProduct, Item } from "@/interfaces/product.interface";

interface Option {
  label: string;
  id: string;
}
interface SuppliersResponse {
  data: ISupplier[]; // Adjust based on the actual structure of the API response
}
interface CategoriesResponse {
  data: ICategory[]; // Adjust based on the actual structure of the API response
}

// TODO: delete file selected
export default function CreateProduct() {
  const [imageBannerAdverting, setImageBannerAdverting] = useState<File | null>(
    null
  );
  const [productImages, setProductImages] = useState<FileList | null>(null);
  const [imageProductsReview, setImageProductsReview] = useState<string[]>([]);
  const [imageBannerAdvertingReview, setImageBannerAdvertingReview] =
    useState<string>("");
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    supplier_id: "",
    category_id: "",
  });
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    isError: false,
  });
  const [supplierOption, setSupplierOption] = useState<Option[] | []>([]);
  const [categoriesOption, setCategoriesOption] = useState<Option[] | []>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Option | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [inputSupplierValue, setInputSupplierValue] = useState("");
  const [inputCategoryValue, setInputCategoryValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([
    {
      base_price: "",
      discount: "",
      shipping: "",
      profit: "",
      qty_discount: "",
      qty_in_stock: "",
      variations: [{
        name: "", value: "",
        variation_id: undefined
      }],
      product_item_id: "",
      selling_price: undefined
    },
  ]);

  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const resetForm = () => {
    setImageBannerAdverting(null);
    setProductImages(null);
    setSelectedSupplier(null);
    setSelectedCategory(null);
    setImageProductsReview([]);
    setImageBannerAdvertingReview("");
    setFormValues({
      name: "",
      description: "",
      supplier_id: "",
      category_id: "",
    });
    setItems([
      {
        base_price: "",
        discount: "",
        shipping: "",
        profit: "",
        qty_discount: "",
        qty_in_stock: "",
        variations: [{
          name: "", value: "",
          variation_id: undefined
        }],
        product_item_id: "",
        selling_price: undefined
      },
    ]);
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axiosAuth.post<IProduct>("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError: (error) => {
      console.log(error);

      const errorMessages =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "An unexpected error occurred.";
      setSnackbarState({
        open: true,
        message: Array.isArray(errorMessages)
          ? errorMessages.join(", ")
          : `Failed to add product: ${errorMessages}`,
        isError: true,
      });
    },
    onSuccess() {
      setSnackbarState({
        open: true,
        message: "Create product successfully!",
        isError: false,
      });
      queryClient.invalidateQueries({ queryKey: ["get-all-supplier"] });
      resetForm();
    },
  });
  const suppliersQuery = useQuery<SuppliersResponse>({
    queryKey: ["product-get-all-suppliers"],
    queryFn: async () => (await axiosAuth.get("/suppliers")).data,
    refetchInterval: 1000 * 60 * 60 * 5,
  });
  const categoriesQuery = useQuery<CategoriesResponse>({
    queryKey: ["product-get-all-categories"],
    queryFn: async () => (await axiosAuth.get("/categories")).data,
    refetchInterval: 1000 * 60 * 60 * 5,
  });

  const handleFileChangeProductImages = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target instanceof HTMLInputElement && event.target.files) {
      const files = event.target.files;

      if (files.length > 0) {
        const newImages = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        );
        setImageProductsReview((prevImages) => [...prevImages, ...newImages]);
        setProductImages(files);
      } else {
        console.log("reset image");

        setImageProductsReview([]);
        setProductImages(null);
      }
    }
  };
  const handleFileChangeBannerImage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target instanceof HTMLInputElement && event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const newImages = URL.createObjectURL(file);
        setImageBannerAdvertingReview(newImages);
        setImageBannerAdverting(file);
      } else {
        setImageBannerAdvertingReview("");
        setImageBannerAdverting(null);
      }
    }
  };

  const handleInputChange =
    (field: keyof typeof formValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({ ...formValues, [field]: event.target.value });
    };
  const handleDescriptionChange = (value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      description: value,
    }));
  };
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    console.log("summit");

    event.preventDefault();
    const formData = new FormData();

    if (imageBannerAdverting)
      formData.append("image_banner_adverting", imageBannerAdverting);

    if (productImages) {
      Array.from(productImages).forEach((file) => {
        formData.append(`product_image`, file);
      });
    }

    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as string);
    });
    if (items) {
      items.forEach((item, itemIndex) => {
        formData.append(`items[${itemIndex}][base_price]`, item.base_price);
        formData.append(`items[${itemIndex}][discount]`, item.discount);
        formData.append(`items[${itemIndex}][shipping]`, item.shipping);
        formData.append(`items[${itemIndex}][profit]`, item.profit);
        formData.append(`items[${itemIndex}][qty_discount]`, item.qty_discount);
        formData.append(`items[${itemIndex}][qty_in_stock]`, item.qty_in_stock);
        item.variations.forEach((variant, variantIndex) => {
          formData.append(
            `items[${itemIndex}][variations][${variantIndex}][name]`,
            variant.name
          );
          formData.append(
            `items[${itemIndex}][variations][${variantIndex}][value]`,
            variant.value
          );
        });
      });
    }

    mutation.mutate(formData);
  };
  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  // on search in input
  const handleInputCategoryChange = (
    event: React.SyntheticEvent,
    value: string
  ) => {
    setInputCategoryValue(value);
  };
  const handleInputSupplierChange = (
    event: React.SyntheticEvent,
    value: string
  ) => {
    setInputSupplierValue(value);
  };

  // on select
  const handleSupplierChange = (
    event: React.SyntheticEvent,
    value: Option | null
  ) => {
    setSelectedSupplier(value);
    if (value) {
      setFormValues({ ...formValues, supplier_id: value?.id });
    }
  };

  const handleCategoryChange = (
    event: React.SyntheticEvent,
    value: Option | null
  ) => {
    setSelectedCategory(value);
    if (value) {
      setFormValues({ ...formValues, category_id: value?.id });
    }
  };
  // Debounced function to fetch
  const fetchSuppliers = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm) {
        setLoading(true);
        try {
          // await axiosAuth.get("/suppliers"))
          console.log("search api");

          const response = await axiosAuth.get<SuppliersResponse>(
            `/suppliers`,
            {
              params: { query: searchTerm },
            }
          );
          setSupplierOption(
            response.data.data.map((value) => {
              return {
                label: value.name,
                id: value.supplier_id,
              };
            })
          );
        } catch (error) {
          console.error("Failed to fetch suppliers:", error);
        } finally {
          setLoading(false);
        }
      }
    }, 300), // Adjust the debounce delay (ms) as needed
    [setLoading, setSupplierOption]
  );
  const fetchCategories = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm) {
        setLoading(true);
        try {
          // await axiosAuth.get("/suppliers"))
          console.log("search api");

          const response = await axiosAuth.get<CategoriesResponse>(
            `/categories`,
            {
              params: { query: searchTerm },
            }
          );
          setCategoriesOption(
            response.data.data.map((value) => {
              return {
                label: value.category_name,
                id: value.categoryId,
              };
            })
          );
        } catch (error) {
          console.error("Failed to fetch suppliers:", error);
        } finally {
          setLoading(false);
        }
      }
    }, 300), // Adjust the debounce delay (ms) as needed
    []
  );
  const handleAddAnotherItemChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event) {
      const { name, value } = event.target;
      const newItems = [...items];
      newItems[index][name] = value;
      setItems(newItems);
    }
  };
  // Handle changes for the variants
  const handleVariantChange = (
    itemIndex: number,
    variantIndex: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const newItems = [...items];
    newItems[itemIndex].variations[variantIndex] = {
      ...newItems[itemIndex].variations[variantIndex],
      [name]: value,
    };
    setItems(newItems);
  };
  // Add a new variant to a specific item
  const handleAddVariant = (itemIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].variations.push({
      name: "", value: "",
      variation_id: undefined
    });
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        base_price: "",
        discount: "",
        taxPrice: "",
        shipping: "",
        profit: "",
        qty_discount: "",
        qty_in_stock: "",
        variations: [{
          name: "", value: "",
          variation_id: undefined
        }],
        product_item_id: "",
        selling_price: undefined
      },
    ]);
  };

  useEffect(() => {
    if (inputSupplierValue !== "") {
      fetchSuppliers(inputSupplierValue);
    }
    if (inputCategoryValue !== "") {
      fetchCategories(inputCategoryValue);
    }
    if (suppliersQuery.isSuccess && suppliersQuery.data) {
      const supplier = suppliersQuery.data?.data;

      setSupplierOption(
        supplier.map((value) => {
          return {
            label: value.name,
            id: value.supplier_id,
          };
        })
      );
    }
    if (categoriesQuery.isSuccess && categoriesQuery.data) {
      const categories = categoriesQuery.data?.data;
      setCategoriesOption(
        categories.map((value) => {
          return {
            label: value.category_name,
            id: value.categoryId,
          };
        })
      );
    }
  }, [
    categoriesQuery.data,
    categoriesQuery.isSuccess,
    suppliersQuery.data,
    suppliersQuery.isSuccess,
    fetchSuppliers,
    selectedCategory,
    inputSupplierValue,
    inputCategoryValue,
    fetchCategories,
  ]);
  if (suppliersQuery.isLoading || categoriesQuery.isLoading) {
    return <Loading />;
  }

  return (
    <Layout>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/admin/products" className="underline">
          Product
        </Link>
        <Typography color="text.primary">Create Product</Typography>
      </Breadcrumbs>
      <form onSubmit={handleSubmit}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={2}
        >
          <Typography variant="h5">Add a new product</Typography>
          <Box display={"flex"} gap={1}>
            <Button variant="outlined" color="inherit">
              Discard
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Publish Product
            </Button>
          </Box>
        </Box>

        {/* Supplier information */}
        <Paper sx={{ mt: 3, p: 1 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Product Information
          </Typography>
          <Divider
            sx={{
              my: 1,
            }}
          />
          <Autocomplete
            options={supplierOption}
            getOptionLabel={(option) => option.label}
            value={selectedSupplier}
            onChange={handleSupplierChange}
            onInputChange={handleInputSupplierChange}
            renderInput={(params) => (
              <TextField
                required
                {...params}
                label="Select Supplier"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ mb: 2, mt: 2 }}
          />

          <Autocomplete
            options={categoriesOption}
            getOptionLabel={(option) => option.label}
            value={selectedCategory}
            onChange={handleCategoryChange}
            onInputChange={handleInputCategoryChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Category"
                variant="outlined"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          {[
            {
              label: "Name",
              value: formValues.name,
              field: "name" as keyof typeof formValues,
            },
          ].map(({ label, value, field }) => (
            <Box mt={2} key={field}>
              <TextField
                label={label}
                value={value}
                onChange={handleInputChange(field)}
                fullWidth
                required
              />
            </Box>
          ))}

          <ReactQuill
            theme="snow"
            value={formValues.description}
            onChange={handleDescriptionChange}
            placeholder="Description products 👉"
            style={{
              marginTop: "10px",
            }}
          />
        </Paper>

        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Product Image
          </Typography>
          <Box display={"flex"} gap={2}>
            {/* image products */}
            <Box>
              <TextField
                type="file"
                onChange={handleFileChangeProductImages}
                sx={{ display: "none" }}
                inputProps={{ accept: "image/*", multiple: true }}
                id="image-input"
              />
              <label htmlFor="image-input">
                <Button variant="contained" component="span">
                  Upload Image Products
                </Button>
              </label>
            </Box>

            {/* image banner */}
            <Box>
              <TextField
                type="file"
                onChange={handleFileChangeBannerImage}
                sx={{ display: "none" }}
                inputProps={{ accept: "image/*" }}
                id="image-input-banner"
              />
              <label htmlFor="image-input-banner">
                <Button variant="contained" component="span">
                  Upload Image Banner
                </Button>
              </label>
            </Box>
          </Box>
          {imageProductsReview && imageProductsReview.length > 0 && (
            <>
              <Typography sx={{ my: 2 }}>Product image</Typography>
              <ImageList cols={10} rowHeight={164}>
                {imageProductsReview.map((image, index) => (
                  <ImageListItem key={index}>
                    <Image
                      width={150}
                      height={150}
                      src={image}
                      alt={`uploaded-${index}`}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          )}
          {imageBannerAdvertingReview && (
            <>
              <Typography sx={{ my: 2 }}>Product Banner</Typography>
              <ImageList cols={10} rowHeight={164}>
                <ImageListItem key={imageBannerAdvertingReview}>
                  <Image
                    width={150}
                    height={150}
                    src={imageBannerAdvertingReview}
                    alt={`uploaded-${imageBannerAdvertingReview}`}
                  />
                </ImageListItem>
              </ImageList>
            </>
          )}
        </Paper>
        <Box
          sx={{
            mt: 1,
            gap: 2,
            display: "flex",
            flexDirection: "column",
            p: 1,
          }}
        >
          <Typography variant="h5">Add items and Product variants</Typography>
          {items.map((item, index) => (
            <Grid container key={index}>
              <Grid item md={12} sm={12}>
                <Paper elevation={3} sx={{ mt: 3, p: 1 }}>
                  <Typography>Price</Typography>
                  <Divider />
                  <Box mt={2}>
                    <TextField
                      name="base_price"
                      label={"Base Price"}
                      value={item.base_price}
                      onChange={(e) => handleAddAnotherItemChange(index, e)}
                      type="number"
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mt={2}>
                    <TextField
                      label={"QTY"}
                      name={"qty_in_stock"}
                      type="number"
                      value={item.qty_in_stock}
                      onChange={(e) => handleAddAnotherItemChange(index, e)}
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mt={2}>
                    <TextField
                      label="QTY Discount"
                      name="qty_discount"
                      type="number"
                      value={item.qty_discount}
                      onChange={(e) => handleAddAnotherItemChange(index, e)}
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mt={2}>
                    <TextField
                      label={"Discount Price"}
                      name={"discount"}
                      defaultValue={7.0}
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleAddAnotherItemChange(index, e)}
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mt={2}>
                    <TextField
                      label={"shipping Price"}
                      name={"shipping"}
                      type="number"
                      value={item.shipping}
                      onChange={(e) => handleAddAnotherItemChange(index, e)}
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mt={2}>
                    <TextField
                      label={"Profit"}
                      name={"profit"}
                      type="number"
                      value={item.profit}
                      onChange={(e) => handleAddAnotherItemChange(index, e)}
                      fullWidth
                      required
                    />
                  </Box>
                  <Typography variant="h5">Variant</Typography>
                  {/* Product Variants Section */}
                  {item.variations.map((variant, variantIndex) => (
                    <Box key={variantIndex} mt={2}>
                      <Divider sx={{ my: 1 }} />
                      <Box display={"flex"} gap={1}>
                        <TextField
                          name="name"
                          label="Variant Name"
                          value={variant.name}
                          onChange={(e) =>
                            handleVariantChange(index, variantIndex, e)
                          }
                          fullWidth
                          required
                          margin="normal"
                        />
                        <TextField
                          name="value"
                          label="Variant Value"
                          value={variant.value}
                          onChange={(e) =>
                            handleVariantChange(index, variantIndex, e)
                          }
                          fullWidth
                          required
                          margin="normal"
                        />
                      </Box>
                    </Box>
                  ))}
                  <Button
                    onClick={() => handleAddVariant(index)}
                    variant="outlined"
                    color="secondary"
                    style={{ marginTop: "20px" }}
                  >
                    Add Another Variant
                  </Button>
                  <Box display={"flex"} justifyContent={"space-between"} mt={2}>
                    <Typography>Selling Price</Typography>
                    <Typography className="text-green-500">
                      {parseFloat(item.base_price) +
                        parseFloat(item.profit) +
                        parseFloat(item.shipping) || 0}
                      $
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="contained"
            color="primary"
            sx={{
              width: "20%",
            }}
            onClick={handleAddItem}
          >
            Add Another
          </Button>
        </Box>
      </form>
      {/* Snackbar for notifications */}
      <SnackbarAlert
        open={snackbarState.open}
        handleCloseSnackbar={handleCloseSnackbar}
        isError={snackbarState.isError}
        message={snackbarState.message}
      />
    </Layout>
  );
}
