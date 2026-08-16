import {
  useContext,
  useMemo,
  useState
} from "react";

import {
  Link,
  useSearchParams
} from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { PetContext } from "../context/PetContext";

import "./FeaturedBirds.css";


function FeaturedBirds() {


  const {
    addToCart
  } = useContext(CartContext);


  const {
    pets = []
  } = useContext(PetContext);


  const [
    searchParams
  ] = useSearchParams();


  const selectedCategory =
    searchParams.get("type");


  const [
    selectedBird,
    setSelectedBird
  ] = useState(null);


  // =========================
  // NUMBER
  // =========================

  const number = (value) => {

    const n =
      Number(
        String(value ?? 0)
          .replace("₹", "")
          .replace(/,/g, "")
          .replace("%", "")
          .trim()
      );

    return Number.isFinite(n)
      ? n
      : 0;

  };


  // =========================
  // PRICE FORMAT
  // =========================

  const priceFormat = (value) => {

    return number(value)
      .toLocaleString("en-IN");

  };


  // =========================
  // PRICE SYSTEM
  // =========================

  const getPrice = (
    bird,
    mode = "single"
  ) => {

    const pair =
      mode === "pair";


    const oldPrice = pair

      ? number(
          bird.pairOldPrice ??
          bird.pair_mrp ??
          0
        )

      : number(
          bird.singleOldPrice ??
          bird.oldPrice ??
          bird.mrp ??
          bird.price ??
          0
        );


    const normalPrice = pair

      ? number(
          bird.pairPrice ??
          bird.pair_price ??
          0
        )

      : number(
          bird.singlePrice ??
          bird.price ??
          0
        );


    /*
      AUTOMATIC DISCOUNT

      Example:
      MRP = 100
      Price = 85

      Discount = 15%
    */

    let finalPrice =
      normalPrice || oldPrice;


    let discount = 0;


    if (
      oldPrice > 0 &&
      finalPrice > 0 &&
      finalPrice < oldPrice
    ) {

      discount =
        Math.round(
          (
            (oldPrice - finalPrice) /
            oldPrice
          ) * 100
        );

    }


    return {

      oldPrice,

      finalPrice,

      discount,

      save:
        Math.max(
          0,
          oldPrice - finalPrice
        )

    };

  };


  // =========================
  // PRODUCT FILTER
  // =========================

  const birds = useMemo(() => {

    let list = [...pets];


    // NON BIRD ANIMALS REMOVE

    list =
      list.filter((bird) => {

        if (!bird)
          return false;


        const type =
          String(
            bird.type || ""
          )
            .toLowerCase()
            .trim();


        const name =
          String(
            bird.name || ""
          )
            .toLowerCase()
            .trim();


        const blocked = [

          "rabbit",
          "dog",
          "cat",
          "fish",
          "hamster",
          "mouse",
          "rat",
          "turtle"

        ];


        return !blocked.some(
          (item) =>
            type.includes(item) ||
            name.includes(item)
        );

      });


    // CATEGORY FILTER

    if (selectedCategory) {

      const cat =
        selectedCategory
          .toLowerCase()
          .trim();


      list =
        list.filter(
          (bird) =>
            String(
              bird.type || ""
            )
              .toLowerCase()
              .includes(cat)
        );

    }


    return list;

  }, [
    pets,
    selectedCategory
  ]);


  // =========================
  // STOCK CHECK
  // =========================

  const outOfStock = (bird) => {

    const stock =
      String(
        bird?.stock ?? ""
      )
        .toLowerCase()
        .trim();


    return (

      stock === "out of stock" ||

      stock === "false" ||

      bird?.stock === false ||

      bird?.inStock === false

    );

  };


  const getStockText = (bird) => {

    return outOfStock(bird)

      ? "Out of Stock"

      : "In Stock";

  };


  // =========================
  // IMAGE
  // =========================

  const getImage = (bird) => {

    if (
      bird.image &&
      typeof bird.image === "string"
    ) {

      return bird.image;

    }

    return null;

  };


  // =========================
  // ADD TO CART
  // =========================

  const addBirdToCart = (
    bird,
    mode
  ) => {

    const price =
      getPrice(
        bird,
        mode
      );


    addToCart({

      ...bird,

      price:
        price.finalPrice,

      originalPrice:
        price.oldPrice,

      discountPercent:
        price.discount,

      discountAmount:
        price.save,

      purchaseType:

        mode === "pair"

          ? "Pair"

          : "Single",

      quantity: 1

    });


    setSelectedBird(null);

  };


  // =========================
  // OPTION BOX
  // =========================

  const OptionBox = ({
    bird
  }) => {


    const single =
      getPrice(
        bird,
        "single"
      );


    const pair =
      getPrice(
        bird,
        "pair"
      );


    return (

      <div

        className="bird-option-overlay"

        onClick={() =>
          setSelectedBird(null)
        }

      >

        <div

          className="bird-option-box"

          onClick={
            (e) =>
              e.stopPropagation()
          }

        >

          <button

            className="option-close"

            onClick={() =>
              setSelectedBird(null)
            }

          >

            ×

          </button>


          <h3>
            {bird.name}
          </h3>


          {/* SINGLE */}

          <button

            className="purchase-option"

            onClick={() => {

              addBirdToCart(
                bird,
                "single"
              );

            }}

          >

            Single

            <strong>

              ₹
              {priceFormat(
                single.finalPrice
              )}

            </strong>

          </button>


          {/* PAIR */}

          {
            pair.finalPrice > 0 &&

            <button

              className="purchase-option"

              onClick={() => {

                addBirdToCart(
                  bird,
                  "pair"
                );

              }}

            >

              Pair

              <strong>

                ₹
                {priceFormat(
                  pair.finalPrice
                )}

              </strong>

            </button>

          }


        </div>

      </div>

    );

  };


  // =========================
  // EMPTY CHECK
  // =========================

  if (!birds.length) {

    return (

      <section className="featured">

        <div className="featured-empty">

          <h2>
            No Birds Found
          </h2>

          <p>
            No birds are available.
          </p>

        </div>

      </section>

    );

  }


  // =========================
  // MAIN DISPLAY
  // =========================

  return (

    <section className="featured">

      <div className="featured-grid">


        {

          birds.map((bird) => {


            const single =
              getPrice(
                bird,
                "single"
              );


            const pair =
              getPrice(
                bird,
                "pair"
              );


            const image =
              getImage(bird);


            const birdOutOfStock =
              outOfStock(bird);


            return (

              <div

                className="bird-card"

                key={bird.id}

              >


                {/* =====================
                    IMAGE
                ====================== */}

                <div className="bird-image">


                  {

                    image ? (

                      <img

                        src={image}

                        alt={bird.name}

                      />

                    ) : (

                      <div className="image-fallback">

                        {bird.emoji || "🐦"}

                      </div>

                    )

                  }


                  {/* 
                    IMAGE KE UPAR
                    % OFF BADGE
                    JAAANBUJH KAR HATA DIYA HAI
                  */}


                </div>


                {/* =====================
                    CONTENT
                ====================== */}

                <div className="bird-content">


                  <h3>
                    {bird.name}
                  </h3>


                  <p>
                    {bird.type}
                  </p>


                  {/* STOCK */}

                  <p

                    className={
                      birdOutOfStock

                        ? "stock-status out-of-stock"

                        : "stock-status in-stock"
                    }

                  >

                    {

                      birdOutOfStock

                        ? "❌ Out of Stock"

                        : "✅ In Stock"

                    }

                  </p>


                  {/* =====================
                      SINGLE PRICE
                  ====================== */}

                  <div className="price-box">


                    <span className="price-label">
                      Single
                    </span>


                    {

                      single.oldPrice >
                      single.finalPrice &&

                      <span className="old-price">

                        ₹
                        {priceFormat(
                          single.oldPrice
                        )}

                      </span>

                    }


                    <span className="new-price">

                      ₹
                      {priceFormat(
                        single.finalPrice
                      )}

                    </span>


                    {

                      single.discount > 0 &&

                      <span className="price-discount">

                        {single.discount}% OFF

                      </span>

                    }


                  </div>


                  {/* =====================
                      PAIR PRICE
                  ====================== */}

                  {

                    pair.finalPrice > 0 &&

                    <div className="price-box">


                      <span className="price-label">
                        Pair
                      </span>


                      {

                        pair.oldPrice >
                        pair.finalPrice &&

                        <span className="old-price">

                          ₹
                          {priceFormat(
                            pair.oldPrice
                          )}

                        </span>

                      }


                      <span className="new-price">

                        ₹
                        {priceFormat(
                          pair.finalPrice
                        )}

                      </span>


                      {

                        pair.discount > 0 &&

                        <span className="price-discount">

                          {pair.discount}% OFF

                        </span>

                      }


                    </div>

                  }


                  {/* =====================
                      ADD TO CART
                  ====================== */}

                  <button

                    className="cart-btn"

                    disabled={
                      birdOutOfStock
                    }

                    onClick={() => {

                      if (
                        birdOutOfStock
                      ) {

                        return;

                      }


                      setSelectedBird(
                        bird
                      );

                    }}

                  >

                    {

                      birdOutOfStock

                        ? "❌ Out of Stock"

                        : "🛒 Add to Cart"

                    }

                  </button>


                  {/* DETAILS */}

                  <Link

                    className="details-btn"

                    to={`/bird/${bird.id}`}

                  >

                    View Details

                  </Link>


                </div>


              </div>

            );

          })

        }


      </div>


      {/* OPTION POPUP */}

      {

        selectedBird &&

        <OptionBox

          bird={selectedBird}

        />

      }


    </section>

  );

}


export default FeaturedBirds;