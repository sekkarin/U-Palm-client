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
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import React, { useState } from "react";

export default function CreateSupplier() {
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [formValues, setFormValues] = useState({
    category_name: "",
    email: "",
    telephone: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    address: "",
    contactPerson1: "",
    contactEmail1: "",
    contactTelephone1: "",
    contactAddress1: "",
    contactRemark1: "",
    contactPerson2: null as string | null,
    contactEmail2: null as string | null,
    contactTelephone2: null as string | null,
    contactAddress2: null as string | null,
    contactRemark2: null as string | null,
  });

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const resetForm = () => {
    setProfileImage(null);
    setFormValues({
      category_name: "",
      email: "",
      telephone: "",
      country: "",
      state: "",
      city: "",
      zip: "",
      address: "",
      contactPerson1: "",
      contactEmail1: "",
      contactTelephone1: "",
      contactAddress1: "",
      contactRemark1: "",
      contactPerson2: null,
      contactEmail2: null,
      contactTelephone2: null,
      contactAddress2: null,
      contactRemark2: null,
    });
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axiosAuth.post("/suppliers", formData, {
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
      resetForm()
    },
    
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target instanceof HTMLInputElement && event.target.files) {
      const file = event.target?.files[0];
      if (file) {
        setProfileImage(file);
      }
    }
  };

  const handleInputChange =
    (field: keyof typeof formValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({ ...formValues, [field]: event.target.value });
    };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const formData = new FormData();
    if (profileImage) formData.append("profileImage", profileImage);

    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as string);
    });

    mutation.mutate(formData);
  };
  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <Layout>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/admin/suppliers" className="underline">
          Supplier
        </Link>
        <Typography color="text.primary">Create Supplier</Typography>
      </Breadcrumbs>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {/* Supplier information */}
        <Typography variant="h6" gutterBottom>
          Supplier Information
        </Typography>
        <Divider
          sx={{
            my: 1,
          }}
        />
        <Box>
          <TextField
            type="file"
            onChange={handleFileChange}
            sx={{ display: "none" }}
            inputProps={{ accept: "image/*" }}
            id="image-input"
          />
          <label htmlFor="image-input">
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          {profileImage && (
            <Box mt={2}>
              <TextField
                label="Selected Image"
                value={profileImage?.name}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
            </Box>
          )}
        </Box>
        {[
          {
            label: "Commercial Name (Company/Juristic)",
            value: formValues.category_name,
            field: "name" as keyof typeof formValues,
          },
          {
            label: "Email",
            value: formValues.email,
            field: "email" as keyof typeof formValues,
          },
          {
            label: "Telephone",
            value: formValues.telephone,
            field: "telephone" as keyof typeof formValues,
          },
          {
            label: "Country",
            value: formValues.country,
            field: "country" as keyof typeof formValues,
          },
          {
            label: "State",
            value: formValues.state,
            field: "state" as keyof typeof formValues,
          },
          {
            label: "City",
            value: formValues.city,
            field: "city" as keyof typeof formValues,
          },
          {
            label: "ZIP Code",
            value: formValues.zip,
            field: "zip" as keyof typeof formValues,
          },
          {
            label: "Address",
            value: formValues.address,
            field: "address" as keyof typeof formValues,
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

        {/* End supplier information */}
        {/* contact person 1 */}
        <Typography variant="h6" mt={1} gutterBottom>
          Contact Person 1
        </Typography>
        <Divider
          sx={{
            my: 1,
          }}
        />
        {[
          {
            label: "Contact Person 1",
            value: formValues.contactPerson1,
            field: "contactPerson1" as keyof typeof formValues,
          },
          {
            label: "Email",
            value: formValues.contactEmail1,
            field: "contactEmail1" as keyof typeof formValues,
          },
          {
            label: "Telephone",
            value: formValues.contactTelephone1,
            field: "contactTelephone1" as keyof typeof formValues,
          },
          {
            label: "Address",
            value: formValues.contactAddress1,
            field: "contactAddress1" as keyof typeof formValues,
          },
          {
            label: "Contact Remark",
            value: formValues.contactRemark1,
            field: "contactRemark1" as keyof typeof formValues,
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
        {/* End contact person 1 */}
        {/* contact person 2 */}
        <Typography variant="h6" mt={1} gutterBottom>
          Contact Person 2
        </Typography>
        <Divider
          sx={{
            my: 1,
          }}
        />
        {[
          {
            label: "Contact Person 2",
            value: formValues.contactPerson2,
            field: "contactPerson2" as keyof typeof formValues,
          },
          {
            label: "Email",
            value: formValues.contactEmail2,
            field: "contactEmail2" as keyof typeof formValues,
          },
          {
            label: "Telephone",
            value: formValues.contactTelephone2,
            field: "contactTelephone2" as keyof typeof formValues,
          },
          {
            label: "Address",
            value: formValues.contactAddress2,
            field: "contactAddress2" as keyof typeof formValues,
          },
          {
            label: "Contact Remark",
            value: formValues.contactRemark2,
            field: "contactRemark2" as keyof typeof formValues,
          },
        ].map(({ label, value, field }) => (
          <Box mt={2} key={field}>
            <TextField
              label={label}
              value={value || ""}
              onChange={handleInputChange(field)}
              fullWidth
            />
          </Box>
        ))}
        {/* End contact person 2 */}

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
