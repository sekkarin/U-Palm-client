interface CartVariation {
    variation_id: string;
    name: string;
    value: string;
  }
  
  interface CartProductItem {
    product_item_id: string;
    qty_in_stock: number;
    base_price: number;
    qty_discount: number;
    discount: number;
    shipping: number;
    profit: number;
    selling_price: number;
    variations: CartVariation[];
  }
  
 export interface CartItem {
    _id?: string; // ID ของ CartItem (สำหรับ Redux state)
    product_item_id: string;
    qty: number;
    variation_id: string;
    product?: CartProductItem; // ตัวเลือกสำหรับ ProductItem ที่ถูก populate
  }
  export interface Cart {
    product_item_id: string;
    qty: number;
    _id: string;
    user_id: string;  // ID ของผู้ใช้
    items: CartItem[];  // รายการสินค้าที่อยู่ในตะกร้า
    createdAt: string;  // วันที่สร้าง
    cart_id: string;  // ID ของ Cart
  }
  