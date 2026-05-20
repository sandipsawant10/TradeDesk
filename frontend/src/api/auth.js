import api from "./axios.js";

export const authApi = {
  register: (payload) =>
    api.post("/auth/register", payload).then((r) => r.data),
  login: (payload) => api.post("/auth/login", payload).then((r) => r.data),
  getMe: () => api.get("/auth/me").then((r) => r.data),
  getAllUsers: () => api.get("/auth/users").then((r) => r.data),
};
