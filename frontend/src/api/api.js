import axios from "axios";

// Set the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance with default settings
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;