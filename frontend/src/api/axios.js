import axios from "axios";
import useAuthStore from "../store/authStore";
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

/* =========================
   ATTACH TOKEN
========================= */

API.interceptors.request.use((config) => {

  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // ✅ MUST return config

}, (error) => {
  return Promise.reject(error);
});

export default API;