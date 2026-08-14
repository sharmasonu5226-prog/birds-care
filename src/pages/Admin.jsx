import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PetContext } from "../context/PetContext";
import { CategoryContext } from "../context/CategoryContext";

import BirdsPage from "./BirdsPage";
import CategoryPage from "./CategoryPage";
import OrdersPage from "./OrdersPage";


function Admin() {
  const navigate = useNavigate();

  const { pets } = useContext(PetContext);
  const { categories } = useContext(CategoryContext);

  const [activeMenu, setActiveMenu] =
    useState("dashboard");


  // =========================
  // ADMIN LOGIN CHECK
  // =========================

  const isAdmin =
    localStorage.getItem("admin") === "true";

  if (!isAdmin) {
    navigate("/admin-login");
    return null;
  }


  // =========================
  // COUNTS
  // =========================

  const totalBirds =
    Array.isArray(pets)
      ? pets.length
      : 0;

  const totalCategories =
    Array.isArray(categories)
      ? categories.length
      : 0;


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("admin");

    navigate("/admin-login");
  };


  // =========================
  // ADMIN
  // =========================

  return (
    <div className="admin-layout">


      {/* =========================
          SIDEBAR
      ========================= */}

      <div className="admin-sidebar">

        <h2>
          🐦 Birds Care
        </h2>


        {/* DASHBOARD */}

        <button
          onClick={() =>
            setActiveMenu("dashboard")
          }
        >
          🏠 Dashboard
        </button>


        {/* BIRDS */}

        <button
          onClick={() =>
            setActiveMenu("birds")
          }
        >
          🐦 Manage Birds
        </button>


        {/* CATEGORIES */}

        <button
          onClick={() =>
            setActiveMenu("categories")
          }
        >
          🗂 Categories
        </button>


        {/* ORDERS */}

        <button
          onClick={() =>
            setActiveMenu("orders")
          }
        >
          📦 Orders
        </button>


        {/* LOGOUT */}

        <button
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>


      {/* =========================
          CONTENT
      ========================= */}

      <div className="admin-content">


        {/* =========================
            DASHBOARD
        ========================= */}

        {activeMenu === "dashboard" && (

          <div>

            <h1>
              Admin Dashboard
            </h1>


            <div>

              <h3>
                Total Birds
              </h3>

              <h2>
                {totalBirds}
              </h2>

            </div>


            <div>

              <h3>
                Total Categories
              </h3>

              <h2>
                {totalCategories}
              </h2>

            </div>

          </div>

        )}


        {/* =========================
            BIRDS
        ========================= */}

        {activeMenu === "birds" && (
          <BirdsPage />
        )}


        {/* =========================
            CATEGORIES
        ========================= */}

        {activeMenu === "categories" && (
          <CategoryPage />
        )}


        {/* =========================
            ORDERS
        ========================= */}

        {activeMenu === "orders" && (
          <OrdersPage />
        )}


      </div>

    </div>
  );
}


export default Admin;