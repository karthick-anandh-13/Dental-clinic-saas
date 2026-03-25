import { create } from "zustand/";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  clinic: null,

  setAuth: (token, clinic) => {
    localStorage.setItem("token", token);

    set({
      token,
      clinic
    });
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      token: null,
      clinic: null
    });
  }
}));

export default useAuthStore;