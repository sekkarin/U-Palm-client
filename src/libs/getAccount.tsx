import api, { axiosPrivate } from "@/services/api";

export async function getAccount() {
  const res = await api.get("/auth/profile");
  console.log(res.data);

  if (res.status != 200) return undefined;
  return res.data;
}
