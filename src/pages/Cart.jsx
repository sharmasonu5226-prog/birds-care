import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateItemOptions,
    updatePairOptions,
    updateQuantity,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [isOrdering, setIsOrdering] = useState(false);

  // =====================================================
  // PRICE
  // =====================================================

  const getPrice = (item) => {
    return (
      Number(
        String(item?.price ?? 0)
          .replace("₹", "")
          .replace(/,/g, "")
          .trim()
      ) || 0
    );
  };

  // =====================================================
  // QUANTITY
  // =====================================================

  const getQuantity = (item) => {
    const qty = Number(item?.quantity ?? item?.qty ?? 1);

    return qty > 0 ? qty : 1;
  };

  // =====================================================
  // STOCK
  // =====================================================

  const isOutOfStock = (item) => {
    return (
      item?.stock === "Out of Stock" ||
      item?.stock === false ||
      item?.inStock === false
    );
  };

  const hasOutOfStock = cart.some((item) =>
    isOutOfStock(item)
  );

  // =====================================================
  // TOTALS
  // =====================================================

  const subtotal = cart.reduce((sum, item) => {
    return (
      sum +
      getPrice(item) * getQuantity(item)
    );
  }, 0);

  const adminDiscount =
    Number(
      localStorage.getItem("birdsCareDiscount") || 0
    ) || 0;

  const discountAmount =
    (subtotal * adminDiscount) / 100;

  const shippingCharge =
    Number(
      localStorage.getItem("shippingCharge") ||
        localStorage.getItem("birdsCareShipping") ||
        0
    ) || 0;

  const finalTotal = Math.max(
    0,
    subtotal -
      discountAmount +
      shippingCharge
  );

  // =====================================================
  // CHECK AGE / GENDER
  // =====================================================

  const hasIncompleteOptions = cart.some((item) => {
    const isPair =
      item.purchaseType === "Pair";

    if (isPair) {
      return (
        !item.bird1Gender ||
        !item.bird1Age ||
        !item.bird2Gender ||
        !item.bird2Age
      );
    }

    return (
      !item.gender ||
      !item.age
    );
  });

  // =====================================================
  // OPEN CHECKOUT
  // =====================================================

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty 🛒");
      return;
    }

    if (hasOutOfStock) {
      alert(
        "❌ Out of Stock bird cart me hai."
      );
      return;
    }

    if (hasIncompleteOptions) {
      alert(
        "❌ Please select Age and Gender for every bird."
      );
      return;
    }

    setShowCheckout(true);
  };

  // =====================================================
  // ORDER
  // =====================================================

  const handleOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty 🛒");
      return;
    }

    if (hasIncompleteOptions) {
      alert(
        "❌ Please select Age and Gender for every bird."
      );
      return;
    }

    if (hasOutOfStock) {
      alert(
        "❌ Out of Stock bird cart me hai."
      );
      return;
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanAddress = address.trim();
    const cleanCity = city.trim();
    const cleanPincode = pincode.trim();

    if (
      !cleanName ||
      !cleanPhone ||
      !cleanEmail ||
      !cleanAddress ||
      !cleanCity ||
      !cleanPincode
    ) {
      alert("❌ Please fill all details.");
      return;
    }

    setIsOrdering(true);

    const order = {
      orderId: `BC-${Date.now()}`,

      orderDate: new Date().toISOString(),

      customerName: cleanName,

      phone: cleanPhone,

      email: cleanEmail,

      address: cleanAddress,

      city: cleanCity,

      pincode: cleanPincode,

      items: cart,

      subtotal,

      discountPercentage: adminDiscount,

      discount: discountAmount,

      shippingCharge,

      deliveryCharge: shippingCharge,

      total: finalTotal,

      paymentMethod: "Cash on Delivery",

      paymentStatus: "Pending",

      orderStatus: "Confirmed",

      status: "Order Placed",
    };

    // ===================================================
    // SAVE LOCAL ORDER
    // ===================================================

    try {
      localStorage.setItem(
        "birdsCareLastOrder",
        JSON.stringify(order)
      );

localStorage.setItem(
  "orders",
  JSON.stringify([order])
);
    } catch (error) {
      console.error(
        "Local order error:",
        error
      );
    }

    // ===================================================
    // SEND SERVER ORDER
    // ===================================================

try {
  const response = await fetch(
    "http://10.206.203.228:5000/api/send-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }
  );

  let result = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  console.log("SERVER RESPONSE:", result);

} catch (error) {
  console.log("Server error:", error);
}

    // ===================================================
    // FINISH ORDER
    // ===================================================

    clearCart();

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setPincode("");

    setShowCheckout(false);

    setIsOrdering(false);

    alert(
      "🎉 Order placed successfully!"
    );

    navigate("/bill");
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cart.length === 0) {
    return (
      <div style={pageStyle}>
        <div style={emptyCardStyle}>
          <div style={emptyIconStyle}>
            🛒
          </div>

          <h2>
            Your Cart is Empty
          </h2>

          <p>
            Add some birds to your cart.
          </p>

          <button
            type="button"
            style={mainButtonStyle}
            onClick={() =>
              navigate("/products")
            }
          >
            🐦 Browse Birds
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div style={pageStyle}>

      {/* =================================================
          MOBILE RESPONSIVE STYLE
      ================================================= */}

      <style>
        {`
          .birds-care-cart-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(280px, 330px);
            gap: 18px;
            align-items: start;
          }

          .birds-care-summary {
            width: 100%;
          }

          @media (max-width: 800px) {
            .birds-care-cart-grid {
              grid-template-columns: 1fr !important;
              width: 100%;
            }

            .birds-care-summary {
              width: 100% !important;
              order: 2;
            }

            .birds-care-products {
              width: 100%;
              order: 1;
            }
          }

          @media (max-width: 500px) {
            .birds-care-page {
              padding: 10px !important;
            }

            .birds-care-header {
              flex-direction: column;
              align-items: flex-start !important;
            }

            .birds-care-cart-card {
              padding: 12px !important;
            }

            .birds-care-product-box {
              align-items: flex-start !important;
            }

            .birds-care-product-image {
              width: 75px !important;
              height: 75px !important;
            }

            .birds-care-product-name {
              font-size: 18px !important;
            }

            .birds-care-mobile-bottom {
              flex-direction: column;
              align-items: stretch !important;
            }

            .birds-care-item-total {
              justify-content: space-between !important;
            }

            .birds-care-options-grid {
              grid-template-columns: 1fr !important;
            }

            .birds-care-summary-card {
              padding: 16px !important;
            }

            .birds-care-main-button {
              min-height: 52px;
              font-size: 17px !important;
            }
          }
        `}
      </style>

      <div
        className="birds-care-page"
        style={containerStyle}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="birds-care-header"
          style={headerStyle}
        >
          <h1 style={pageTitleStyle}>
            Your Cart 🛒
          </h1>

          <span style={itemsCountStyle}>
            {cart.length} Item
            {cart.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="birds-care-cart-grid">

          {/* =================================================
              ALL CART PRODUCTS
          ================================================= */}

          <div
            className="birds-care-products"
          >

            {cart.map((item) => {
              const price = getPrice(item);

              const qty = getQuantity(item);

              const amount = price * qty;

              const isPair =
                item.purchaseType === "Pair";

              return (
                <div
                  key={item.id}
                  className="birds-care-cart-card"
                  style={cartCardStyle}
                >

                  {/* =================================================
                      PRODUCT
                  ================================================= */}

                  <div
                    className="birds-care-product-box"
                    style={productBoxStyle}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="birds-care-product-image"
                      style={productImageStyle}
                    />

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >

                      <h2
                        className="birds-care-product-name"
                        style={productNameStyle}
                      >
                        {item.name}
                      </h2>

                      <span
                        style={
                          isPair
                            ? pairBadgeStyle
                            : singleBadgeStyle
                        }
                      >
                        {isPair
                          ? "Pair (2 Birds)"
                          : "Single Bird"}
                      </span>

                      <div
                        style={
                          productPriceStyle
                        }
                      >
                        ₹
                        {price.toLocaleString(
                          "en-IN"
                        )}
                      </div>

                    </div>
                  </div>

                  {/* =================================================
                      QUANTITY + TOTAL
                  ================================================= */}

                  <div
                    className="birds-care-mobile-bottom"
                    style={
                      mobileBottomStyle
                    }
                  >

                    <div>
                      <small>
                        Quantity
                      </small>

                      <div
                        style={
                          quantityBoxStyle
                        }
                      >

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              qty - 1
                            )
                          }
                          style={
                            quantityButtonStyle
                          }
                        >
                          -
                        </button>

                        <span
                          style={
                            quantityNumberStyle
                          }
                        >
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              qty + 1
                            )
                          }
                          style={
                            quantityButtonStyle
                          }
                        >
                          +
                        </button>

                      </div>
                    </div>

                    <div
                      className="birds-care-item-total"
                      style={
                        itemTotalAreaStyle
                      }
                    >

                      <small>
                        Total
                      </small>

                      <strong
                        style={
                          itemTotalStyle
                        }
                      >
                        ₹
                        {amount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                        style={
                          removeButtonStyle
                        }
                      >
                        🗑 Remove
                      </button>

                    </div>
                  </div>

                  {/* =================================================
                      SINGLE BIRD DETAILS
                  ================================================= */}

                  {!isPair && (
                    <div
                      style={
                        detailsCardStyle
                      }
                    >

                      <h3
                        style={
                          detailsTitleStyle
                        }
                      >
                        🐦 Bird Details
                      </h3>

                      <div
                        className="birds-care-options-grid"
                        style={
                          optionsGridStyle
                        }
                      >

                        <select
                          value={
                            item.gender || ""
                          }
                          onChange={(e) =>
                            updateItemOptions(
                              item.id,
                              undefined,
                              e.target.value
                            )
                          }
                          style={selectStyle}
                        >
                          <option value="">
                            Select Gender
                          </option>

                          <option value="Male">
                            Male
                          </option>

                          <option value="Female">
                            Female
                          </option>
                        </select>

                        <select
                          value={
                            item.age || ""
                          }
                          onChange={(e) =>
                            updateItemOptions(
                              item.id,
                              e.target.value,
                              undefined
                            )
                          }
                          style={selectStyle}
                        >
                          <option value="">
                            Select Age
                          </option>

                          <option value="Young">
                            Young
                          </option>

                          <option value="Adult">
                            Adult
                          </option>
                        </select>

                      </div>
                    </div>
                  )}

                  {/* =================================================
                      PAIR DETAILS
                  ================================================= */}

                  {isPair && (
                    <div
                      style={
                        pairDetailsContainerStyle
                      }
                    >

                      <h3
                        style={
                          detailsTitleStyle
                        }
                      >
                        🐦🐦 Pair Bird Details
                      </h3>

                      {/* =================================================
                          BIRD 1
                      ================================================= */}

                      <div
                        style={
                          pairBirdCardStyle
                        }
                      >

                        <h4
                          style={
                            pairBirdTitleStyle
                          }
                        >
                          🐦 Bird 1
                        </h4>

                        <div
                          className="birds-care-options-grid"
                          style={
                            optionsGridStyle
                          }
                        >

                          <select
                            value={
                              item.bird1Gender ||
                              ""
                            }
                            onChange={(e) =>
                              updatePairOptions(
                                item.id,
                                1,
                                undefined,
                                e.target.value
                              )
                            }
                            style={selectStyle}
                          >
                            <option value="">
                              Select Gender
                            </option>

                            <option value="Male">
                              Male
                            </option>

                            <option value="Female">
                              Female
                            </option>
                          </select>

                          <select
                            value={
                              item.bird1Age ||
                              ""
                            }
                            onChange={(e) =>
                              updatePairOptions(
                                item.id,
                                1,
                                e.target.value,
                                undefined
                              )
                            }
                            style={selectStyle}
                          >
                            <option value="">
                              Select Age
                            </option>

                            <option value="Young">
                              Young
                            </option>

                            <option value="Adult">
                              Adult
                            </option>
                          </select>

                        </div>
                      </div>

                      {/* =================================================
                          BIRD 2
                      ================================================= */}

                      <div
                        style={
                          pairBirdCardStyle
                        }
                      >

                        <h4
                          style={
                            pairBirdTitleStyle
                          }
                        >
                          🐦 Bird 2
                        </h4>

                        <div
                          className="birds-care-options-grid"
                          style={
                            optionsGridStyle
                          }
                        >

                          <select
                            value={
                              item.bird2Gender ||
                              ""
                            }
                            onChange={(e) =>
                              updatePairOptions(
                                item.id,
                                2,
                                undefined,
                                e.target.value
                              )
                            }
                            style={selectStyle}
                          >
                            <option value="">
                              Select Gender
                            </option>

                            <option value="Male">
                              Male
                            </option>

                            <option value="Female">
                              Female
                            </option>
                          </select>

                          <select
                            value={
                              item.bird2Age ||
                              ""
                            }
                            onChange={(e) =>
                              updatePairOptions(
                                item.id,
                                2,
                                e.target.value,
                                undefined
                              )
                            }
                            style={selectStyle}
                          >
                            <option value="">
                              Select Age
                            </option>

                            <option value="Young">
                              Young
                            </option>

                            <option value="Adult">
                              Adult
                            </option>
                          </select>

                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {/* =================================================
              BILL SUMMARY
              IMPORTANT:
              YE CART PRODUCTS KE BAAD HAI
          ================================================= */}

          <div
            className="birds-care-summary"
            style={summaryWrapperStyle}
          >

            <div
              className="birds-care-summary-card"
              style={summaryCardStyle}
            >

              <h2
                style={
                  summaryTitleStyle
                }
              >
                🧾 Bill Summary
              </h2>

              {/* SUBTOTAL */}

              <div
                style={
                  summaryRowStyle
                }
              >
                <span>
                  Subtotal
                </span>

                <b>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </b>
              </div>

              {/* DISCOUNT */}

              <div
                style={
                  summaryRowStyle
                }
              >
                <span>
                  Discount ({adminDiscount}%)
                </span>

                <b>
                  - ₹
                  {discountAmount.toLocaleString(
                    "en-IN"
                  )}
                </b>
              </div>

              {/* SHIPPING */}

              <div
                style={
                  summaryRowStyle
                }
              >
                <span>
                  Shipping
                </span>

                <b>
                  {shippingCharge === 0
                    ? "FREE"
                    : `₹${shippingCharge.toLocaleString(
                        "en-IN"
                      )}`}
                </b>
              </div>

              <hr
                style={{
                  border: 0,
                  borderTop:
                    "1px solid #d1d5db",
                  margin:
                    "18px 0",
                }}
              />

              {/* FINAL TOTAL */}

              <h2
                style={
                  finalTotalRowStyle
                }
              >
                Total ₹
                {finalTotal.toLocaleString(
                  "en-IN"
                )}
              </h2>

              {/* WARNING */}

              {hasIncompleteOptions && (
                <div
                  style={
                    warningStyle
                  }
                >
                  ⚠️ Please select Age and
                  Gender for all birds
                  before placing order.
                </div>
              )}

              {/* STOCK WARNING */}

              {hasOutOfStock && (
                <div
                  style={
                    warningStyle
                  }
                >
                  ❌ Out of Stock bird cart
                  me hai.
                </div>
              )}

              {/* =================================================
                  PLACE ORDER
                  YE SABSE LAST ME RAHEGA
              ================================================= */}

              <button
                type="button"
                className="birds-care-main-button"
                style={{
                  ...mainButtonStyle,
                  opacity:
                    hasIncompleteOptions ||
                    hasOutOfStock
                      ? 0.55
                      : 1,
                  cursor:
                    hasIncompleteOptions ||
                    hasOutOfStock
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={
                  hasIncompleteOptions ||
                  hasOutOfStock
                }
                onClick={
                  handlePlaceOrder
                }
              >
                🛍 Place Order
              </button>

              {/* CLEAR CART */}

              <button
                type="button"
                style={
                  clearButtonStyle
                }
                onClick={clearCart}
              >
                🗑 Clear Cart
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          CHECKOUT POPUP
      ===================================================== */}

      {showCheckout && (
        <div
          style={overlayStyle}
        >

          <div
            style={
              checkoutModalStyle
            }
          >

            <div
              style={
                checkoutHeaderStyle
              }
            >

              <h2
                style={{
                  margin: 0,
                }}
              >
                📦 Place Your Order
              </h2>

              <button
                type="button"
                style={
                  closeButtonStyle
                }
                onClick={() =>
                  setShowCheckout(false)
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleOrder}
            >

              {/* NAME */}

              <input
                style={inputStyle}
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
              />

              {/* PHONE */}

              <input
                style={inputStyle}
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                inputMode="numeric"
                required
              />

              {/* EMAIL */}

              <input
                style={inputStyle}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />

              {/* ADDRESS */}

              <textarea
                style={{
                  ...inputStyle,
                  minHeight: "90px",
                  resize: "vertical",
                }}
                placeholder="Address"
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                required
              />

              {/* CITY */}

              <input
                style={inputStyle}
                placeholder="City"
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                required
              />

              {/* PINCODE */}

              <input
                style={inputStyle}
                placeholder="Pincode"
                value={pincode}
                onChange={(e) =>
                  setPincode(
                    e.target.value
                  )
                }
                inputMode="numeric"
                required
              />

              {/* CONFIRM */}

              <button
                type="submit"
                style={
                  mainButtonStyle
                }
                disabled={
                  isOrdering
                }
              >
                {isOrdering
                  ? "⏳ Placing Order..."
                  : "✅ Confirm Order"}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// STYLES
// =========================================================

const pageStyle = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: "15px",
  boxSizing: "border-box",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginBottom: "15px",
};

const pageTitleStyle = {
  margin: 0,
  fontSize: "clamp(28px, 5vw, 42px)",
  fontWeight: "800",
  color: "#123c3a",
};

const itemsCountStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "8px 14px",
  borderRadius: "20px",
  whiteSpace: "nowrap",
  fontWeight: "600",
};

const cartCardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "14px",
  boxShadow:
    "0 2px 12px rgba(0,0,0,0.05)",
  boxSizing: "border-box",
  width: "100%",
};

const productBoxStyle = {
  display: "flex",
  gap: "14px",
  alignItems: "center",
};

const productImageStyle = {
  width: "90px",
  height: "90px",
  borderRadius: "12px",
  objectFit: "cover",
  flexShrink: 0,
};

const productNameStyle = {
  margin: "0 0 6px",
  fontSize: "22px",
  fontWeight: "800",
  color: "#111827",
  wordBreak: "break-word",
};

const productPriceStyle = {
  marginTop: "8px",
  color: "#047857",
  fontSize: "21px",
  fontWeight: "800",
};

const singleBadgeStyle = {
  display: "inline-block",
  background: "#ede9fe",
  color: "#5b21b6",
  padding: "5px 9px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600",
};

const pairBadgeStyle = {
  display: "inline-block",
  background: "#dbeafe",
  color: "#1d4ed8",
  padding: "5px 9px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600",
};

const mobileBottomStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: "15px",
  marginTop: "15px",
};

const quantityBoxStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  overflow: "hidden",
  marginTop: "5px",
  background: "#fff",
};

const quantityButtonStyle = {
  width: "38px",
  height: "38px",
  border: "none",
  background: "#fff",
  fontSize: "20px",
  cursor: "pointer",
};

const quantityNumberStyle = {
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "600",
};

const itemTotalAreaStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const itemTotalStyle = {
  color: "#047857",
  fontSize: "18px",
};

const removeButtonStyle = {
  border: "none",
  background: "transparent",
  color: "#dc2626",
  fontSize: "15px",
  cursor: "pointer",
  padding: "4px",
};

const detailsCardStyle = {
  marginTop: "15px",
  padding: "14px",
  background: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #eef2f7",
};

const pairDetailsContainerStyle = {
  marginTop: "15px",
  padding: "14px",
  background: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #eef2f7",
};

const detailsTitleStyle = {
  margin: "0 0 12px",
  color: "#123c3a",
  fontSize: "19px",
};

const pairBirdCardStyle = {
  background: "#ffffff",
  borderRadius: "10px",
  padding: "12px",
  marginTop: "10px",
  border: "1px solid #e5e7eb",
};

const pairBirdTitleStyle = {
  margin: "0 0 10px",
  color: "#374151",
  fontSize: "16px",
};

const optionsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "10px",
};

const selectStyle = {
  width: "100%",
  height: "44px",
  borderRadius: "9px",
  border: "1px solid #d1d5db",
  padding: "5px 10px",
  background: "#ffffff",
  fontSize: "15px",
  boxSizing: "border-box",
};

const summaryWrapperStyle = {
  width: "100%",
};

const summaryCardStyle = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow:
    "0 2px 12px rgba(0,0,0,0.05)",
  boxSizing: "border-box",
  width: "100%",
};

const summaryTitleStyle = {
  marginTop: 0,
  marginBottom: "20px",
  color: "#123c3a",
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginBottom: "14px",
  fontSize: "16px",
};

const finalTotalRowStyle = {
  color: "#047857",
  fontSize: "25px",
  margin: "15px 0",
};

const warningStyle = {
  background: "#fff7ed",
  color: "#c2410c",
  border: "1px solid #fed7aa",
  padding: "10px",
  borderRadius: "9px",
  fontSize: "13px",
  lineHeight: "1.4",
  marginTop: "10px",
};

const mainButtonStyle = {
  width: "100%",
  background: "#087f78",
  color: "#ffffff",
  border: "none",
  padding: "13px 15px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "16px",
  marginTop: "10px",
  boxSizing: "border-box",
  cursor: "pointer",
};

const clearButtonStyle = {
  width: "100%",
  background: "#ffffff",
  color: "#dc2626",
  border: "1px solid #dc2626",
  padding: "12px 15px",
  borderRadius: "10px",
  fontSize: "15px",
  marginTop: "10px",
  cursor: "pointer",
  boxSizing: "border-box",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "15px",
  boxSizing: "border-box",
  overflowY: "auto",
};

const checkoutModalStyle = {
  background: "#ffffff",
  width: "100%",
  maxWidth: "440px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "20px",
  borderRadius: "16px",
  boxSizing: "border-box",
};

const checkoutHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
};

const closeButtonStyle = {
  border: "none",
  background: "transparent",
  fontSize: "30px",
  lineHeight: 1,
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "9px",
  boxSizing: "border-box",
  fontSize: "15px",
};

const emptyCardStyle = {
  background: "#ffffff",
  padding: "40px 20px",
  borderRadius: "16px",
  textAlign: "center",
  maxWidth: "500px",
  margin: "40px auto",
};

const emptyIconStyle = {
  fontSize: "50px",
};

export default Cart;