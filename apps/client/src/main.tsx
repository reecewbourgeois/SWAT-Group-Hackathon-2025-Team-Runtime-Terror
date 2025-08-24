import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TrpcProvider } from "./trpc.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TrpcProvider>
        <App />
      </TrpcProvider>
    </BrowserRouter>
  </StrictMode>
);
