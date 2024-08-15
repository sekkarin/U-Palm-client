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
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
// debounce 
import _ from 'lodash';

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
    supplier_id: "66a5d3d0fc13ae19d82344eb",
    category_id: "66a496a68393770d3a148a45",
  });
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const suppliers = [
    { label: "Supplier 1", id: 1 },
    { label: "Supplier 2", id: 2 },
    { label: "Supplier 3", id: 3 },
  ];

  const categories = [
    { label: "Category 1", id: 1 },
    { label: "Category 2", id: 2 },
    { label: "Category 3", id: 3 },
  ];

  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const resetForm = () => {
    setImageBannerAdverting(null);
    setFormValues({
      name: "",
      description: "",
      supplier_id: "",
      category_id: "",
    });
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axiosAuth.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError: (error) => {
      const errorMessages =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "An unexpected error occurred.";
      setSnackbarState({
        open: true,
        message: Array.isArray(errorMessages)
          ? errorMessages.join(", ")
          : `Failed to add supplier: ${errorMessages}`,
        isError: true,
      });
    },
    onSuccess() {
      setSnackbarState({
        open: true,
        message: "Supplier updated successfully!",
        isError: false,
      });
      queryClient.invalidateQueries({ queryKey: ["get-all-supplier"] });
      resetForm();
    },
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

    mutation.mutate(formData);
  };
  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  const handleSupplierChange = (event, value) => {
    setSelectedSupplier(value);
  };

  const handleCategoryChange = (event, value) => {
    setSelectedCategory(value);
  };
  const fetchSuppliers = useCallback(
    _.debounce(async (query) => {
      if (query.length < 3) return; // Skip fetching if query is less than 3 characters
      setLoading(true);
      try {
        const response = await axios.get(`https://api.example.com/suppliers?search=${query}`);
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setLoading(false);
      }
    }, 500), // Delay of 500ms
    []
  );

  return (
    <Layout>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/admin/products" className="underline">
          Product
        </Link>
        <Typography color="text.primary">Create Product</Typography>
      </Breadcrumbs>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} >
        {/* Supplier information */}
        <Typography variant="h6" gutterBottom>
          Product Information
        </Typography>
        <Divider
          sx={{
            my: 1,
          }}
        />
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
        <Autocomplete
          options={suppliers}
          getOptionLabel={(option) => option.label}
          value={selectedSupplier}
          onChange={handleSupplierChange}
          onInputChange={(e,v)=>{
            console.log(e.target.value,v);
            
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Supplier" variant="outlined" />
          )}
          sx={{ mb: 2,mt:2 }}
        />

        <Autocomplete
          options={categories}
          getOptionLabel={(option) => option.label}
          value={selectedCategory}
          onChange={handleCategoryChange}
          renderInput={(params) => (
            <TextField {...params} label="Select Category" variant="outlined" />
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
        <Box mt={4}>
          <Button
            type="submit"
            variant="contained"
            className="bg-secondary-500"
            fullWidth
          >
            เพิ่ม
          </Button>
        </Box>
      </Box>

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
