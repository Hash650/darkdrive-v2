import axios from "axios";

const FILE_API_URL = import.meta.env.VITE_FILE_API_URL;
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

const fileEndPoint = "http://localhost:8080/api/files";

export const uploadFile = async (file, password) => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("password", password);

	const response = await axios.post(`${fileEndPoint}/upload`, formData, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem("userToken")}`,
		},
	});

	if (response.status !== 200) {
		throw new Error("Upload failed");
	}

	return response.data;
};
