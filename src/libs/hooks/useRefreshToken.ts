import api from "@/services/api";
import { AxiosError } from "axios";
// import { useAppDispatch } from "../app/hooks";
// import { logout } from "../features/auth/authSlice";
// import api from "";
import Cookies from "js-cookie";
import { useAppDispatch } from "../hook";
import { logout } from "../features/auth/authSlice";

const useRefreshToken = () => {
  const dispatch = useAppDispatch();

  const refresh = async () => {
    try {
      const { data } = await api.get("/auth/refresh", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // console.log(data);

      return data.access_token;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        dispatch(logout());
        Cookies.remove("refresh_token");
        // navigate("/session-expired");
      }
      return null;
    }
  };
  return refresh;
};

export default useRefreshToken;
