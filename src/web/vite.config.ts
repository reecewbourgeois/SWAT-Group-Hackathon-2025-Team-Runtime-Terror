import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	root: path.resolve(__dirname),
	server: {
		fs: {
			// Allow importing from one level up (../../shared)
			allow: [path.resolve(__dirname, "..", "..")],
		},
		port: 3000,
		proxy: {
			"/trpc": "http://localhost:5000",
			"/auth/refresh": "http://localhost:5000",
		},
	},
	build: {
		outDir: "../../dist/web",
		emptyOutDir: true,
	},
});
