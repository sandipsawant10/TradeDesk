import { create } from "zustand";
import { authApi } from "../api/auth";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("token"),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login({ email, password });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true });
    try {
      const res = await authApi.register({ name, email, password, role });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const res = await authApi.getMe();
      set({ user: res.data.user, isAuthenticated: true });
    } catch {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
