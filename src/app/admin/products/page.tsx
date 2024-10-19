"use client";
import Layout from "@/components/Admin/Layout";
import { Loading } from "@/components/Loading";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputBase,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { AxiosError } from "axios";
import { ProductResponse } from "@/interfaces/product.interface";
import Image from "next/image";
import ProductDropdownMenu from "@/components/Admin/ButtonMenuProduct";

export default function Products() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [productIdDelete, setProductIdDeleteIdDelete] = useState<
    string | undefined
  >("");
  const [snackbarMessage, setSnackbarMessage] = useState<string | string[]>("");
  const [isError, setIsError] = useState(false);

  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (supplier_id: string) => {
      return axiosAuth.delete("/products/" + supplier_id);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessages = error.response?.data?.message;
        if (Array.isArray(errorMessages)) {
          setSnackbarMessage(error.response?.data?.message);
        } else {
          setSnackbarMessage(
            "Failed to delete product: " + error.response?.data?.message
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
        setSnackbarMessage("Products deleted successfully!");
        setIsError(false);
        setOpenSnackbar(true);
        queryClient.invalidateQueries({
          queryKey: ["get-all-products"],
          exact: true,
        });
      }
    },
  });

  const productsQuery = useQuery<ProductResponse>({
    queryKey: ["get-all-products"],
    queryFn: async () => (await axiosAuth.get("/products")).data,
    refetchInterval: 1000 * 60 * 60 * 5,
  });

  const products = productsQuery.data?.data;

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (productIdDelete) {
      mutation.mutate(productIdDelete);
    }
    setIsDialogOpen(false);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (productsQuery.isLoading) {
    return <Loading />;
  }
  return (
    <Layout>
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Box>
          <Typography variant="h3">Products</Typography>
        </Box>

        <Box display={"flex"} gap={2}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 400,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search product"
              inputProps={{ "aria-label": "search product" }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button
            variant="contained"
            className="bg-secondary-500 text-lg"
            size="small"
            onClick={() => {}}
          >
            Add PRODUCT
          </Button>
        </Box>
      </Box>

      {/* content */}
      <Paper
        sx={{
          mt: 2,
          p: 1,
        }}
        elevation={3}
      >  
        <TableContainer component={Paper} className="mt-2">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg-primary-400">
              <TableRow>
                <TableCell align="left">PRODUCT</TableCell>
                <TableCell align="left">CATEGORY</TableCell>
                <TableCell align="left">STOCK</TableCell>

                <TableCell align="left">PRICE</TableCell>
                <TableCell align="left">QTY</TableCell>
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products &&
                products.map((row) => (
                  <TableRow
                    key={row?.product_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    className=""
                  >
                    <TableCell component="th" scope="row" sx={{ width: 300 }}>
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        alignItems={"center"}
                        gap={1}
                      >
                        <Image
                          src={row?.product_image[0]}
                          width={60}
                          height={60}
                          alt={row.name}
                        />
                        <Box>{row.name}</Box>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      {row.category_id.category_name}
                    </TableCell>
                    <TableCell align="left">
                      {row.items.reduce(
                        (preValue, currValue) =>
                          preValue + parseFloat(currValue.qty_in_stock),
                        0
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {row.items.map((item) => item.selling_price)}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>

                    <TableCell align="right">
                      <ProductDropdownMenu
                        product_id={row.product_id}
                        handleDeleteClick={handleDeleteClick}
                        setProductIdDeleteIdDelete={setProductIdDeleteIdDelete}
                      />
                      {/* <Dropdown>
                        <MenuButton className="hover:bg-primary-100 hover:rounded-full ">
                          <MoreVertIcon />
                        </MenuButton>
                        <Menu className="bg-white  text-center p-2">
                          <MenuItem className=" hover:bg-neutral-100 my-2">
                            <Link
                              href={`./products/${row.product_id}`}
                              className="p-2 w-5 h-6"
                            >
                              View
                            </Link>
                          </MenuItem>
                          <MenuItem className=" hover:bg-neutral-100  my-2">
                            <Link
                              href={`./products/edit/${row.product_id}`}
                              className="p-2 w-5 h-6"
                            >
                              Edit
                            </Link>
                          </MenuItem>
                          <MenuItem
                            className=" hover:bg-neutral-100  my-2"
                            onClick={() => {
                              setProductIdDeleteIdDelete(row?.product_id);
                              handleDeleteClick();
                            }}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </Dropdown> */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[1, 50]}
                  component={"div"}
                  count={products?.length}
                  page={0}
                  onPageChange={() => {
                    console.log("Page changed");
                  }}
                  rowsPerPage={0}
                  onRowsPerPageChange={() => {
                    console.log("Rows per page changed");
                  }}
                  align="left"
                />
              </TableRow>
            </TableFooter> */}
          </Table>
        </TableContainer>
        {/* end content */}
      </Paper>

      <ConfirmDeleteDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleConfirmDelete}
      />
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

