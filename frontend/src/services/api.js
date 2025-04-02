import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/api/v1/user/login`, data);
    return response.data;
  } catch (error) {
    console.error("error in addUser API", error.message);
    return error.response.data;
  }
};

export const signupUser = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/api/v1/user/signup`, data);
    return response.data;
  } catch (error) {
    console.error("error in addUser API", error.message);
    return error.response.data;
  }
};

export const getAllUser = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/v1/user/get-all-user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error in getAllUser API", error.message);
    return error.response.data;
  }
};

//deals
export const getUserDeals = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/v1/deals`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error in getUserDeals API", error.message);
    return error.response.data;
  }
};

export const createDeal = async (dealData) => {
  try {
    const response = await axios.post(`${baseURL}/api/v1/deals/create`, dealData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in createDeal:", error);
    throw error;
  }
};

export const sendMessage = async (messageData) => {
    console.log("messageData", messageData);
  const response = await fetch(`${baseURL}/api/v1/chat/send-msg`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });
  return await response.json();
};

export const getMessages = async (dealId) => {
  const response = await fetch(`${baseURL}/api/v1/chat/${dealId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return await response.json();
};

export const markMessagesAsRead = async (dealId) => {
  const response = await fetch(`${baseURL}/api/v1/chat/mark-read`, {
    method: "PUT",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dealId }),
  });
  return await response.json();
};
