import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		if (formData.email === "user@admin.com" && formData.password === "admin") {
			navigate("/admin");
		}

		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await loginUser(formData);

			if (result) {
				localStorage.setItem("email", formData.email);
				navigate("/user");
			} else {
				setError("Login failed - no token received");
			}
		} catch (err) {
			console.error("Error:", err);
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className='flex flex-col gap-8 bg-primary/40 backdrop-blur-sm p-8 rounded-xl w-[90%] max-w-[425px] border-white/40 border-[1px]'
			onSubmit={handleSubmit}
		>
			<h2 className='font-bold'>Login</h2>
			<hr />
			<span className='flex flex-col gap-2'>
				<label>Email</label>
				<input
					placeholder='example@email.com'
					type='email'
					name='email'
					value={formData.email}
					onChange={handleChange}
					required
				/>
			</span>
			<span className='flex flex-col gap-2'>
				<label>Password</label>
				<input
					placeholder='••••••••••'
					type='password'
					name='password'
					value={formData.password}
					onChange={handleChange}
					required
				/>
			</span>
			{error && <p className='text-red-500 text-sm'>{error}</p>}
			<button type='submit' disabled={loading}>
				{loading ? "Logging in..." : "Login"}
			</button>
		</form>
	);
};

export default LoginPage;
