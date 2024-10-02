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
import { useRouter } from "next/navigation";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { AxiosError } from "axios";
import { ICategory } from "@/interfaces/category.interface";
import CategoryDropdownMenu from "@/components/Admin/ButtonMenuCategory";

export default function Category() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [categoryIdDelete, setCategoryIdDelete] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState<string | string[]>("");
  const [isError, setIsError] = useState(false);

  const axiosAuth = useAxiosAuth();
  const route = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (supplier_id: string) => {
      return axiosAuth.delete("/categories/" + supplier_id);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorMessages = error.response?.data?.message;
        if (Array.isArray(errorMessages)) {
          setSnackbarMessage(error.response?.data?.message);
        } else {
          setSnackbarMessage(
            "Failed to delete category: " + error.response?.data?.message
          );
        }
      } else {
        setSnackbarMessage("An unexpected error occurred.");
      }
      setIsError(true);
      setOpenSnackbar(true);
    },
    onSuccess(data) {
      console.log(data.status);
      
      if (data.status === 200) {
        setSnackbarMessage("Deleted successfully!");
        setIsError(false);
        setOpenSnackbar(true);
        queryClient.invalidateQueries({
          queryKey: ["get-all-categories"],
          exact: true,
        });
      }
    },
  });

  const categories = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: async () => (await axiosAuth.get("/categories")).data,
    refetchInterval: 1000 * 60 * 60 * 5,
  });

  const categoriesData = categories.data?.data;

  const createHandleMenuClick = (
    menuItem: "edit" | "delete",
    supplier_id: string
  ) => {
    if (menuItem === "delete") {
      handleDeleteClick();
      setCategoryIdDelete(supplier_id);
    } else if (menuItem === "edit") {
      console.log("edit");

      route.push("./categories/edit-category/" + supplier_id);
    }
  };
  const handlerCreateCategoryClick = () => {
    route.push("./categories/create-category");
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    mutation.mutate(categoryIdDelete);
    setIsDialogOpen(false);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (categories.isLoading) {
    return <Loading />;
  }

  return (
    <Layout>
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Box>
          <Typography variant="h3">Category</Typography>
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
            className="bg-secondary-500 text-sm"
            size="small"
            onClick={handlerCreateCategoryClick}
          >
            Add Category
          </Button>
        </Box>
      </Box>
      <Divider orientation="horizontal" />
      <TableContainer component={Paper} className="mt-2">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg-primary-400 ">
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Parent category</TableCell>
              <TableCell align="left">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriesData &&
              categoriesData.map((row: ICategory) => (
                <TableRow
                  key={row.categoryId}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.category_name}
                  </TableCell>
                  <TableCell align="left">
                    {row.parent_category_id ? row.parent_category_id : "ไม่มี"}
                  </TableCell>
                  <TableCell align="left">
                    <CategoryDropdownMenu
                      categoryId={row.categoryId}
                      createHandleMenuClick={createHandleMenuClick}
                    />
                    {/* <Dropdown>
                      <MenuButton className="flex bg-primary-500 rounded-sm p-2 text-white hover:bg-primary-300">
                        Action <ArrowDropDownIcon />
                      </MenuButton>
                      <Menu className="bg-white text-center p-2">
                        <MenuItem
                          onClick={createHandleMenuClick(
                            "edit",
                            row.categoryId
                          )}
                          className="text-orange-500 border-orange-500 border-2 hover:bg-primary-200 p-2 rounded my-1 cursor-pointer"
                        >
                          แก้ใข
                        </MenuItem>
                        <MenuItem
                          onClick={createHandleMenuClick(
                            "delete",
                            row.categoryId
                          )}
                          className="bg-red-400 text-white border-red-500 border-2 hover:bg-primary-200 p-2 rounded my-1 cursor-pointer"
                        >
                          ลบ
                        </MenuItem>
                      </Menu>
                    </Dropdown> */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[1, 50]}
                component={"div"}
                count={categoriesData.length}
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
