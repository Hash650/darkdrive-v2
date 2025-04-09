import React, { useState, useEffect } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

const AdminDashboard = () => {
	const JUVENTUS_URL = import.meta.env.VITE_JUVENTUS;
	const MILAN_URL = import.meta.env.VITE_MILAN;
	const HASHIR_URL = import.meta.env.VITE_HASHIR;
	const RAYAN_URL = import.meta.env.VITE_RAYAN;
	const HAYYAN_URL = import.meta.env.VITE_HAYYAN;
	const AZURE_URL = import.meta.env.VITE_AZURE;

	// State for metrics and averages
	const [metrics, setMetrics] = useState([]);
	const [averages, setAverages] = useState({
		cpu_usage: 0,
		memory_usage: 0,
		disk_usage: 0,
	});
	const [loading, setLoading] = useState(true);

	// Function to fetch machine metrics
	const getMachineMetrics = async () => {
		const machines = [
			{ id: 1, name: "Ali - 1 (Juventus)", url: JUVENTUS_URL },
			{ id: 2, name: "Ali Nawaz - 2 (Milan)", url: MILAN_URL },
			// { id: 3, name: "Hashir - 1", url: HASHIR_URL },
			{ id: 4, name: "Rayan Kashif - 1 (DataBase Store)", url: RAYAN_URL },
			{ id: 5, name: "Hayyan1", url: HAYYAN_URL },
			{ id: 6, name: "Azure", url: AZURE_URL },
		];

		try {
			const responses = await Promise.all(
				machines.map(async (machine) => {
					try {
						const res = await fetch(machine.url);
						if (!res.ok) {
							throw new Error(`Failed to fetch data for ${machine.name}`);
						}
						const data = await res.json();

						return {
							machine: machine.name,
							hostname: machine.name, // For MachineCard component
							metrics: {
								cpu_usage_percent: parseFloat(data.cpu.cpu_usage_percent || 0),
								memory_usage_percent: parseFloat(data.memory.memory_usage_percent || 0),
								disk_usage_percent: parseFloat(data.disk.disk_usage_percent || 0),
							},
						};
					} catch (error) {
						console.error(`Error fetching data for ${machine.name}:`, error);
						// Return null so we can filter out offline machines
						return null;
					}
				})
			);

			// Filter out any machines that failed to load
			return responses.filter((response) => response !== null);
		} catch (error) {
			console.error("Error fetching machine metrics:", error);
			return [];
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const fetchedMetrics = await getMachineMetrics();

			if (fetchedMetrics && fetchedMetrics.length > 0) {
				setMetrics(fetchedMetrics);

				// Calculate averages based on only the online machines
				const cpuUsage =
					fetchedMetrics.reduce(
						(acc, machine) => acc + (machine.metrics.cpu_usage_percent || 0),
						0
					) / fetchedMetrics.length;

				const memoryUsage =
					fetchedMetrics.reduce(
						(acc, machine) => acc + (machine.metrics.memory_usage_percent || 0),
						0
					) / fetchedMetrics.length;

				const diskUsage =
					fetchedMetrics.reduce(
						(acc, machine) => acc + (machine.metrics.disk_usage_percent || 0),
						0
					) / fetchedMetrics.length;

				setAverages({
					cpu_usage: cpuUsage,
					memory_usage: memoryUsage,
					disk_usage: diskUsage,
				});
			} else {
				// Optionally handle the case where no machines responded
				setMetrics([]);
				setAverages({
					cpu_usage: 0,
					memory_usage: 0,
					disk_usage: 0,
				});
			}
			setLoading(false);
		};

		fetchData();

		// Set up polling every 30 seconds
		const interval = setInterval(fetchData, 4000);
		return () => clearInterval(interval);
	}, []);

	// CPU Chart Data
	const cpuChartData = {
		labels: metrics.map((machine) => machine.machine),
		datasets: [
			{
				label: "CPU Usage (%)",
				data: metrics.map((machine) => machine.metrics.cpu_usage_percent),
				fill: true,
				backgroundColor: "rgba(255, 99, 132, 0.2)",
				borderColor: "rgb(255, 99, 132)",
				tension: 0.4,
			},
		],
	};

	// Disk Chart Data
	const diskChartData = {
		labels: ["Used", "Free"],
		datasets: [
			{
				data: [averages.disk_usage, 100 - averages.disk_usage],
				backgroundColor: ["#ff6347", "#28a745"],
				borderColor: ["#ff6347", "#28a745"],
				borderWidth: 1,
			},
		],
	};

	// Chart Options for CPU
	const cpuChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				labels: {
					color: "white",
					font: {
						size: 12,
					},
				},
			},
			title: {
				display: true,
				text: "CPU Load Average",
				color: "white",
				font: {
					size: 16,
					weight: "bold",
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				max: 30,
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
				ticks: {
					color: "white",
				},
			},
			x: {
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
				ticks: {
					color: "white",
				},
			},
		},
	};

	// Chart Options for Disk Usage
	const diskChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				labels: {
					color: "white",
					font: {
						size: 12,
					},
				},
			},
			title: {
				display: true,
				text: "Total Disk Usage (%)",
				color: "white",
				font: {
					size: 16,
					weight: "bold",
				},
			},
		},
	};

	// Stat Card Component
	const StatCard = ({ title, value, unit = "" }) => (
		<div className='bg-primary p-6 rounded-xl shadow-lg'>
			<h3 className='text-gray-400 text-sm font-medium mb-2'>{title}</h3>
			<div className='flex items-baseline'>
				<span className='text-2xl font-bold text-white'>{value.toFixed(1)}</span>
				{unit && <span className='ml-1 text-gray-400'>{unit}</span>}
			</div>
		</div>
	);

	// Machine Card Component
	const MachineCard = ({ machine }) => (
		<div className='bg-primary p-6 rounded-xl shadow-lg'>
			<h3 className='text-lg font-semibold text-white mb-4'>{machine.hostname}</h3>
			<div className='space-y-3'>
				<div className='flex justify-between items-center'>
					<span className='text-gray-400'>CPU</span>
					<span className='text-white'>{machine.metrics.cpu_usage_percent.toFixed(1)}%</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='text-gray-400'>Memory</span>
					<span className='text-white'>{machine.metrics.memory_usage_percent.toFixed(1)}%</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='text-gray-400'>Disk</span>
					<span className='text-white'>{machine.metrics.disk_usage_percent.toFixed(1)}%</span>
				</div>
			</div>
		</div>
	);

	// if (loading) {
	// 	return (
	// 		<div className='flex items-center justify-center min-h-screen'>
	// 			<div className='text-white text-xl'>Loading metrics...</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className='min-h-screen p-6'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<div>
						<h1 className='text-3xl font-bold text-white'>Admin Dashboard</h1>
						<p className='text-gray-400 mt-1'>Monitoring {metrics.length} machines</p>
					</div>
				</div>

				{/* Average Stats */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
					<StatCard title='Average CPU Usage' value={averages.cpu_usage} unit='%' />
					<StatCard title='Average Memory Usage' value={averages.memory_usage} unit='%' />
					<StatCard title='Average Disk Usage' value={averages.disk_usage} unit='%' />
				</div>

				{/* Charts */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
					<div className='bg-primary p-6 rounded-xl shadow-lg' style={{ height: "400px" }}>
						<Line data={cpuChartData} options={cpuChartOptions} />
					</div>
					<div className='bg-primary p-6 rounded-xl shadow-lg' style={{ height: "400px" }}>
						<Doughnut data={diskChartData} options={diskChartOptions} />
					</div>
				</div>

				{/* Individual Machine Stats */}
				<div>
					<h2 className='text-xl font-semibold text-white mb-6'>Individual Machine Stats</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{metrics.map((machine, index) => (
							<MachineCard key={index} machine={machine} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
