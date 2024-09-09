"use client";
import Layout from "@/components/Admin/Layout";
import { Loading } from "@/components/Loading";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRouter } from "next/navigation";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { AxiosError } from "axios";
import { ISupplier } from "@/interfaces/supplier.interface";

export default function Suppliers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [supplierIdDelete, setSupplierIdDelete] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState<string | string[]>("");
  const [isError, setIsError] = useState(false);

  const axiosAuth = useAxiosAuth();
  const route = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (supplier_id: string) => {
      return axiosAuth.delete("/suppliers/" + supplier_id);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessages = error.response?.data?.message;
        if (Array.isArray(errorMessages)) {
          setSnackbarMessage(error.response?.data?.message);
        } else {
          setSnackbarMessage(
            "Failed to delete supplier: " + error.response?.data?.message
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
        setSnackbarMessage("Deleted successfully!");
        setIsError(false);
        setOpenSnackbar(true);
        queryClient.invalidateQueries({
          queryKey: ["get-all-supplier"],
          exact: true,
        });
      }
    },
  });

  const suppliers = useQuery({
    queryKey: ["get-all-supplier"],
    queryFn: async () => (await axiosAuth.get("/suppliers")).data,
    refetchInterval: 1000 * 60 * 60 * 5,
  });

  const suppliersData = suppliers.data?.data;

  const createHandleMenuClick = (
    menuItem: "edit" | "detail" | "delete",
    supplier_id: string
  ) => {
    return () => {
      

      if (menuItem === "delete") {
        handleDeleteClick();
        setSupplierIdDelete(supplier_id);
      } else if (menuItem === "edit") {
        route.push("./suppliers/edit-supplier/" + supplier_id);
      } else if (menuItem === "detail") {
        route.push("./suppliers/" + supplier_id);
      }
    };
  };
  const handlerCreateSupplierClick = () => {
    route.push("./suppliers/create-supplier");
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    mutation.mutate(supplierIdDelete);
    setIsDialogOpen(false);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (suppliers.isLoading) {
    return <Loading />;
  }
  return (
    <Layout>
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Box>
          <Typography variant="h3">Supplier</Typography>
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
              placeholder="Search Supplier"
              inputProps={{ "aria-label": "search supplier" }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button
            variant="contained"
            className="bg-secondary-500 text-lg"
            size="small"
            onClick={handlerCreateSupplierClick}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>
      <Divider orientation="horizontal" />
      <TableContainer component={Paper} className="mt-2">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg-primary-400 ">
            <TableRow>
              <TableCell
                sx={{
                  width: 70,
                }}
                align="left"
              >
                Name
              </TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Country</TableCell>
              <TableCell align="left">address</TableCell>
              <TableCell align="left">CreateAt</TableCell>
              <TableCell align="left">Acton</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliersData &&
              suppliersData.map((row: ISupplier) => (
                <TableRow
                  key={row.supplier_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  className="hover:bg-primary-100"
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.country}</TableCell>
                  <TableCell align="left">{row.address}</TableCell>
                  <TableCell align="left">
                    {new Date(row.createdAt).toUTCString()}
                  </TableCell>
                  <TableCell align="left">
                    <Dropdown>
                      <MenuButton className="flex bg-primary-500 rounded-sm p-2 text-white hover:bg-primary-300">
                        Action <ArrowDropDownIcon />
                      </MenuButton>
                      <Menu className="bg-white  text-center p-2">
                        <MenuItem
                          onClick={createHandleMenuClick(
                            "detail",
                            row.supplier_id
                          )}
                          className="text-green-500 border-green-500 border-2 hover:bg-primary-200 p-2 rounded my-1 cursor-pointer"
                        >
                          รายละเอียด
                        </MenuItem>
                        <MenuItem
                          onClick={createHandleMenuClick(
                            "edit",
                            row.supplier_id
                          )}
                          className="text-orange-500 border-orange-500 border-2 hover:bg-primary-200 p-2 rounded my-1 cursor-pointer"
                        >
                          แก้ใข
                        </MenuItem>

                        <MenuItem
                          onClick={createHandleMenuClick(
                            "delete",
                            row.supplier_id
                          )}
                          className="bg-red-400 text-white border-red-500 border-2 hover:bg-primary-200 p-2 rounded my-1 cursor-pointer"
                        >
                          ลบ
                        </MenuItem>
                      </Menu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[1, 50]}
                component={"div"}
                count={suppliersData.length}
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
          </TableFooter>
        </Table>
      </TableContainer>
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
