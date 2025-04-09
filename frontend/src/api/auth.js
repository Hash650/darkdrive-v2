// auth.js
import axios from "axios";


const API_URL = "http://localhost:8080/auth"

export const logout = () => {
	localStorage.removeItem("userToken");
};

export const getToken = () => {
	return localStorage.getItem("userToken");
};

export const isAuthenticated = () => {
	return !!localStorage.getItem("userToken");
};

axios.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const loginUser = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/login`, userData);
		// Save token to localStorage if login successful
		if (response.data) {
			localStorage.setItem("userToken", response.data);
		}
		return response.data;
	} catch (err) {
		throw err.response.data;
	}
};

export const signupUser = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/register`, userData);
		return response.data;
	} catch (err) {
		throw err.response.data;
	}
};
