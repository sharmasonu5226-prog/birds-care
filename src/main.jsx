import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./App.css";

import PetProvider from "./context/PetContext";
import CartProvider from "./context/CartContext";
import CategoryProvider from "./context/CategoryContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <BrowserRouter>

      <PetProvider>

        <CategoryProvider>

          <CartProvider>

            <App />

          </CartProvider>

        </CategoryProvider>

      </PetProvider>

    </BrowserRouter>

  </React.StrictMode>
);