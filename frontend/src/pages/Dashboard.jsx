import { useState, useEffect } from "react";
import axios from "axios";
import KeyModal from "../components/KeyModal";
import FileUpload from "../components/FileUpload";
import { Download, Lock, Trash2 } from "lucide-react";

const Dashboard = () => {
	const [files, setFiles] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);
	const [showKeyModal, setShowKeyModal] = useState(false);
	const [downloadError, setDownloadError] = useState("");
	const [lockEnabled, setLockEnabled] = useState(false);

	const fileEndPoint = "http://localhost:8080/api/files";
	const API_URL = "http://localhost:8080/api/files";

	const handleDelete = async (file) => {
		try {
			const response = await axios.delete(`${fileEndPoint}/${file.id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("userToken")}`,
				},
			});
			console.log(response.data);

			setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
		} catch (err) {
			console.log("Error deleting file: ", err);
		}
	};

	const downloadFile = async (password, lockEnabled) => {
		try {
			const response = await axios.get(`${API_URL}/download/${selectedFile.id}`, {
				params: {
					password: password,
					locked: lockEnabled,
				},
				responseType: "blob",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("userToken")}`, // JWT for auth
				},
			});

			// Create a Blob from the response data
			const blob = new Blob([response.data], { type: "application/octet-stream" });

			// Create a download link and click it
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.setAttribute("download", selectedFile.fileName);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Cleanup

			// Close modal after successful download
			setShowKeyModal(false);
		} catch (err) {
			// in this case the user entered the wrong pass
			setDownloadError("Download failed, please check password.");
		}
	};

	useEffect(() => {
		const getUserFiles = async () => {
			try {
				const response = await axios.get(`${fileEndPoint}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("userToken")}`,
					},
				});

				console.log(response.data);
				setFiles(response.data);
			} catch (err) {
				console.error("Error fetching files: ", err.response?.data || err.message);
			}
		};

		getUserFiles();
	}, []);

	const handleDownloadClick = (file) => {
		setSelectedFile(file);
		setShowKeyModal(true);
	};

	const closeKeyModal = () => {
		setShowKeyModal(false);
		setDownloadError("");
	};

	return (
		<>
			{showKeyModal && (
				<KeyModal
					text='Enter the encryption key'
					checkbox={true}
					showInput={lockEnabled}
					onSubmit={(password, isLocked) => handleUpload(password, isLocked)}
					setShowInput={setLockEnabled}
					closeModal={closeKeyModal}
				/>
			)}
			<main className='flex flex-col md:flex-row md:flex-grow'>
				<section className='flex flex-col flex-grow'>
					<FileUpload setFilesList={setFiles} />
				</section>
				<section className='p-6 w-5/6'>
					<ul className='max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-2 border-gray-700'>
						{files.length > 0 ? (
							files.map((file) => (
								<li
									key={file.id}
									className='flex justify-between bg-white/10 p-2 px-4 rounded-md hover:bg-white/5 transition'
								>
									<p>{file.fileName}</p>
									<div className='flex gap-4'>
										<button
											title='Locked'
											className='w-fit p-0 bg-transparent text-accent underline'
										>
											<Lock />
										</button>
										<button
											title='Download'
											onClick={() => handleDownloadClick(file)}
											className='cursor-pointer w-fit p-0 bg-transparent text-accent underline'
										>
											<Download />
										</button>
										<button
											onClick={() => handleDelete(file)}
											title='Delete'
											className='p-0 bg-transparent text-red-600'
										>
											<Trash2 />
										</button>
									</div>
								</li>
							))
						) : (
							<p className='text-lg font-bold'>Upload and securely store your files.</p>
						)}
					</ul>
				</section>
			</main>
		</>
	);
};

export default Dashboard;
