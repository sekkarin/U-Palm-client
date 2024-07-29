import api from "@/services/api";

export async function getProduct() {
  const res = await api.get("/products/");
  if (res.status != 200) return undefined;
  return res.data;
}
