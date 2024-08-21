import { ICategory } from "./category.interface";
import { ISupplier } from "./supplier.interface";

export interface IProduct {
  name: string;
  description: string;
  product_image: string[]; // Array of image URLs
  image_banner_adverting: string; // Single image URL
  category_id: ICategory; // Nested interface for category
  supplier_id: ISupplier; // Nested interface for supplier
  items: any[]; // Array of items (can be replaced with specific item type if known)
  createdAt: string;
  product_id: string;
}