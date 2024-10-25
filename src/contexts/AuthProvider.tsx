"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api, { axiosPrivate } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/libs/hook";
import { setCredential, logout } from "@/libs/features/auth/authSlice";

import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state?.auth?.accessToken);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true)
      try {
        if (!auth) {
          const accessTokenResponse = await axiosPrivate.get("/auth/refresh");
          const accessToken = accessTokenResponse.data.access_token;

          const profileResponse = await axiosPrivate.get("/auth/profile", {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
            withCredentials: true,
          });
          dispatch(
            setCredential({
              access_token: accessToken,
              ...profileResponse.data,
            })
          );
        }
        setIsAuthenticated(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch(logout());
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [auth, dispatch, router]);

  const login = (accessToken: string) => {
    api
      .get("/auth/profile", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        withCredentials: true,
      })
      .then((profileResponse) => {
        dispatch(
          setCredential({
            access_token: accessToken,
            ...profileResponse.data,
          })
        );
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
