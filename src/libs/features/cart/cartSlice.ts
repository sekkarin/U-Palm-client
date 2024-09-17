import { CartItem } from "@/interfaces/cart.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem: (state, action: PayloadAction<CartItem>) => { 
      const { product_item_id, variation_id, qty } = action.payload;
     
      const existingCartItem = state.items.find(
        (item) =>
          item.product_item_id === product_item_id &&
          item.variation_id === variation_id
      );
      
      if (existingCartItem) {
        // ถ้าสินค้ามีอยู่แล้วในตะกร้า, เพิ่มจำนวน qty
        existingCartItem.qty += qty;
      } else {
        // ถ้ายังไม่มีสินค้าในตะกร้า, เพิ่มรายการใหม่
        state.items.push(action.payload);
      }
    },
    removeCartItem: (state, action: PayloadAction<{ product_item_id: string; variation_id: string }>) => {
      const { product_item_id, variation_id } = action.payload;
      state.items = state.items.filter(
        (item) =>
          item.product_item_id !== product_item_id ||
          item.variation_id !== variation_id
      );
    },
    updateCartItemQty: (
      state,
      action: PayloadAction<{ product_item_id: string; variation_id: string; qty: number }>
    ) => {
      const { product_item_id, variation_id, qty } = action.payload;
      const existingCartItem = state.items.find(
        (item) =>
          item.product_item_id === product_item_id &&
          item.variation_id === variation_id
      );

      if (existingCartItem) {
        existingCartItem.qty = qty; // อัปเดตจำนวนของสินค้า
      }
    },
    clearCart: (state) => {
      state.items = []; // ลบสินค้าในตะกร้าทั้งหมด
    },
    initialCart : (state, action: PayloadAction<CartItem>) =>{
      const { product_item_id, variation_id, qty } = action.payload;
     
      const existingCartItem = state.items.find(
        (item) =>
          item.product_item_id === product_item_id &&
          item.variation_id === variation_id 
      );
   
      
      if (existingCartItem) {
        // ถ้าสินค้ามีอยู่แล้วในตะกร้า, เพิ่มจำนวน qty
        existingCartItem.qty = qty;
      } else {
        // ถ้ายังไม่มีสินค้าในตะกร้า, เพิ่มรายการใหม่
        state.items.push(action.payload);
      }
    }
  },
});

export const { addCartItem, removeCartItem, updateCartItemQty, clearCart,initialCart } = cartSlice.actions;
export default cartSlice.reducer;
