import { useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { PetContext } from "../context/PetContext";
import { CartContext } from "../context/CartContext";

function BirdDetails() {
  const { id } = useParams();

  const { pets } = useContext(PetContext);
  const { addToCart } = useContext(CartContext);

  const bird = pets.find(
    (item) => item.id === Number(id)
  );

  const [age, setAge] = useState("Young");
  const [gender, setGender] = useState("Male");
  const [quantity, setQuantity] = useState(1);

  if (!bird) {
    return (
      <div>
        <h2>Bird Not Found</h2>
      </div>
    );
  }

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      previous > 1 ? previous - 1 : 1
    );
  };

  const handleAddToCart = () => {
    addToCart(bird, {
      age,
      gender,
      quantity,
    });
  };

  const totalPrice =
    Number(bird.price || 0) * quantity;

  return (
    <div className="bird-details">

      <div className="details-image-container">
        {bird.image ? (
          <img
            src={bird.image}
            alt={bird.name}
            className="details-img"
          />
        ) : (
          <div className="details-emoji">
            {bird.emoji || "🐦"}
          </div>
        )}
      </div>

      <div className="details-content">

        <h1>{bird.name}</h1>

        <p className="bird-type">
          Type: {bird.type}
        </p>

        <p className="bird-description">
          {bird.description ||
            "Healthy and beautiful pet bird available with proper care."}
        </p>

        <h2>
          ₹{bird.price}
        </h2>

        <div className="selection-box">
          <h3>Select Age</h3>

          <div className="option-buttons">

            <button
              type="button"
              className={
                age === "Young"
                  ? "selected-option"
                  : ""
              }
              onClick={() => setAge("Young")}
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
              onClick={() => setAge("Adult")}
            >
              🐦 Adult
            </button>

          </div>
        </div>

        <div className="selection-box">
          <h3>Select Gender</h3>

          <div className="option-buttons">

            <button
              type="button"
              className={
                gender === "Male"
                  ? "selected-option"
                  : ""
              }
              onClick={() => setGender("Male")}
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
              onClick={() => setGender("Female")}
            >
              ♀ Female
            </button>

          </div>
        </div>

        <div className="selection-box">
          <h3>Quantity</h3>

          <div className="quantity-control">

            <button
              type="button"
              onClick={decreaseQuantity}
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={increaseQuantity}
            >
              +
            </button>

          </div>
        </div>

        <div className="selected-summary">

          <p>
            Age: <strong>{age}</strong>
          </p>

          <p>
            Gender: <strong>{gender}</strong>
          </p>

          <p>
            Quantity: <strong>{quantity}</strong>
          </p>

          <p>
            Total:{" "}
            <strong>
              ₹{totalPrice}
            </strong>
          </p>

        </div>

        <p>
          Stock:{" "}
          <strong>
            {bird.stock || "In Stock"}
          </strong>
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={
            bird.stock === "Out of Stock"
          }
        >
          {bird.stock === "Out of Stock"
            ? "Out of Stock"
            : "🛒 Add To Cart"}
        </button>

      </div>
    </div>
  );
}

export default BirdDetails;