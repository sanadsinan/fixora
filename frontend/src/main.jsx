import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ProvidersProvider } from "./context/ProvidersContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProvidersProvider>
          <App />
        </ProvidersProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);