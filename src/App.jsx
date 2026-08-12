import "./App.css";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import BirdDetails from "./pages/BirdDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Bill from "./pages/Bill";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";


// =========================
// PROTECTED ADMIN
// =========================

function ProtectedAdmin() {
  const isAdmin =
    localStorage.getItem("admin") === "true";

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  return <Admin />;
}


// =========================
// APP
// =========================

function App() {
  return (
    <>
      <Header />

      <Routes>

        {/* =========================
            HOME
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =========================
            PRODUCTS
        ========================= */}

        <Route
          path="/products"
          element={<Products />}
        />


        {/* =========================
            BIRD DETAILS
        ========================= */}

        <Route
          path="/product/:id"
          element={<BirdDetails />}
        />


        {/* =========================
            CART
        ========================= */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* =========================
            CHECKOUT
        ========================= */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* =========================
            BILL
        ========================= */}

        <Route
          path="/bill"
          element={<Bill />}
        />


        {/* =========================
            ADMIN LOGIN
        ========================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* =========================
            ADMIN PANEL
        ========================= */}

        <Route
          path="/admin"
          element={<ProtectedAdmin />}
        />


        {/* =========================
            UNKNOWN URL
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

      <Footer />
    </>
  );
}

export default App;