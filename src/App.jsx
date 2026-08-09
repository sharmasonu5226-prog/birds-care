import "./App.css";

import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import BirdDetails from "./pages/BirdDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <Routes>

      {/* =========================
          HOME
      ========================= */}
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
          PRODUCTS / BIRDS
      ========================= */}
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
      ========================= */}
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
      ========================= */}
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
          LOGIN
      ========================= */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* =========================
          REGISTER
      ========================= */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* =========================
          ADMIN LOGIN
      ========================= */}
      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      {/* =========================
          ADMIN
      ========================= */}
      <Route
        path="/admin"
        element={
          <>
            <Header />

            <main>
              <Admin />
            </main>
          </>
        }
      />

    </Routes>
  );
}

export default App;