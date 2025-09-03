import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // pastikan Tailwind / CSS sudah import
import { UserProvider } from "./contexts/UserContext";

const basename = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "/"
  : "/gudang-pln-gandul/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
