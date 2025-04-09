import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


const Navbar = () => {
	const MOBILE_WIDTH = 768;
	const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < MOBILE_WIDTH;
			setIsMobile(mobile);
			if (!mobile) {
				setMenuOpen(false); // Close the menu on larger screens

			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Login", path: "/login" },
	];

	// Function to handle opening and closing the menu
	const handleMenuToggle = () => {
		if (menuOpen) {
			// If the menu is open, close it with an animation
			setMenuOpen(false); // We'll rely on the exit animation to finish first
		} else {
			// If the menu is closed, open it immediately
			setMenuOpen(true);
		}
	};

	return (
		<>
			<nav className='z-10'>
				<Link to='/'>
					<h1 className='font-display'>Dark Drive</h1>
				</Link>
				{isMobile ? (
					<button
						onClick={handleMenuToggle} // Trigger menu toggle

						className='focus:outline-none rounded-none py-8'
					>
						{menuOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				) : (
					<ul>
						{navLinks.map((link) => (
							<Link
								key={link.name}
								to={link.path}
								className={`navLink ${
									link.name === "Login" && "h-4 px-4 bg-accent text-primary hover:bg-highlight"
								}`}
							>
								{link.name}
							</Link>
						))}
					</ul>
				)}
			</nav>

			{/* Menu rendering when mobile and open */}
			{isMobile && (
				<AnimatePresence>
					{menuOpen && (
						<motion.ul
							initial={{ y: -200 }}
							animate={{ y: 0 }}
							exit={{ y: -200 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className='absolute top-22 left-0 w-full bg-primary'
						>
							{navLinks.map((link) => (
								<motion.li key={link.name}>
									<Link
										to={link.path}
										className={`p-8 flex flex-col items-center justify-center text-xl ${
											link.name === "Login" && "bg-accent text-primary"
										}`}
										onClick={() => setMenuOpen(false)} // Optionally close menu when a link is clicked
									>
										{link.name}
									</Link>
								</motion.li>
							))}
						</motion.ul>
					)}
				</AnimatePresence>

			)}
		</>
	);
};

export default Navbar;
