import { ICategory } from "./category.interface";
import { ISupplier } from "./supplier.interface";
export type ProductVariant = {
  name: string;
  value: string;
};
export type Item = {
  base_price: string;
  discount: string;
  shipping: string;
  profit: string;
  qty_discount: string;
  qty_in_stock: string;
  selling_price?: number;
  variations: ProductVariant[];
  [key: string]: string | ProductVariant[]; // Index signature allowing any string key
};
export interface IProduct {
  name: string;
  description: string;
  product_image: string[]; // Array of image URLs
  image_banner_adverting: string; // Single image URL
  category_id: ICategory; // Nested interface for category
  supplier_id: ISupplier; // Nested interface for supplier
  items: Item[]; // Array of items (can be replaced with specific item type if known)
  createdAt: string;
  product_id: string;
}