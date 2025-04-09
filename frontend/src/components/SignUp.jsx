import React, { useState } from "react";
import { signupUser } from "../api/auth";
import VerificationModal from "./VerificationModal";
import "./SignUpPage.css"; // Import the CSS

const SignUpPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        const hasUpperCase = /[A-Z]/.test(formData.password);
        const hasLowerCase = /[a-z]/.test(formData.password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

        if (!hasUpperCase || !hasLowerCase || !hasSymbol) {
            setError(
                "Password must contain at least one uppercase letter, one lowercase letter, and one symbol."
            );
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const result = await signupUser(formData);
            console.log(result);

            if (!result.success) {
                setError(result.error);
            }
            setShowModal(true);

            setTimeout(() => {
                setShowModal(false);
            }, 10000);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form
                className={`flex flex-col gap-8 bg-primary/40 backdrop-blur-sm p-8 rounded-xl w-[90%] max-w-[425px] border-[1px] border-white/40 ${
                    showModal && "blur-2xl"
                }`}
                onSubmit={handleSubmit}
            >
                <h2 className="font-bold">Register</h2>
                <hr />
                <span className="flex flex-col gap-2">
                    <label>Username</label>
                    <input
                        placeholder="enter your username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-800 text-white border border-gray-600"
                    />
                </span>
                <span className="flex flex-col gap-2">
                    <label>Email</label>
                    <input
                        placeholder="example@email.com"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-800 text-white border border-gray-600"
                    />
                </span>
                <span className="flex flex-col gap-2">
                    <label>Password</label>
                    <input
                        placeholder="••••••••••"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-800 text-white border border-gray-600"
                    />
                </span>
                <span className="flex flex-col gap-2">
                    <label>Confirm Password</label>
                    <input
                        placeholder="••••••••••"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="p-2 rounded bg-gray-800 text-white border border-gray-600"
                    />
                </span>
                <div className="text-white/50 text-sm">
                    Password must:
                    <ul className="list-disc pl-4">
                        <li>be at least 8 characters long.</li>
                        <li>contain at least 1 lowercase letter.</li>
                        <li>contain at least 1 uppercase letter.</li>
                        <li>contain at least 1 special character (!, @, #, etc.).</li>
                    </ul>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`relative p-2 rounded font-semibold text-black bg-yellow-300 hover:bg-yellow-400 transition-colors ${
                        loading ? "loading-glimmer" : ""
                    }`}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
            {showModal && <VerificationModal />}
        </>
    );
};

export default SignUpPage;