"use client";
import Header from "@/components/Header";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import React, { useState } from "react";
import api from "@/services/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { info: string[] } }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDone, setIsDone] = useState(false);
  const route = useRouter()

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    try {
      const res = await api.post(
        `/auth/verifyResetPassword/${params.info[0]}/${params.info[1]}`,
        {
          new_password: newPassword,
        }
      );
      if (res.status === 201) {
        console.log("reset suc");
        
        setSuccess("Password has been reset successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setIsDone(true);
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
        {!isDone && (
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
              Reset Password
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="success.main">{success}</Typography>}
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              ยืนยันการเปลี่ยนรหัสผ่าน
            </Button>
          </Box>
        )}
        {isDone && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              margin: "auto",
              padding: 2,
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              className="text-green-500 text-center"
            >
              เปลี่ยนหัสเรียบร้อย!!
            </Typography>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={()=>{
                route.replace("/login")
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}
