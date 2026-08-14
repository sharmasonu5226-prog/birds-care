import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../context/CartContext";


function Cart() {

  const {
    cart,
    removeFromCart,
    clearCart,
    updateItemOptions,
    updateQuantity
  } = useContext(CartContext);


  const navigate = useNavigate();


  const [showCheckout, setShowCheckout] =
    useState(false);


  // =========================
  // CUSTOMER DETAILS
  // =========================

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [pincode, setPincode] =
    useState("");


  const [isOrdering, setIsOrdering] =
    useState(false);


  // =========================
  // OUT OF STOCK
  // =========================

  const outOfStockItems =
    cart.filter(
      (item) =>
        item.stock === "Out of Stock" ||
        item.stock === false ||
        item.inStock === false
    );


  const hasOutOfStock =
    outOfStockItems.length > 0;


  // =========================
  // CHECK ALL OPTIONS
  // =========================

  const incompleteItems =
    cart.filter(
      (item) =>
        !item.age ||
        !item.gender ||
        Number(item.quantity) < 1
    );


  const hasIncompleteOptions =
    incompleteItems.length > 0;


  // =========================
  // GET PRICE
  // =========================

  const getPrice = (item) => {

    return (
      Number(
        String(item.price || 0)
          .replace("₹", "")
          .replace(/,/g, "")
          .trim()
      ) || 0
    );

  };


  // =========================
  // GET QUANTITY
  // =========================

  const getQuantity = (item) => {

    return Number(item.quantity) > 0
      ? Number(item.quantity)
      : 1;

  };


  // =========================
  // TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) => {

      const price =
        getPrice(item);

      const quantity =
        getQuantity(item);

      return (
        sum +
        price * quantity
      );

    },
    0
  );


  // =========================
  // PLACE ORDER
  // =========================

  const handleOrder = async (e) => {

    e.preventDefault();


    // =========================
    // EMPTY CART
    // =========================

    if (cart.length === 0) {

      alert(
        "Your cart is empty 🛒"
      );

      return;
    }


    // =========================
    // OPTIONS CHECK
    // =========================

    if (hasIncompleteOptions) {

      alert(
        "❌ Please select Age, Gender and Quantity for every bird."
      );

      return;
    }


    // =========================
    // STOCK CHECK
    // =========================

    if (hasOutOfStock) {

      alert(
        "❌ Out of Stock bird cart me hai.\n\n" +
        "Please Out of Stock bird ko remove karein."
      );

      return;
    }


    // =========================
    // CUSTOMER VALIDATION
    // =========================

    const cleanName =
      name.trim();

    const cleanPhone =
      phone.trim();

    const cleanEmail =
      email.trim();

    const cleanAddress =
      address.trim();

    const cleanCity =
      city.trim();

    const cleanPincode =
      pincode.trim();


    if (
      !cleanName ||
      !cleanPhone ||
      !cleanEmail ||
      !cleanAddress ||
      !cleanCity ||
      !cleanPincode
    ) {

      alert(
        "❌ Please fill Name, Mobile, Gmail, Address, City and Pincode."
      );

      return;
    }


    // =========================
    // EMAIL VALIDATION
    // =========================

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(cleanEmail)) {

      alert(
        "❌ Please enter a valid Gmail / Email address."
      );

      return;
    }


    // =========================
    // MOBILE VALIDATION
    // =========================

    const mobileDigits =
      cleanPhone.replace(/\D/g, "");


    if (
      mobileDigits.length !== 10
    ) {

      alert(
        "❌ Please enter a valid 10 digit mobile number."
      );

      return;
    }


    // =========================
    // PINCODE VALIDATION
    // =========================

    const pincodeDigits =
      cleanPincode.replace(/\D/g, "");


    if (
      pincodeDigits.length !== 6
    ) {

      alert(
        "❌ Please enter a valid 6 digit pincode."
      );

      return;
    }


    setIsOrdering(true);


    // =========================
    // ORDER ID
    // =========================

    const orderId =
      `BC-${Date.now()}`;


    const orderDate =
      new Date().toLocaleString(
        "en-IN"
      );


    // =========================
    // ORDER DATA
    // =========================
    //
    // IMPORTANT:
    // Server ko customerName,
    // phone, email etc DIRECT
    // chahiye.
    //
    // customer: { ... }
    // ke andar nahi bhejna.
    // =========================

    const order = {

      orderId,

      orderDate,

      customerName:
        cleanName,

      phone:
        cleanPhone,

      email:
        cleanEmail,

      address:
        cleanAddress,

      city:
        cleanCity,

      pincode:
        pincodeDigits,

      items:
        cart,

      subtotal:
        total,

      discount:
        0,

      deliveryCharge:
        0,

      total:
        total,

      paymentMethod:
        "Cash on Delivery",

      paymentStatus:
        "Pending",

      status:
        "Order Placed"

    };


    // =========================
    // SAVE ORDER LOCALLY
    // =========================

    try {

      const oldOrders =
        JSON.parse(
          localStorage.getItem(
            "orders"
          )
        ) || [];


      localStorage.setItem(
        "orders",
        JSON.stringify([
          ...oldOrders,
          order
        ])
      );

    } catch (storageError) {

      console.error(
        "Order local save error:",
        storageError
      );

    }


    // =========================
    // SEND SERVER
    // =========================

    try {

      const response =
        await fetch(
          "http://10.206.203.228:5000/api/send-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(order)
          }
        );


      // =========================
      // SERVER RESPONSE
      // =========================

      let result = {};

      try {

        result =
          await response.json();

      } catch (jsonError) {

        console.error(
          "Server JSON error:",
          jsonError
        );

        throw new Error(
          "Server ne valid response nahi diya."
        );

      }


      console.log(
        "SERVER RESPONSE:",
        result
      );


      // =========================
      // SERVER ERROR
      // =========================

      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.message ||
          "Order email send nahi hua."
        );

      }


      // =========================
      // CLEAR CART
      // =========================

      clearCart();


      // =========================
      // RESET FORM
      // =========================

      setName("");

      setPhone("");

      setEmail("");

      setAddress("");

      setCity("");

      setPincode("");


      setShowCheckout(false);


      // =========================
      // EMAIL STATUS
      // =========================

      if (
        result.customerEmailSent
      ) {

        alert(
          "🎉 Order placed successfully!\n\n" +
          "📧 Store aur customer dono Gmail par order email bhej diya gaya."
        );

      } else {

        alert(
          "🎉 Order placed successfully!\n\n" +
          "📧 Store Gmail par order aa gaya.\n\n" +
          "⚠️ Customer Gmail par confirmation nahi bheja ja saka."
        );

      }


      // =========================
      // HOME
      // =========================

      navigate("/");


    } catch (error) {

      console.error(
        "ORDER ERROR:",
        error
      );


      alert(
        "❌ Order email send nahi hua.\n\n" +
        error.message +
        "\n\n" +
        "Server terminal me error check karein."
      );

    } finally {

      setIsOrdering(false);

    }

  };


  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#f7faf8",
          padding: "50px 7%",
          boxSizing: "border-box"
        }}
      >

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto"
          }}
        >

          <h1
            style={{
              textAlign: "center",
              color: "#123b35",
              marginBottom: "35px"
            }}
          >
            Your Cart 🛒
          </h1>


          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "60px 25px",
              textAlign: "center",
              boxShadow:
                "0 7px 25px rgba(0,0,0,0.08)"
            }}
          >

            <div
              style={{
                fontSize: "65px",
                marginBottom: "15px"
              }}
            >
              🛒
            </div>


            <h2
              style={{
                color: "#123b35"
              }}
            >
              Cart is Empty
            </h2>


            <p
              style={{
                color: "#777",
                marginBottom: "25px"
              }}
            >
              Add some beautiful birds
              to your cart.
            </p>


            <button
              onClick={() =>
                navigate("/products")
              }
              style={buttonStyle}
            >
              Browse Birds
            </button>

          </div>

        </div>

      </div>

    );

  }


  // =========================
  // MAIN PAGE
  // =========================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f7faf8",
        padding: "50px 7%",
        boxSizing: "border-box"
      }}
    >

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            color: "#123b35",
            marginBottom: "35px"
          }}
        >
          Your Cart 🛒
        </h1>


        {/* =========================
            CART ITEMS
        ========================= */}

        <div
          style={{
            display: "grid",
            gap: "20px"
          }}
        >

          {cart.map((item) => {

            const isOutOfStock =
              item.stock === "Out of Stock" ||
              item.stock === false ||
              item.inStock === false;


            const itemQuantity =
              getQuantity(item);


            const itemPrice =
              getPrice(item);


            const itemTotal =
              itemPrice *
              itemQuantity;


            return (

              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "22px",
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.07)"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                    flexWrap: "wrap"
                  }}
                >

                  {/* IMAGE */}

                  {item.image &&
                  (
                    item.image.startsWith("http") ||
                    item.image.startsWith("data:image")
                  ) ? (

                    <img
                      src={item.image}
                      alt={
                        item.name ||
                        "Bird"
                      }
                      style={{
                        width: "130px",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        background: "#edf5f1"
                      }}
                    />

                  ) : (

                    <div
                      style={{
                        width: "130px",
                        height: "110px",
                        borderRadius: "12px",
                        background: "#edf5f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "50px"
                      }}
                    >
                      {item.emoji || "🐦"}
                    </div>

                  )}


                  {/* DETAILS */}

                  <div
                    style={{
                      flex: 1,
                      minWidth: "230px"
                    }}
                  >

                    <h2
                      style={{
                        margin: "0 0 8px",
                        color: "#123b35"
                      }}
                    >
                      {item.name}
                    </h2>


                    <p
                      style={{
                        color: "#0f766e",
                        fontWeight: "800",
                        fontSize: "19px",
                        margin: "0 0 8px"
                      }}
                    >
                      ₹
                      {itemPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>


                    <p
                      style={{
                        margin: 0,
                        color:
                          isOutOfStock
                            ? "#dc2626"
                            : "#16a34a",
                        fontWeight: "800"
                      }}
                    >
                      {isOutOfStock
                        ? "❌ Out of Stock"
                        : "✅ In Stock"}
                    </p>

                  </div>


                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                    style={{
                      border: "none",
                      background: "#dc3545",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    ❌ Remove
                  </button>

                </div>


                {/* =========================
                    SELECTIONS
                ========================= */}

                <div
                  style={{
                    marginTop: "22px",
                    paddingTop: "20px",
                    borderTop:
                      "1px solid #e5e7eb"
                  }}
                >

                  <h3
                    style={{
                      marginTop: 0,
                      color: "#123b35"
                    }}
                  >
                    Select Bird Details
                  </h3>


                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "18px"
                    }}
                  >

                    {/* AGE */}

                    <div>

                      <label
                        style={labelStyle}
                      >
                        Age *
                      </label>


                      <div
                        style={{
                          display: "flex",
                          gap: "8px"
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            updateItemOptions(
                              item.id,
                              "Young",
                              item.gender
                            )
                          }
                          style={{
                            ...optionButtonStyle,
                            ...(item.age === "Young"
                              ? selectedOptionStyle
                              : {})
                          }}
                        >
                          🐣 Young
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            updateItemOptions(
                              item.id,
                              "Adult",
                              item.gender
                            )
                          }
                          style={{
                            ...optionButtonStyle,
                            ...(item.age === "Adult"
                              ? selectedOptionStyle
                              : {})
                          }}
                        >
                          🐦 Adult
                        </button>

                      </div>

                    </div>


                    {/* GENDER */}

                    <div>

                      <label
                        style={labelStyle}
                      >
                        Gender *
                      </label>


                      <div
                        style={{
                          display: "flex",
                          gap: "8px"
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            updateItemOptions(
                              item.id,
                              item.age,
                              "Male"
                            )
                          }
                          style={{
                            ...optionButtonStyle,
                            ...(item.gender === "Male"
                              ? selectedOptionStyle
                              : {})
                          }}
                        >
                          ♂ Male
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            updateItemOptions(
                              item.id,
                              item.age,
                              "Female"
                            )
                          }
                          style={{
                            ...optionButtonStyle,
                            ...(item.gender === "Female"
                              ? selectedOptionStyle
                              : {})
                          }}
                        >
                          ♀ Female
                        </button>

                      </div>

                    </div>


                    {/* QUANTITY */}

                    <div>

                      <label
                        style={labelStyle}
                      >
                        Quantity *
                      </label>


                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px"
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              itemQuantity - 1
                            )
                          }
                          style={quantityButtonStyle}
                        >
                          −
                        </button>


                        <strong
                          style={{
                            fontSize: "18px"
                          }}
                        >
                          {itemQuantity}
                        </strong>


                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              itemQuantity + 1
                            )
                          }
                          style={quantityButtonStyle}
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>


                  {/* SELECTION WARNING */}

                  {(!item.age ||
                    !item.gender) && (

                    <p
                      style={{
                        color: "#dc2626",
                        fontWeight: "700",
                        marginBottom: 0
                      }}
                    >
                      ⚠️ Please select Age and
                      Gender before placing order.
                    </p>

                  )}


                  {/* ITEM TOTAL */}

                  <div
                    style={{
                      marginTop: "18px",
                      padding: "14px",
                      background: "#f0fdf4",
                      borderRadius: "10px",
                      fontWeight: "800",
                      color: "#123b35"
                    }}
                  >
                    Item Total: ₹
                    {itemTotal.toLocaleString(
                      "en-IN"
                    )}
                  </div>

                </div>

              </div>

            );

          })}

        </div>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div
          style={{
            background: "white",
            marginTop: "25px",
            padding: "25px",
            borderRadius: "16px",
            boxShadow:
              "0 5px 18px rgba(0,0,0,0.07)"
          }}
        >

          <h2
            style={{
              color: "#123b35",
              marginTop: 0
            }}
          >
            Total: ₹
            {total.toLocaleString(
              "en-IN"
            )}
          </h2>


          {/* INCOMPLETE WARNING */}

          {hasIncompleteOptions && (

            <div
              style={{
                background: "#fff7ed",
                color: "#c2410c",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "18px",
                fontWeight: "700"
              }}
            >
              ⚠️ Please select Age, Gender and
              Quantity for every bird before
              placing the order.
            </div>

          )}


          {/* OUT OF STOCK */}

          {hasOutOfStock && (

            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "18px",
                fontWeight: "700"
              }}
            >
              ❌ Cart me Out of Stock bird hai.
              <br />
              Please us bird ko remove karein.
            </div>

          )}


          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >

            {/* PLACE ORDER */}

            <button
              type="button"
              disabled={
                hasIncompleteOptions ||
                hasOutOfStock ||
                isOrdering
              }
              onClick={() => {

                if (
                  hasIncompleteOptions
                ) {

                  alert(
                    "❌ Please select Age, Gender and Quantity for every bird."
                  );

                  return;
                }


                if (hasOutOfStock) {

                  alert(
                    "❌ Out of Stock bird ko pehle remove karein."
                  );

                  return;
                }


                setShowCheckout(true);

              }}
              style={{
                border: "none",
                background:
                  hasIncompleteOptions ||
                  hasOutOfStock ||
                  isOrdering
                    ? "#94a3b8"
                    : "#0f766e",
                color: "white",
                padding: "14px 25px",
                borderRadius: "9px",
                fontSize: "16px",
                fontWeight: "700",
                cursor:
                  hasIncompleteOptions ||
                  hasOutOfStock ||
                  isOrdering
                    ? "not-allowed"
                    : "pointer"
              }}
            >
              🛍️ Place Order
            </button>


            {/* CLEAR */}

            <button
              type="button"
              onClick={() => {

                if (
                  window.confirm(
                    "Are you sure you want to clear the cart?"
                  )
                ) {

                  clearCart();

                }

              }}
              style={{
                border: "none",
                background: "#dc3545",
                color: "white",
                padding: "14px 25px",
                borderRadius: "9px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              Clear Cart
            </button>

          </div>

        </div>


        {/* =========================
            CHECKOUT POPUP
        ========================= */}

        {showCheckout && (

          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 9999
            }}
          >

            <div
              style={{
                width: "100%",
                maxWidth: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "white",
                borderRadius: "18px",
                padding: "30px",
                boxSizing: "border-box"
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  color: "#123b35"
                }}
              >
                Place Your Order 📦
              </h2>


              <p
                style={{
                  color: "#777"
                }}
              >
                Total Amount: ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </p>


              <form
                onSubmit={handleOrder}
              >

                {/* NAME */}

                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                  autoComplete="name"
                  style={inputStyle}
                />


                {/* MOBILE */}

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  required
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  style={inputStyle}
                />


                {/* GMAIL / EMAIL */}

                <input
                  type="email"
                  placeholder="Gmail / Email Address"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  autoComplete="email"
                  style={inputStyle}
                />


                {/* ADDRESS */}

                <textarea
                  placeholder="Full Delivery Address"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  required
                  autoComplete="street-address"
                  style={{
                    ...inputStyle,
                    minHeight: "90px"
                  }}
                />


                {/* CITY */}

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  required
                  autoComplete="address-level2"
                  style={inputStyle}
                />


                {/* PINCODE */}

                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(
                      e.target.value
                    )
                  }
                  required
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={6}
                  style={inputStyle}
                />


                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={isOrdering}
                  style={{
                    width: "100%",
                    border: "none",
                    background:
                      isOrdering
                        ? "#94a3b8"
                        : "#0f766e",
                    color: "white",
                    padding: "14px",
                    borderRadius: "9px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor:
                      isOrdering
                        ? "not-allowed"
                        : "pointer"
                  }}
                >
                  {isOrdering
                    ? "⏳ Sending Order..."
                    : "✅ Confirm Order"}
                </button>


                {/* CANCEL */}

                <button
                  type="button"
                  disabled={isOrdering}
                  onClick={() =>
                    setShowCheckout(false)
                  }
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    border:
                      "1px solid #ccd9d5",
                    background: "white",
                    color: "#555",
                    padding: "13px",
                    borderRadius: "9px",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor:
                      isOrdering
                        ? "not-allowed"
                        : "pointer"
                  }}
                >
                  Cancel
                </button>

              </form>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}


// =========================
// STYLES
// =========================

const buttonStyle = {

  border: "none",

  background: "#0f766e",

  color: "white",

  padding: "13px 25px",

  borderRadius: "9px",

  fontSize: "15px",

  fontWeight: "700",

  cursor: "pointer"

};


const inputStyle = {

  width: "100%",

  boxSizing: "border-box",

  padding: "13px",

  marginBottom: "14px",

  border: "1px solid #ccd9d5",

  borderRadius: "9px",

  fontSize: "15px"

};


const labelStyle = {

  display: "block",

  marginBottom: "8px",

  color: "#123b35",

  fontWeight: "700"

};


const optionButtonStyle = {

  border: "1px solid #ccd9d5",

  background: "white",

  color: "#123b35",

  padding: "10px 14px",

  borderRadius: "8px",

  cursor: "pointer",

  fontWeight: "700"

};


const selectedOptionStyle = {

  background: "#0f766e",

  color: "white",

  borderColor: "#0f766e"

};


const quantityButtonStyle = {

  width: "38px",

  height: "38px",

  border: "none",

  background: "#0f766e",

  color: "white",

  borderRadius: "8px",

  fontSize: "22px",

  fontWeight: "700",

  cursor: "pointer"

};


export default Cart;