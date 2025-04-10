import { useRef, useState } from "react";

const KeyModal = ({ text, filename, closeModal, onSubmit, checkbox, uploadStatus = "" }) => {
	const inputRef = useRef();
	const boxRef = useRef();
	const [showInput, setShowInput] = useState(false);
	const [error, setError] = useState("");

	/**
	 * Handles the pressing of the submit button.
	 *
	 * @param {Event} e - Button click event.
	 */
	const handleSubmit = () => {
		const password = inputRef.current?.value || ""; // Clear password if the file isn't locked.

		// If lock file is checked and password is empty, show an error.
		if (showInput && password === "") {
			setError("Enter a password if you want to lock the file!");
			setTimeout(() => setError(""), 5000);
			return;
		}

		onSubmit(password); // Call the parent's submit function.
	};

	return (
		<div className='absolute w-full h-full flex items-center justify-center backdrop-blur-sm'>
			<div className='bg-primary flex flex-col items-center justify-center p-8 gap-8 rounded-3xl w-fit h-fit'>
				<h2>{text}</h2>
				<h2>{filename}</h2>
				{checkbox && (
					<div className='w-full items-start'>
						<input
							ref={boxRef}
							type='checkbox'
							checked={showInput}
							onChange={(e) => setShowInput(e.target.checked)}
						/>
						<label>Lock this file</label>
					</div>
				)}
				{checkbox ? (
					showInput && <input ref={inputRef} placeholder='Enter password' className='w-full' />
				) : (
					<input ref={inputRef} placeholder='Enter password' className='w-full' />
				)}
				{error != "" && (
					<p className='text-red-500'>Enter a password if you want to lock the file!</p>
				)}
				<span className='flex w-full justify-between'>
					<button onClick={closeModal} className='bg-white/50'>
						Cancel
					</button>
					<button onClick={handleSubmit}>Send</button>
				</span>
				{uploadStatus !== "" && (
					<div
						className={`w-full p-3 rounded-lg ${
							uploadStatus.includes("failed") || uploadStatus.includes("Error")
								? "bg-red-900/50 text-red-200"
								: "bg-blue-900/50 text-blue-200"
						}`}
					>
						{uploadStatus}
					</div>
				)}
			</div>
		</div>
	);
};

export default KeyModal;
