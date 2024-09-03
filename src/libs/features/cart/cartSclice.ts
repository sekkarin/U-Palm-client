import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductItem {
  item: string;
  variant_id: string;
}

interface CartItem {
  product_item_id: string;  // Unique identifier for the product item
  qty: number;
  productItems: ProductItem[]; // Array of product variants
}

interface CartState {
  shopping_cart_id: string | null;
  product_id: string;
  items: CartItem[];
}

const initialState: CartState = {
  shopping_cart_id: null,
  product_id: "",
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart: (state, action: PayloadAction<CartItem>) => {
        const { product_item_id, qty, productItems } = action.payload;
        const newVariant = productItems[0]; // Assumes adding a single variant
  
        const itemIndex = state.items.findIndex(
          (item) => item.product_item_id === product_item_id
        );
  
        if (itemIndex !== -1) {
          // The product is already in the cart; now check for the variant_id
          const variantIndex = state.items[itemIndex].productItems.findIndex(
            (variant) => variant.variant_id === newVariant.variant_id
          );
  
          if (variantIndex !== -1) {
            // Variant already exists, update its quantity
            state.items[itemIndex].qty += qty; // Update the overall quantity
          } else {
            // Variant does not exist, add the new variant to the productItems array
            state.items[itemIndex].productItems.push(newVariant);
            state.items[itemIndex].qty += qty; // Increase overall quantity
          }
        } else {
          // Product does not exist in the cart, add it along with its variant
          state.items.push(action.payload);
        }
      },
    removeCart: (state, action: PayloadAction<string>) => {
      // Remove item based on product_item_id
      state.items = state.items.filter(
        (item) => item.product_item_id !== action.payload
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ product_item_id: string; qty: number }>
    ) => {
      const itemIndex = state.items.findIndex(
        (item) => item.product_item_id === action.payload.product_item_id
      );

      if (itemIndex !== -1) {
        state.items[itemIndex].qty = action.payload.qty;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addCart, removeCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
