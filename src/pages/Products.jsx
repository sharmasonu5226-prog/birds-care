import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { PetContext } from "../context/PetContext";
import { CategoryContext } from "../context/CategoryContext";

function Products() {
  const { addToCart } = useContext(CartContext);
  const { pets } = useContext(PetContext);
  const { categories } = useContext(CategoryContext);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const filteredPets = pets.filter((bird) => {
    const nameMatch = bird.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const typeMatch =
      type === "All" || bird.type === type;

    return nameMatch && typeMatch;
  });

  return (
    <section className="products-page">

      <h1>All Birds 🐦</h1>

      <div className="filter-box">

        <input
          type="text"
          placeholder="Search Bird..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="All">
            All Birds
          </option>

          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.name}
            >
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>

      </div>

      <div className="products-grid">

        {filteredPets.map((bird) => (
          <div
            className="product-card"
            key={bird.id}
          >

            <div className="product-image">

              {bird.image &&
              (
                bird.image.startsWith("http") ||
                bird.image.startsWith("data:image")
              ) ? (
                <img
                  src={bird.image}
                  alt={bird.name}
                  className="product-img"
                />
              ) : (
                <span>
                  {bird.image || "🐦"}
                </span>
              )}

            </div>

            <h3>
              {bird.name}
            </h3>

            <p>
              ₹{bird.price}
            </p>

            <div className="product-buttons">

              <button
                onClick={() => addToCart(bird)}
              >
                🛒 Add Cart
              </button>

              <Link to={`/bird/${bird.id}`}>
                <button className="details-btn">
                  View Details
                </button>
              </Link>

            </div>

          </div>
        ))}

      </div>

      {filteredPets.length === 0 && (
        <h2>
          No Bird Found 🐦
        </h2>
      )}

    </section>
  );
}

export default Products;