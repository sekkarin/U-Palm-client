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
import { initialCart } from "@/libs/features/cart/cartSlice";
import { Cart } from "@/interfaces/cart.interface";

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
          const cartResponse = await axiosPrivate.get<Cart[]>("/carts/", {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
            withCredentials: true,
          });

          const itemCart = cartResponse.data.map((item) => item.items).flat();

          itemCart.map((item) =>
            dispatch(
              initialCart({
                product_item_id: item.product_item_id,
                qty: item.qty,
                variation_id: item._id!,
              })
            )
          );
          

          // itemCart.dispatch(
          //   addCartItem({
          //     product_item_id: cartResponse?.data?._id,
          //     qty: cartResponse?.data?._id,
          //     variation_id: "",
          //     product: "",
          //   })
          // );

          dispatch(
            setCredential({
              access_token: accessToken,
              ...profileResponse.data,
            })
          );
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);

        dispatch(logout());
        setIsAuthenticated(false);
        router.replace("/", { scroll: false });
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
