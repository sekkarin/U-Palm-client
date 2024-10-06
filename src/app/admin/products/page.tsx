"use client";
import Layout from "@/components/Admin/Layout";
import { Loading } from "@/components/Loading";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { AxiosError } from "axios";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
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
      {/* overview */}
      <Paper
        elevation={3}
        sx={{
          height: "auto",
        }}
      >
        <Box display={"flex"}>
          <Box
            sx={{
              width: 500,
              height: 100,
              padding: 2,
              bgcolor: "gray",
            }}
          >
            <p>In-Store Sales</p>
            <p>$5,345</p>
          </Box>
          <Divider orientation="vertical" />
          <Box
            sx={{
              width: 500,
              height: 100,
              padding: 2,
              bgcolor: "gray",
            }}
          >
            <p>Website Sales</p>
            <p>$74,347</p>
          </Box>
          <Divider orientation="vertical" />
          <Box
            sx={{
              width: 500,
              height: 100,
              padding: 2,
              bgcolor: "gray",
            }}
          >
            <p>Discount</p>
            <p>$14,235</p>
          </Box>
        </Box>
      </Paper>
      {/*end overview */}
      <Typography mt={2} variant="h4">
        Products
      </Typography>
      {/* content */}
      <Paper
        sx={{
          mt: 2,
          p: 1,
        }}
        elevation={3}
      >
        <Typography variant="h4">Filters</Typography>
        <Grid container spacing={1} mt={2}>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              sx={{ width: "100%" }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              sx={{ width: "100%" }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              sx={{ width: "100%" }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
          </Grid>
        </Grid>
        <Divider
          sx={{
            my: 2,
          }}
        />
        {/* search */}
        <Box display={"flex"} justifyContent={"space-between"} padding={1}>
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
          <Box>
            <Link href={"./products/create-product"}>
              <Button
                className="bg-primary-400"
                sx={{
                  color: "white",
                  width: 200,
                }}
                size="large"
                variant="contained"
              >
                <AddIcon /> Add Product
              </Button>
            </Link>
          </Box>
        </Box>
        {/* search */}

        <Divider
          sx={{
            my: 2,
          }}
        />
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
const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
  {
    label: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { label: "The Good, the Bad and the Ugly", year: 1966 },
  { label: "Fight Club", year: 1999 },
  {
    label: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    label: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { label: "Forrest Gump", year: 1994 },
  { label: "Inception", year: 2010 },
  {
    label: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: "Goodfellas", year: 1990 },
  { label: "The Matrix", year: 1999 },
  { label: "Seven Samurai", year: 1954 },
  {
    label: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { label: "City of God", year: 2002 },
  { label: "Se7en", year: 1995 },
  { label: "The Silence of the Lambs", year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: "Life Is Beautiful", year: 1997 },
  { label: "The Usual Suspects", year: 1995 },
  { label: "Léon: The Professional", year: 1994 },
  { label: "Spirited Away", year: 2001 },
  { label: "Saving Private Ryan", year: 1998 },
  { label: "Once Upon a Time in the West", year: 1968 },
  { label: "American History X", year: 1998 },
  { label: "Interstellar", year: 2014 },
  { label: "Casablanca", year: 1942 },
  { label: "City Lights", year: 1931 },
  { label: "Psycho", year: 1960 },
  { label: "The Green Mile", year: 1999 },
  { label: "The Intouchables", year: 2011 },
  { label: "Modern Times", year: 1936 },
  { label: "Raiders of the Lost Ark", year: 1981 },
  { label: "Rear Window", year: 1954 },
  { label: "The Pianist", year: 2002 },
  { label: "The Departed", year: 2006 },
  { label: "Terminator 2: Judgment Day", year: 1991 },
  { label: "Back to the Future", year: 1985 },
  { label: "Whiplash", year: 2014 },
  { label: "Gladiator", year: 2000 },
  { label: "Memento", year: 2000 },
  { label: "The Prestige", year: 2006 },
  { label: "The Lion King", year: 1994 },
  { label: "Apocalypse Now", year: 1979 },
  { label: "Alien", year: 1979 },
  { label: "Sunset Boulevard", year: 1950 },
  {
    label:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { label: "The Great Dictator", year: 1940 },
  { label: "Cinema Paradiso", year: 1988 },
  { label: "The Lives of Others", year: 2006 },
  { label: "Grave of the Fireflies", year: 1988 },
  { label: "Paths of Glory", year: 1957 },
  { label: "Django Unchained", year: 2012 },
  { label: "The Shining", year: 1980 },
  { label: "WALL·E", year: 2008 },
  { label: "American Beauty", year: 1999 },
  { label: "The Dark Knight Rises", year: 2012 },
  { label: "Princess Mononoke", year: 1997 },
  { label: "Aliens", year: 1986 },
  { label: "Oldboy", year: 2003 },
  { label: "Once Upon a Time in America", year: 1984 },
  { label: "Witness for the Prosecution", year: 1957 },
  { label: "Das Boot", year: 1981 },
  { label: "Citizen Kane", year: 1941 },
  { label: "North by Northwest", year: 1959 },
  { label: "Vertigo", year: 1958 },
  {
    label: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { label: "Reservoir Dogs", year: 1992 },
  { label: "Braveheart", year: 1995 },
  { label: "M", year: 1931 },
  { label: "Requiem for a Dream", year: 2000 },
  { label: "Amélie", year: 2001 },
  { label: "A Clockwork Orange", year: 1971 },
  { label: "Like Stars on Earth", year: 2007 },
  { label: "Taxi Driver", year: 1976 },
  { label: "Lawrence of Arabia", year: 1962 },
  { label: "Double Indemnity", year: 1944 },
  {
    label: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { label: "Amadeus", year: 1984 },
  { label: "To Kill a Mockingbird", year: 1962 },
  { label: "Toy Story 3", year: 2010 },
  { label: "Logan", year: 2017 },
  { label: "Full Metal Jacket", year: 1987 },
  { label: "Dangal", year: 2016 },
  { label: "The Sting", year: 1973 },
  { label: "2001: A Space Odyssey", year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: "Toy Story", year: 1995 },
  { label: "Bicycle Thieves", year: 1948 },
  { label: "The Kid", year: 1921 },
  { label: "Inglourious Basterds", year: 2009 },
  { label: "Snatch", year: 2000 },
  { label: "3 Idiots", year: 2009 },
  { label: "Monty Python and the Holy Grail", year: 1975 },
];
