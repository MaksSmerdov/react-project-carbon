import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import "./styles/global.scss";
import "./styles/fonts.scss"

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Не удалось найти элемент с id 'root'");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);