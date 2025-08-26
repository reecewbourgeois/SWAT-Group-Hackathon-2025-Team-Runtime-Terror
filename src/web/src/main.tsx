import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TrpcProvider } from "./trpc";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<TrpcProvider>
				<App />
			</TrpcProvider>
		</BrowserRouter>
	</StrictMode>,
);
