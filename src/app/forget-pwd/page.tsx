"use client";
import Header from "@/components/Header";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import React, { useState } from "react";
import api from "@/services/api";
import { AxiosError } from "axios";

export default function Page() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.post(`/auth/resetPassword/`, {
        email: email,
      });
      if (res.status === 201) {
        console.log(res.data);

        setSuccess(res.data.message);
        setEmail("");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.response.message);
      }
    }
  };
  return (
    <>
      <Header />
      <Container maxWidth={"lg"} className="mt-[110px] min-h-dvh">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            margin: "auto",
            padding: 2,
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Forget Password
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            ยืนยัน
          </Button>
        </Box>
      </Container>
    </>
  );
}
