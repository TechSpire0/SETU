// src/services/apiClient.js

import axios from "axios";

const apiClient = axios.create({
  // CORRECTED: The baseURL should point to the API root that the
  // backend endpoints are relative to. In this case, it's just '/api'.
  baseURL: "http://localhost:8000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
