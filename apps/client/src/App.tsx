import { Route, Routes } from "react-router-dom";
import { Roulette } from "./routes/Roulette";
import { Login } from "./routes/Login";
import "./App.css";

export default function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/roulette" element={<Roulette />} />
			</Routes>
		</div>
	);
}
