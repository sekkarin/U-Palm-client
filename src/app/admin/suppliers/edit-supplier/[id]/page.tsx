"use client";
import Layout from "@/components/Admin/Layout";
import { Loading } from "@/components/Loading";
import { Supplier } from "@/interfaces/supplier.interface";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import {
  Box,
  Breadcrumbs,
  Button,
  TextField,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function EditSupplier({ params }: { params: { id: string } }) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson1, setContactPerson1] = useState("");
  const [contactEmail1, setContactEmail1] = useState("");
  const [contactTelephone1, setContactTelephone1] = useState("");
  const [contactAddress1, setContactAddress1] = useState("");
  const [contactRemark1, setContactRemark1] = useState("");

  const [contactPerson2, setContactPerson2] = useState<string | null>(null);
  const [contactEmail2, setContactEmail2] = useState<string | null>(null);
  const [contactTelephone2, setContactTelephone2] = useState<string | null>(
    null
  );
  const [contactAddress2, setContactAddress2] = useState<string | null>(null);
  const [contactRemark2, setContactRemark2] = useState<string | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | string[]>("");
  const [isError, setIsError] = useState(false);
  const queryClient = useQueryClient();

  const axiosAuth = useAxiosAuth();
 

  const initialForm = (supplier: Supplier) => {
    setProfileImage(null);
    setName(supplier.name);
    setEmail(supplier.email || ""); // assuming you want to set it to an empty string if the email is not provided
    setTelephone(supplier.contacts_person_1.telephone || ""); // set telephone from the first contact person
    setCountry(supplier.country || "");
    setState(supplier.state || ""); // assuming there's no state in the supplier object
    setCity(supplier.city || "");
    setZip(supplier.zip || "");
    setAddress(supplier.address || "");
    setContactPerson1(supplier.contacts_person_1.con_person || "");
    setContactEmail1(supplier.contacts_person_1.email || "");
    setContactTelephone1(supplier.contacts_person_1.telephone || "");
    setContactAddress1(supplier.contacts_person_1.address || "");
    setContactRemark1(supplier.contacts_person_1.con_remark || "");
    setContactPerson2(supplier.contacts_person_2?.con_person || ""); // assuming there's no second contact person
    setContactEmail2(supplier.contacts_person_2?.email || "");
    setContactTelephone2(supplier.contacts_person_2?.telephone || "");
    setContactAddress2(supplier.contacts_person_2?.address || "");
    setContactRemark2(supplier.contacts_person_2?.con_remark || "");
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axiosAuth.put(`/suppliers/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessages = error.response?.data?.message;
        if (Array.isArray(errorMessages)) {
          setSnackbarMessage(error.response?.data?.message);
        } else {
          setSnackbarMessage(
            "Failed to add supplier: " + error.response?.data?.message
          );
        }
      } else {
        setSnackbarMessage("An unexpected error occurred.");
      }
      setIsError(true);
      setOpenSnackbar(true);
    },
    onSuccess(data) {
      if (data.status === 200) {
        setSnackbarMessage("Supplier updated successfully!");
        setIsError(false);
        setOpenSnackbar(true);
        queryClient.invalidateQueries({
          queryKey: ["get-all-supplier"],
        });
      }
    },
  });
  const supplierQuery = useQuery<Supplier>({
    queryKey: ["get-supplier", params.id],
    queryFn: async () => (await axiosAuth.get(`/suppliers/${params.id}`)).data,
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

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const formData = new FormData();

    // Append file
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    // Append other fields
    formData.append("name", name);
    formData.append("telephone", telephone);
    formData.append("email", email);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("zip", zip);
    formData.append("address", address);
    formData.append("contactEmail1", contactEmail1);
    formData.append("contactPerson1", contactPerson1);
    formData.append("contactTelephone1", contactTelephone1);
    formData.append("contactAddress1", contactAddress1);
    formData.append("contactRemark1", contactRemark1);
    // Conditionally append optional fields
    if (contactPerson2) {
      formData.append("contactPerson2", contactPerson2);
    }
    if (contactEmail2) {
      formData.append("contactEmail2", contactEmail2);
    }
    if (contactTelephone2) {
      formData.append("contactTelephone2", contactTelephone2);
    }
    if (contactAddress2) {
      formData.append("contactAddress2", contactAddress2);
    }
    if (contactRemark2) {
      formData.append("contactRemark2", contactRemark2);
    }
    mutation.mutate(formData);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (supplierQuery.isSuccess && supplierQuery.data) {
      console.log(supplierQuery.data);
      initialForm(supplierQuery.data);
    }
  }, [supplierQuery.isSuccess, supplierQuery.data]);
  if (supplierQuery.isLoading) {
    return <Loading />;
  }

  return (
    <Layout>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/admin/suppliers" className="underline">
          Supplier
        </Link>
        <Typography color="text.primary">Edit Supplier</Typography>
      </Breadcrumbs>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {/* Supplier infomation */}
        <Typography variant="h6" gutterBottom>
          Edit Supplier Information
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
        {/* Commercial Name */}
        <Box mt={2}>
          <TextField
            label="Commercial Name (Company/Juristic)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
        </Box>
        {/* Email */}
        <Box mt={2}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
        </Box>
        {/* Telephone */}
        <Box mt={2}>
          <TextField
            label="Telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            fullWidth
            required
          />
        </Box>

        {/* Country */}
        <Box mt={2}>
          <TextField
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            required
          />
        </Box>
        {/* State */}
        <Box mt={2}>
          <TextField
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            fullWidth
            required
          />
        </Box>
        {/* City */}
        <Box mt={2}>
          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            required
          />
        </Box>
        {/* ZIP Code */}
        <Box mt={2}>
          <TextField
            label="ZIP Code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            fullWidth
            required
          />
        </Box>
        {/* Address */}
        <Box mt={2}>
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            required
          />
        </Box>
        {/* End supplier infomation */}
        {/* contact person 1 */}
        <Typography variant="h6" mt={1} gutterBottom>
          Contact Person 1
        </Typography>
        <Divider
          sx={{
            my: 1,
          }}
        />
        <Box mt={2}>
          <TextField
            label="Contact Person 1"
            value={contactPerson1}
            onChange={(e) => setContactPerson1(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Email"
            value={contactEmail1}
            onChange={(e) => setContactEmail1(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Telephone"
            value={contactTelephone1}
            onChange={(e) => setContactTelephone1(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Address"
            value={contactAddress1}
            onChange={(e) => setContactAddress1(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Contact Remark"
            value={contactRemark1}
            onChange={(e) => setContactRemark1(e.target.value)}
            fullWidth
            required
          />
        </Box>
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
        <Box mt={2}>
          <TextField
            label="Contact Person 2"
            value={contactPerson2 || ""}
            onChange={(e) => setContactPerson2(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Email"
            value={contactEmail2 || ""}
            onChange={(e) => setContactEmail2(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Telephone"
            value={contactTelephone2 || ""}
            onChange={(e) => setContactTelephone2(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Address"
            value={contactAddress2 || ""}
            onChange={(e) => setContactAddress2(e.target.value)}
            fullWidth
          />
        </Box>
        <Box mt={2}>
          <TextField
            label="Contact Remark"
            value={contactRemark2 || ""}
            onChange={(e) => setContactRemark2(e.target.value)}
            fullWidth
          />
        </Box>
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        onClose={handleCloseSnackbar}
        sx={{
          mt: 5,
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={isError ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {typeof snackbarMessage == "string"
            ? snackbarMessage
            : snackbarMessage.map((msg, index) => <p key={index}>{msg}</p>)}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
