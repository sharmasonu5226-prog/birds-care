import { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { PetContext } from "../context/PetContext";

function Products() {
  const { addToCart } = useContext(CartContext);
  const { pets } = useContext(PetContext);

  const [search, setSearch] = useState("");

  const [searchParams] = useSearchParams();

  const categoryType = searchParams.get("type");

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredPets = pets.filter((bird) => {
    const nameMatch = bird.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      !categoryType ||
      bird.type === categoryType;

    return nameMatch && categoryMatch;
  });

  return (
    <div className="products-page">

      {/* =========================
          PAGE TITLE
      ========================= */}

      <h1>
        {categoryType
          ? categoryType
          : "All Birds"}
      </h1>

      {/* =========================
          SEARCH
      ========================= */}

      <input
        type="text"
        placeholder="Search Bird..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* =========================
          NO PRODUCTS
      ========================= */}

      {filteredPets.length === 0 ? (

        <div className="no-products">
          <h2>No Birds Found</h2>
        </div>

      ) : (

        <div className="products-grid">

          {filteredPets.map((bird) => (

            <BirdCard
              key={bird.id}
              bird={bird}
              addToCart={addToCart}
            />

          ))}

        </div>

      )}

    </div>
  );
}

// =================================================
// PRODUCT CARD
// =================================================

function BirdCard({
  bird,
  addToCart
}) {
  const [age, setAge] =
    useState("Young");

  const [gender, setGender] =
    useState("Male");

  const [quantity, setQuantity] =
    useState(1);

  // =========================
  // QUANTITY
  // =========================

  const increaseQuantity = () => {
    setQuantity(
      (previous) =>
        previous + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity(
      (previous) =>
        previous > 1
          ? previous - 1
          : 1
    );
  };

  // =========================
  // TOTAL
  // =========================

  const totalPrice =
    Number(bird.price || 0) *
    quantity;

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    addToCart(
      bird,
      {
        age,
        gender,
        quantity
      }
    );
  };

  const isOutOfStock =
    (bird.stock || "In Stock") ===
    "Out of Stock";

  return (
    <div className="product-card">

      {/* =========================
          IMAGE
      ========================= */}

      <div className="product-image">

        {bird.image ? (

          <img
            src={bird.image}
            alt={bird.name}
          />

        ) : (

          <div className="product-emoji">
            {bird.emoji || "🐦"}
          </div>

        )}

      </div>

      {/* =========================
          NAME
      ========================= */}

      <h2>
        {bird.name}
      </h2>

      {/* =========================
          TYPE
      ========================= */}

      <p className="product-type">
        {bird.type}
      </p>

      {/* =========================
          PRICE
      ========================= */}

      <h3 className="product-price">
        ₹{bird.price}
      </h3>

      {/* =========================
          STOCK
      ========================= */}

      <p
        className={
          isOutOfStock
            ? "stock-red"
            : "stock-green"
        }
      >
        {bird.stock || "In Stock"}
      </p>

      {/* =========================
          AGE
      ========================= */}

      <div className="product-selection">

        <strong>
          Select Age
        </strong>

        <div className="option-buttons">

          <button
            type="button"
            className={
              age === "Young"
                ? "selected-option"
                : ""
            }
            onClick={() =>
              setAge("Young")
            }
          >
            🐣 Young
          </button>

          <button
            type="button"
            className={
              age === "Adult"
                ? "selected-option"
                : ""
            }
            onClick={() =>
              setAge("Adult")
            }
          >
            🐦 Adult
          </button>

        </div>

      </div>

      {/* =========================
          GENDER
      ========================= */}

      <div className="product-selection">

        <strong>
          Select Gender
        </strong>

        <div className="option-buttons">

          <button
            type="button"
            className={
              gender === "Male"
                ? "selected-option"
                : ""
            }
            onClick={() =>
              setGender("Male")
            }
          >
            ♂ Male
          </button>

          <button
            type="button"
            className={
              gender === "Female"
                ? "selected-option"
                : ""
            }
            onClick={() =>
              setGender("Female")
            }
          >
            ♀ Female
          </button>

        </div>

      </div>

      {/* =========================
          QUANTITY
      ========================= */}

      <div className="product-selection">

        <strong>
          Quantity
        </strong>

        <div className="quantity-control">

          <button
            type="button"
            onClick={decreaseQuantity}
          >
            −
          </button>

          <span>
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQuantity}
          >
            +
          </button>

        </div>

      </div>

      {/* =========================
          SUMMARY
      ========================= */}

      <div className="product-summary">

        <p>
          Age:{" "}
          <strong>
            {age}
          </strong>
        </p>

        <p>
          Gender:{" "}
          <strong>
            {gender}
          </strong>
        </p>

        <p>
          Quantity:{" "}
          <strong>
            {quantity}
          </strong>
        </p>

        <p>
          Total:{" "}
          <strong>
            ₹{totalPrice}
          </strong>
        </p>

      </div>

      {/* =========================
          ADD TO CART
      ========================= */}

      <button
        type="button"
        className="add-cart-button"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
      >
        {isOutOfStock
          ? "Out of Stock"
          : "🛒 Add To Cart"}
      </button>

      {/* =========================
          VIEW DETAILS
      ========================= */}

      <Link
        to={`/product/${bird.id}`}
        className="view-details-button"
      >
        View Details
      </Link>

    </div>
  );
}

export default Products;