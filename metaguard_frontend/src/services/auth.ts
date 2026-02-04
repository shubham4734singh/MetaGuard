import api from "./api";

export async function login(username: string, password: string) {
  const res = await api.post("/api/auth/login/", {
    username,
    password,
  });

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
}

export async function signup(email: string, password: string) {
  const res = await api.post("/api/auth/signup/", {
    email: email,
    password: password,
  });

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
}

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/api/auth/user/");
    return res.data;
  } catch (error: any) {
    // If no token exists, 401 is expected
    if (error.response?.status === 401 && !localStorage.getItem("access")) {
      return null;
    }
    throw error;
  }
};

export const getProfile = async () => {
  const res = await api.get("/api/auth/profile/");
  return res.data;
};

export const updateProfile = async (data: { display_name?: string; organization?: string }) => {
  const res = await api.patch("/api/auth/profile/", data);
  return res.data;
};

export const deleteAccount = async () => {
  await api.delete("/api/auth/delete/");
};
