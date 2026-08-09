import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { PetContext } from "../context/PetContext";

function FeaturedBirds() {
  const { addToCart } = useContext(CartContext);
  const { pets } = useContext(PetContext);

  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("type");

  const categoryBirds = selectedCategory
    ? pets.filter((bird) => bird.type === selectedCategory)
    : pets;

  return (
    <section className="featured">

      <h2 className="section-title">
        {selectedCategory
          ? `${selectedCategory} Birds`
          : "Featured Birds"}
      </h2>

      <div className="featured-grid">

        {categoryBirds.length === 0 ? (

          <div className="no-products">
            <h2>
              No {selectedCategory} Birds Found
            </h2>
          </div>

        ) : (

          categoryBirds.map((bird) => (

            <div
              className="bird-card"
              key={bird.id}
            >

              {bird.image ? (

                <div className="bird-img no-image">
                  {bird.image}
                </div>

              ) : (

                <div className="bird-img no-image">
                  🐦
                </div>

              )}

              <h3>
                {bird.name}
              </h3>

              <p className="price">
                ₹{bird.price}
              </p>

              <div className="rating">
                ⭐⭐⭐⭐⭐
                <span>
                  ({bird.id * 20})
                </span>
              </div>

              <div className="bird-buttons">

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

          ))

        )}

      </div>

    </section>
  );
}

export default FeaturedBirds;