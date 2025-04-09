import axios from "axios";

const FILE_API_URL = import.meta.env.VITE_FILE_API_URL;
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

// const fileNameEndpoint = `${AUTH_API_URL}/users/upload/`;
const fileNameEndpoint = `http://127.0.0.1:8000/users/upload/`;
// const uploadEndpoint = `${FILE_API_URL}/upload/`;
const uploadEndpoint = `http://127.0.0.1:8001/upload/${localStorage.getItem("email")}`;

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

export const uploadFiles = async (files) => {
	try {
		const results = [];

		for (const file of files) {
			console.log(file.name);

			// sendFileName(file.name);
			const formData = new FormData();
			formData.append("file", file);

			// Use axios to upload the file
			const response = await axios.post(uploadEndpoint, formData, {
				headers: {
					"Content-Type": "multipart/form-data", // Specify the content type for file upload
				},
			});

			alert(`Encryption Key: ${response.data.encryption_key}`);
			sessionStorage.setItem("encKey", response.data.encryption_key);
			console.log(response);

			if (response.status !== 200) {
				throw new Error(`Upload failed for ${file.name}`);
			}

			// Once the file is uploaded, send just the file name to the fileNameEndpoint
			const uploadUrl = `${fileNameEndpoint}${encodeURIComponent(localStorage.getItem("email"))}`;

			const response2 = await axios.post(uploadUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response2.status !== 200) {
				throw new Error(`Failed to send file name for ${file.name}`);
			}

			results.push({
				fileName: file.name,
				success: true,
			});
		}

		return {
			success: true,
			message: "All files uploaded and file names sent successfully",
			results,
		};
	} catch (error) {
		console.error("Upload error:", error);
		return {
			success: false,
			message: error.message,
			error,
		};
	}
};
