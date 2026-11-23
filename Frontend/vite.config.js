import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Port 3000 because PlantController only allows CORS from http://localhost:3000
export default defineConfig({ plugins: [react()], server: { port: 3000 } });
