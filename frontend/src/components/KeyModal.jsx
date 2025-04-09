import { useRef, useState } from "react";

const KeyModal = ({ text, closeModal, onSubmit, checkbox, onPasswordEnter }) => {
	const inputRef = useRef();
	const [showInput, setShowInput] = useState(false);
	const [downloadError, setDownloadError] = useState("");

	// Function to set error message from parent
	const setError = (message) => {
		setDownloadError(message);
	};

	return (
		<div className='absolute w-full h-full flex items-center justify-center'>
			<div className='bg-primary flex flex-col items-center justify-center p-8 gap-8 rounded-3xl w-fit h-fit'>
				<h2>{text}</h2>
				{checkbox && (
					<div className='w-full items-start'>
						<input
							name='lock'
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
				<span className='flex w-full justify-between'>
					<button onClick={closeModal} className='bg-white/50'>
						Cancel
					</button>
					<button onClick={() => onSubmit(inputRef.current.value)}>Send</button>
				</span>
				{downloadError && <p className='text-red-500 text-sm'>{downloadError}</p>}
			</div>
		</div>
	);
};

export default KeyModal;
