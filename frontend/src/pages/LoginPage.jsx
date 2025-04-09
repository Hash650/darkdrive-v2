import SignUpPage from "../components/SignUp";
import Login from "../components/Login";
import { useState } from "react";

const LoginPage = () => {
	const [signUp, setSignUp] = useState(true);

	const toggleSignUp = () => {
		setSignUp((prev) => !prev);
	};

	return (
		<section className='flex flex-col gap-4 items-center justify-center py-16'>
			{signUp ? (
				<>
					<SignUpPage />
					<span className='flex gap-1 pt-6'>
						<p>Already Registered?</p>
						<button
							onClick={() => toggleSignUp()}
							className='p-0 bg-transparent text-accent underline'
						>
							Login
						</button>
					</span>
				</>
			) : (
				<>
					<Login />
					<span className='flex gap-1 pt-6'>
						<p>New User?</p>
						<button
							onClick={() => toggleSignUp()}
							className='p-0 bg-transparent text-accent underline'
						>
							Register Now
						</button>
					</span>
				</>
			)}
		</section>
	);
};

export default LoginPage;
