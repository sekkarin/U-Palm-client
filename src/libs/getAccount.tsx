import api from "@/services/api";

export async function getAccount() {
  const res = await api.get("/auth/profile");

  if (res.status != 200) return undefined;
  return res.data;
}
