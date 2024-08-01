/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import Link from "next/link";

const NotFound: React.FC = () => {
  return (
    <Container sx={{ textAlign: "center", padding: "50px 0" }}>
      <Typography variant="h1" sx={{ marginBottom: "20px" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="body1">
          It looks like the page you are trying to reach doesn't exist or has
          been moved.
        </Typography>
      </Box>
      <Button variant="contained" color="primary" component={Link} href="/">
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound;
