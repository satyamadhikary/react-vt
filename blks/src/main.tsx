import React from "react";
import { StrictMode } from 'react'
import "./App.css"
import "./index.css"
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Route";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
  </StrictMode>
);
