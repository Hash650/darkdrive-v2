import { useRef, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/files";

const KeyModal = ({ text, onSubmit, file, checkbox }) => {
	const inputRef = useRef();
	const [downloadError, setDownloadError] = useState("");
	const [showInput, setShowInput] = useState(false);

	const downloadFile = async (fileId) => {
		// console.log(localStorage.getItem("key"));
		try {
			const response = await axios.get(`${API_URL}/download/${fileId}`, {
				params: {
					password: inputRef.current.value,
					locked: false
				},
				responseType: "blob",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("userToken")}`, // JWT for auth
				} // Important! Treat response as binary data
			});


			// Create a Blob from the response data
			const blob = new Blob([response.data], { type: "application/octet-stream" });

			// Create a download link and click it
			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.setAttribute("download", file.fileName); // Change filename accordingly
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // Cleanup
			onSubmit();


		} catch (err) { // in this case the user entered the wrong pass
			setDownloadError("Download failed, please check password.")

		}
	};

	return (
		<div className='absolute w-full h-full flex items-center justify-center'>
			<div className="bg-primary flex flex-col items-center justify-center p-8 gap-8 rounded-3xl w-fit h-fit">
			<h2>{text}</h2>
			{checkbox && <div className="w-full items-start"><input name="lock" type="checkbox" checked={showInput} onChange={(e) => setShowInput(e.target.checked)} /><label>Lock this file</label></div>}
			{checkbox ? showInput && <input ref={inputRef} placeholder="Enter password" className='w-full' /> : <input ref={inputRef} placeholder="Enter password" className='w-full' />}
			<span className='flex w-full justify-between'>
				<button onClick={() => onSubmit(onSubmit())} className='bg-white/50'>
					Cancel
				</button>
				<button
					onClick={() => {
						downloadFile(file.id);
					}}
				>
					Send
				</button>
			</span>
			{downloadError && <p className="text-red-500 text-sm">{downloadError}</p>}
			</div>
		</div>
	);
};

export default KeyModal;
