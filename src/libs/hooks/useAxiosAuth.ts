"use client";

import { useEffect } from "react";

import { axiosPrivate } from "@/services/api";
import useRefreshToken from "./useRefreshToken";
import { useAppDispatch, useAppSelector } from "../hook";
import { setCredential } from "../features/auth/authSlice";

const useAxiosAuth = () => {
  const refresh = useRefreshToken();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          if (newAccessToken) {
            dispatch(setCredential(newAccessToken));
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, dispatch, refresh]);

  return axiosPrivate;
};

export default useAxiosAuth;
