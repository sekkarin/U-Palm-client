import { ICategory } from "./category.interface";
import { ISupplier } from "./supplier.interface";
export interface ProductVariant {
  name: string;
  value: string;
  variation_id:string | undefined
}

export interface Item {
  product_item_id:string;
  base_price: string;
  discount: string;
  shipping: string;
  profit: string;
  qty_discount: string;
  qty_in_stock: string;
  selling_price : string | undefined ;
  variations: ProductVariant[];
  [key: string]: string | ProductVariant[] | undefined;
}

export interface IProduct {
  supplier_name: string;
  name: string;
  description: string;
  product_image: string[]; // Array of image URLs
  image_banner_adverting: string; // Single image URL
  category_id: ICategory; // Nested interface for category
  supplier_id: ISupplier; // Nested interface for supplier
  items: Item[];
  createdAt: string;
  product_id: string | undefined;
}