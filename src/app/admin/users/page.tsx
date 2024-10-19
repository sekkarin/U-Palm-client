"use client";
import React from "react";
import {
  Box,
  IconButton,
  InputBase,
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
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import Layout from "@/components/Admin/Layout";
import { IUser } from "@/interfaces/user.interface";

export default function ManageUser() {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["user-admin-page"],
    queryFn: async () => await axiosAuth.get("/users"),
    refetchInterval: 1000 * 60 * 5,
  });

  const handlerViewUser = (user_id: string) => {
    router.push("./users/" + user_id);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Layout>
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Box>
          <Typography variant="h3">User</Typography>
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
              placeholder="Search user"
              inputProps={{ "aria-label": "search supplier" }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>

      <TableContainer component={Paper} className="mt-2">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Role</TableCell>
              {/* <TableCell align="left">Acton</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data?.data?.map((row: IUser) => (
                <TableRow
                  key={row.user_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => {
                    console.log("view user", row.user_id);
                    handlerViewUser(row.user_id);
                  }}
                  className="hover:bg-primary-100"
                >
                  <TableCell component="th" scope="row">
                    {row.user_id}
                  </TableCell>
                  <TableCell align="left">
                    {row.firstName} {row.lastName}
                  </TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.roles}</TableCell>
                  {/* <TableCell align="left">
                    <Button
                      size="small"
                      color="warning"
                      variant="contained"
                      sx={{
                        mr: 1,
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={(event) => {
                        event.stopPropagation();
                        console.log("delete user");
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[1, 50]}
                component={"div"}
                count={data?.data.length}
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
    </Layout>
  );
}
