import axios from "axios";

export const baseUrl = import.meta.env.VITE_BASE_URL;

const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : "";
export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
});

export const getConfig = () => {
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : "";

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
};
