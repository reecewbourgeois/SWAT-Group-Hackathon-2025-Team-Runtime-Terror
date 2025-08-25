import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/trpc": "http://localhost:5000",
			"/auth/refresh": "http://localhost:5000",
		},
	},
});
