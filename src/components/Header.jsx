import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function Header() {
  const { cart } = useContext(CartContext);

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All Categories");

  const handleSearch = () => {
    const query = searchText.trim();

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(query)}&category=${encodeURIComponent(
        category
      )}`
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="header">

      <div className="main-header">

        <div className="logo">
          <span>🦜</span>

          <div>
            <h2>Birds Care</h2>
            <small>Care for your Feathers</small>
          </div>
        </div>

        <div className="search-box">

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Birds</option>
            <option>Food</option>
            <option>Accessories</option>
          </select>

          <input
            type="text"
            value={searchText}
            placeholder="Search birds..."
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button type="button" onClick={handleSearch}>
            🔍 Search
          </button>

        </div>

        <div className="header-links">

          <Link to="/cart">
            🛒 Cart ({cart.length})
          </Link>

          <Link to="/login">
            👤 Login
          </Link>

        </div>

      </div>

      <nav className="nav-menu">

        <Link to="/">
          🏠 Home
        </Link>

        <Link to="/products">
          🦜 Birds
        </Link>

        <Link to="/cart">
          🛒 Cart
        </Link>

      </nav>

    </header>
  );
}

export default Header;