import { Link } from "react-router-dom";
import LandingImage from "/LandingImage.jpg";
import Card from "../components/Card";

const Home = () => {
	return (
		<>
			<span
				style={{ backgroundImage: `url(${LandingImage})` }}
				className='flex bg-cover bg-center h-[44rem] items-center'
			>
				<h4 className='text-black font-bold text-center text-8xl sm:text-[14rem] w-full font-display'>
					DARK DRIVE
				</h4>
			</span>
			<section className='grid md:grid-cols-2 items-center justify-center gap-8 py-8'>
				<aside className='flex flex-col items-center justify-center p-8'>
					<div className='flex flex-col gap-8 rounded-3xl p-8 py-12 backdrop-blur-sm'>
						<h1 className='text-accent'>What is DarkDrive?</h1>
						<p className='text-lg'>
							DarkDrive is a decentralized file-sharing system that lets you upload and download
							files securely across a peer-to-peer network. With no central servers, it’s resilient,
							private, and nearly impossible to take down. Share and access files freely—without
							restrictions or censorship. <br />
							<br />
							DarkDrive is built for speed, security, and complete freedom. With end-to-end
							encryption and a distributed network, your files stay safe and accessible anytime. No
							limits, no gatekeepers—just pure, decentralized sharing
						</p>
					</div>
				</aside>
				<aside className='flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2 gap-8 items-center justify-center w-full'>
					<Card
						icon='fa-solid fa-upload'
						heading='Seamless Secure Upload'
						paragraph='Easily upload files through a secure, user-friendly interface with a focus on data integrity.'
					/>
					<Card
						icon='fa-solid fa-lock'
						heading='Redundant Encryption'
						paragraph='Each file is encrypted with a unique key, ensuring maximum security and protection.'
					/>
					<Card
						icon='fa-solid fa-database'
						heading='Secure Storage'
						paragraph='Encrypted files are safely stored, while plaintext versions are immediately erased.'
					/>
					<Card
						icon='fa-solid fa-key'
						heading='Full Access Control'
						paragraph='Users receive an encryption key and token, maintaining full control over their files.'
					/>
				</aside>
			</section>
		</>
	);
};

export default Home;
