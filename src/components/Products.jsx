import { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { PetContext } from "../context/PetContext";

function Products() {
  const { addToCart } = useContext(CartContext);
  const { pets } = useContext(PetContext);

  const [search, setSearch] = useState("");

  const [searchParams] = useSearchParams();

  // URL se category/type milega
  const categoryType = searchParams.get("type");

  // Search + Category filtering
  const filteredPets = pets.filter((bird) => {
    const nameMatch = bird.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      !categoryType || bird.type === categoryType;

    return nameMatch && categoryMatch;
  });

  return (
    <section className="products-page">

      {/* PAGE TITLE */}

      <h1>
        {categoryType
          ? `${categoryType} Birds`
          : "All Birds"}
      </h1>


      {/* SEARCH */}

      <div className="filter-box">

        <input
          type="text"
          placeholder="Search Bird..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* PRODUCTS */}

      <div className="products-grid">

        {filteredPets.length === 0 ? (

          <div className="no-products">

            <h2>
              No Birds Found
            </h2>

            <p>
              Is category mein abhi koi bird available nahi hai.
            </p>

          </div>

        ) : (

          filteredPets.map((bird) => (

            <div
              className="product-card"
              key={bird.id}
            >

              {/* IMAGE */}

              <div className="product-image">

                {bird.image ? (
                  bird.image
                ) : (
                  "🐦"
                )}

              </div>


              {/* NAME */}

              <h3>
                {bird.name}
              </h3>


              {/* TYPE */}

              <p>
                {bird.type}
              </p>


              {/* PRICE */}

              <p className="price">
                ₹{bird.price}
              </p>


              {/* BUTTONS */}

              <div className="product-buttons">

                <button
                  onClick={() => addToCart(bird)}
                >
                  🛒 Add To Cart
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

export default Products;