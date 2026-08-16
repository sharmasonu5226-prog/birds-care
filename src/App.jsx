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


        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/products"
          element={<Products />}
        />


        <Route
          path="/product/:id"
          element={<BirdDetails />}
        />


        <Route
          path="/cart"
          element={<Cart />}
        />


        <Route
          path="/checkout"
          element={<Checkout />}
        />


        <Route
          path="/bill"
          element={<Bill />}
        />


        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        <Route
          path="/admin"
          element={<ProtectedAdmin />}
        />


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