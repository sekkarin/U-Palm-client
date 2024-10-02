import { AxiosError } from "axios";
import { useAppDispatch } from "../hook";
import { logout } from "../features/auth/authSlice";
import useAxiosAuth from "./useAxiosAuth";
import { Cart } from "@/interfaces/cart.interface";
import { clearCart, initialCart } from "../features/cart/cartSlice";

const useCart = () => {
  const dispatch = useAppDispatch();
  const axiosAuth = useAxiosAuth()


  const fetchCart = async () => {
    try {
      const { data } = await axiosAuth.get<Cart[]>("/carts/");
      dispatch(clearCart())
      const itemCart = data.map((item) => item.items).flat();
      itemCart.map((item) =>
        dispatch(
          initialCart({
            product_item_id: item.product_item_id,
            qty: item.qty,
            variation_id: item.variation_id,
            product_id: item.product_id,
            cart_item_id: item.cart_item_id
          })
        )
      );

    
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        dispatch(logout());
        // Cookies.remove("refresh_token");
        // navigate("/session-expired");
      }
      return null;
    }
  };
  return fetchCart;
};

export default useCart;
