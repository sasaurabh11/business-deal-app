import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${baseURL}/api/v1/user/login`, data);
        return response.data;
    } catch (error) {
        console.error('error in addUser API', error.message)
        return error.response.data;
    }
}

export const signupUser = async (data) => {
    try {
        const response = await axios.post(`${baseURL}/api/v1/user/signup`, data);
        return response.data;
    } catch (error) {
        console.error('error in addUser API', error.message)
        return error.response.data;
    }
}
