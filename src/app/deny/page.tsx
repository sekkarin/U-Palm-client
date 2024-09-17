import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import Link from "next/link";

const Unauthorized: React.FC = () => {
  return (
    <Container sx={{ textAlign: "center", padding: "50px 0" }}>
      <Typography variant="h1" sx={{ marginBottom: "20px" }}>
        401
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Unauthorized Access
      </Typography>
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="body1">
          You do not have permission to view this page. Please login to gain
          access.
        </Typography>
      </Box>
      <Button variant="contained" color="primary" component={Link} href="/">
        Go to Home
      </Button>
    </Container>
  );
};

export default Unauthorized;
