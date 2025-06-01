// src/scripts/data/api.js
import CONFIG from "../config";
import { getToken, setToken } from "./auth-helper"; // Import setToken dan getToken

const API_BASE_URL = CONFIG.BASE_URL;

const ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/register`,
  LOGIN: `${API_BASE_URL}/login`,
  ADD_STORY: `${API_BASE_URL}/stories`,
  ADD_STORY_GUEST: `${API_BASE_URL}/stories/guest`,
  GET_ALL_STORIES: `${API_BASE_URL}/stories`,
  GET_DETAIL_STORY: (id) => `${API_BASE_URL}/stories/${id}`,
};

export async function registerUser({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
}

export async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!data.error) {
    setToken(data.loginResult.token); // Menggunakan setToken dari auth-helper
  }
  return data;
}

export async function addStory({
  description,
  photo,
  lat = null,
  lon = null,
  token = null,
}) {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (lat !== null) formData.append("lat", lat);
  if (lon !== null) formData.append("lon", lon);

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    const storedToken = getToken(); // Menggunakan getToken dari auth-helper
    if (storedToken) {
      headers["Authorization"] = `Bearer ${storedToken}`;
    }
  }

  const endpoint = token ? ENDPOINTS.ADD_STORY : ENDPOINTS.ADD_STORY_GUEST;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: formData,
  });
  return response.json();
}

export async function getAllStories({
  page = 1,
  size = 10,
  location = 0,
  token = null,
}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  params.append("location", location);

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    const storedToken = getToken(); // Menggunakan getToken dari auth-helper
    if (storedToken) {
      headers["Authorization"] = `Bearer ${storedToken}`;
    }
  }

  const response = await fetch(
    `${ENDPOINTS.GET_ALL_STORIES}?${params.toString()}`,
    {
      method: "GET",
      headers: headers,
    }
  );
  return response.json();
}

export async function getDetailStory(id, token = null) {
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    const storedToken = getToken(); // Menggunakan getToken dari auth-helper
    if (storedToken) {
      headers["Authorization"] = `Bearer ${storedToken}`;
    }
  }

  const response = await fetch(ENDPOINTS.GET_DETAIL_STORY(id), {
    method: "GET",
    headers: headers,
  });
  return response.json();
}
