import api from "@/services/api";

export async function getProducts() {
  const res = await api.get("/products/?limit=8");
  if (res.status != 200) return undefined;
  return res.data;
}
export async function getProduct(id:string) {
  const res = await api.get(`/products/${id}`);
  if (res.status != 200) return undefined;
  return res.data;
}
export async function getSupplier() {
  const res = await api.get("/suppliers/?limit=8");
  if (res.status != 200) return undefined;
  return res.data.data;
}
