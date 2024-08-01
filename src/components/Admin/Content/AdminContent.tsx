import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Toolbar,
} from "@mui/material";

const AdminContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AdminContent;
