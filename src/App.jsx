import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import BirdDetails from "./pages/BirdDetails";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const isAdmin = localStorage.getItem("admin") === "true";

  return (
    <Routes>

      {/* =========================
          HOME
      ========================== */}
      <Route
        path="/"
        element={
          <>
            <Header />

            <main>
              <Home />
            </main>

            <Footer />
          </>
        }
      />

      {/* =========================
          PRODUCTS
      ========================== */}
      <Route
        path="/products"
        element={
          <>
            <Header />

            <main>
              <Products />
            </main>

            <Footer />
          </>
        }
      />

      {/* =========================
          BIRD DETAILS
      ========================== */}
      <Route
        path="/bird/:id"
        element={
          <>
            <Header />

            <main>
              <BirdDetails />
            </main>

            <Footer />
          </>
        }
      />

      {/* =========================
          CART
      ========================== */}
      <Route
        path="/cart"
        element={
          <>
            <Header />

            <main>
              <Cart />
            </main>

            <Footer />
          </>
        }
      />

      {/* =========================
          USER LOGIN
      ========================== */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* =========================
          USER REGISTER
      ========================== */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* =========================
          ADMIN LOGIN
          Both URLs supported
      ========================== */}
      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* =========================
          ADMIN PANEL
      ========================== */}
      <Route
        path="/admin"
        element={
          isAdmin ? (
            <>
              <Header />

              <main>
                <Admin />
              </main>
            </>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      />

      {/* =========================
          UNKNOWN URL
      ========================== */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;