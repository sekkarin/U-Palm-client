/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import Link from "next/link";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import api from "@/services/api";
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAccount } from "@/libs/getAccount";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import { useAppDispatch, useAppSelector } from "@/libs/hook";
import { setCredential } from "@/libs/features/auth/authSlice";

export default function Login() {
  // const axiosAuth = useAxiosAuth();
  const select = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Perform API requests
        const accessToken = await api.get("/auth/refresh");

        const profileResponse = await api.get("/auth/profile", {
          headers: {
            Authorization: "Bearer " + accessToken.data.access_token,
          },
          withCredentials: true,
        });

        dispatch(
          setCredential({
            access_token: accessToken.data.access_token,
            ...profileResponse.data,
          })
        );
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, []);

  // data.then((response) => dispatch(setCredential(response)));

  // if (isLoading) {
  //   return (
  //     <div className="h-full">
  //       <p>loading....</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <Header />
      {/* {data} */}
    </>
  );
}
