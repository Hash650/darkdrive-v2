import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
	return (
		<div className='min-h-screen flex flex-col'>
			{/* Header */}
			<Navbar />

			{/* Main Content */}
			<main className='relative flex flex-col flex-grow'>{children}</main>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default MainLayout;
