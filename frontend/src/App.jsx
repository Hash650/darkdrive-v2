import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import MainLayout from "./components/MainLayout";

const App = () => {
	return (
		<Router>
			<MainLayout>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/user' element={<Dashboard />} />
					<Route path='/admin' element={<Admin />} />
				</Routes>
			</MainLayout>
		</Router>
	);
};

export default App;
