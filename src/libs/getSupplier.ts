import api from "@/services/api";

export async function getSupplierAndProducts(id: string) {
  const res = await api.get(`/suppliers/${id}/products`);
  if (res.status != 200) return undefined;
  return res.data;
}
