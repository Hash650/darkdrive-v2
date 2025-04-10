import { useState } from "react";
import { uploadFile } from "../api/transfer.js";
import KeyModal from "./KeyModal.jsx";

const FileUpload = ({ setFilesList }) => {
	const [dragActive, setDragActive] = useState(false); // Dragging state.
	const [files, setFiles] = useState([]); // Files to be uploaded.
	const [uploadStatus, setUploadStatus] = useState(""); // Upload status state.
	const [showModal, setShowModal] = useState(false); // Show modal or not.

	/* The next 3 functions are handlers for the drag and drop feature. */
	/**
	 * Handles dragging and dropping files into the upload area.
	 *
	 * @param {Event} - Dragging event.
	 */
	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(e.type === "dragenter" || e.type === "dragover");
	};

	/**
	 * Handles the file dropping event.
	 *
	 * @param {Event} e - Dragging event.
	 */
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false); // Stop dragging.

		// Set new files if there are new files.
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const newFiles = Array.from(e.dataTransfer.files);
			setFiles((prev) => [...prev, ...newFiles]);
		}
	};

	/**
	 * Handles change event, setting of new files.
	 *
	 * @param {Event} e - Change event.
	 */
	const handleChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const newFiles = Array.from(e.target.files);
			setFiles((prev) => [...prev, ...newFiles]);
		}
	};

	/**
	 * Handles file upload.
	 *
	 * @param {string} password - Empty string if lockEnabled is false.
	 * @param {boolean} lockEnabled - True if user wants to lock the file.
	 */
	const handleUpload = async (password) => {
		// Check if there is a file to upload.
		if (files.length === 0) {
			alert("Please select files to upload!");
			return;
		}

		setUploadStatus("Uploading..."); // Change upload status

		try {
			// Send a call to the backend to upload a file.
			const response = await uploadFile(files[0], password);
			console.log(response);

			// no idea lol
			setFilesList((prevFiles) => [...prevFiles, response]);

			// If file is uploaded, show it.
			setTimeout(() => {
				setUploadStatus("Uploaded!");
				setTimeout(() => setUploadStatus(""), 2000);
			}, 0);

			setUploadStatus("Uploading...");

			setFiles([]); // Clear files after uploading.
			setShowModal(false); // Close the modal if upload was successful.
		} catch (err) {
			setUploadStatus(err.message);
			setTimeout(() => setUploadStatus(""), 2000);
		}
	};

	return (
		<>
			{showModal && (
				<KeyModal
					text='Choose how to upload your files.'
					filename={files[0].name}
					checkbox={true}
					closeModal={() => setShowModal(false)}
					onSubmit={(password) => handleUpload(password)}
					uploadStatus={uploadStatus}
				/>
			)}
			<div className='bg-primary p-8 h-full flex flex-col flex-1'>
				<div className='h-full flex flex-grow flex-col'>
					<div
						className={`${dragActive ? "bg-primary" : "bg-primary/50"}
						border-tertiary border-2 p-8 flex text-center items-center justify-center border-dashed flex-grow rounded-lg transition-colors duration-200
					`}
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
					>
						<div className='flex flex-col items-center justify-center space-y-4'>
							<p className='text-lg text-tertiary'>Drag and drop your files here, or</p>
							<label className='px-4 py-2 bg-accent hover:bg-highlight text-primary rounded-md cursor-pointer transition-colors duration-200'>
								Browse Files
								<input type='file' className='hidden' multiple onChange={handleChange} />
							</label>
							<p className='text-sm text-gray-400'>Supported files: All file types accepted</p>
						</div>
					</div>

					{/* Selected Files List */}
					{files.length > 0 && (
						<div className='mt-8'>
							<h3 className='text-xl font-semibold text-white mb-4'>Selected Files</h3>
							<div className='space-y-2'>
								{files.map((file, index) => (
									<div
										key={index}
										className='bg-gray-800 p-3 rounded-lg flex items-center justify-between'
									>
										<span className='text-gray-300'>{file.name}</span>
										<span className='text-gray-400 text-sm'>
											{(file.size / 1024).toFixed(2)} KB
										</span>
									</div>
								))}
							</div>

							<button onClick={() => setShowModal(true)} className='mt-4 w-full'>
								Upload Files
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default FileUpload;
