import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const handleOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const order = {
      id: Date.now(),
      customerName: name,
      phone: phone,
      address: address,
      city: city,
      pincode: pincode,
      items: cart,
      total: total,
      status: "Order Placed",
      date: new Date().toLocaleString(),
    };

    const oldOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    localStorage.setItem(
      "orders",
      JSON.stringify([...oldOrders, order])
    );

    clearCart();

    alert(
      "🎉 Order placed successfully!\n\nOrder ID: " +
        order.id
    );

    setName("");
    setPhone("");
    setAddress("");
    setCity("");
    setPincode("");

    setShowCheckout(false);

    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7faf8",
        padding: "50px 7%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#123b35",
            marginBottom: "35px",
          }}
        >
          Your Cart 🛒
        </h1>

        {cart.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "60px 25px",
              textAlign: "center",
              boxShadow:
                "0 7px 25px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "65px",
                marginBottom: "15px",
              }}
            >
              🛒
            </div>

            <h2
              style={{
                color: "#123b35",
                marginBottom: "10px",
              }}
            >
              Cart is Empty
            </h2>

            <p
              style={{
                color: "#777",
                marginBottom: "25px",
              }}
            >
              Add some beautiful birds to your cart.
            </p>

            <button
              onClick={() => navigate("/products")}
              style={{
                border: "none",
                background: "#0f766e",
                color: "white",
                padding: "13px 25px",
                borderRadius: "9px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Browse Birds
            </button>
          </div>
        ) : (
          <>
            {/* CART ITEMS */}

            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    boxShadow:
                      "0 5px 18px rgba(0,0,0,0.07)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "110px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      background: "#edf5f1",
                    }}
                  />

                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 8px",
                        color: "#123b35",
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color: "#0f766e",
                        fontSize: "18px",
                        fontWeight: "800",
                      }}
                    >
                      ₹{item.price}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    style={{
                      border: "none",
                      background: "#dc3545",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Remove
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL */}

            <div
              style={{
                background: "white",
                marginTop: "25px",
                padding: "25px",
                borderRadius: "16px",
                boxShadow:
                  "0 5px 18px rgba(0,0,0,0.07)",
              }}
            >
              <h2
                style={{
                  color: "#123b35",
                  margin: "0 0 20px",
                }}
              >
                Total: ₹{total}
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() =>
                    setShowCheckout(true)
                  }
                  style={{
                    border: "none",
                    background: "#0f766e",
                    color: "white",
                    padding: "14px 25px",
                    borderRadius: "9px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  🛍️ Place Order
                </button>

                <button
                  onClick={clearCart}
                  style={{
                    border: "none",
                    background: "#dc3545",
                    color: "white",
                    padding: "14px 25px",
                    borderRadius: "9px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}

        {/* CHECKOUT POPUP */}

        {showCheckout && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 9999,
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
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#123b35",
                }}
              >
                Place Your Order 📦
              </h2>

              <p
                style={{
                  color: "#777",
                  marginBottom: "25px",
                }}
              >
                Total Amount: ₹{total}
              </p>

              <form onSubmit={handleOrder}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  style={inputStyle}
                />

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                  style={inputStyle}
                />

                <textarea
                  placeholder="Full Address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  required
                  style={{
                    ...inputStyle,
                    minHeight: "90px",
                    resize: "vertical",
                  }}
                />

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  required
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value)
                  }
                  required
                  style={inputStyle}
                />

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    border: "none",
                    background: "#0f766e",
                    color: "white",
                    padding: "14px",
                    borderRadius: "9px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  ✅ Confirm Order
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowCheckout(false)
                  }
                  style={{
                    width: "100%",
                    border:
                      "1px solid #ccd9d5",
                    background: "white",
                    color: "#555",
                    padding: "13px",
                    borderRadius: "9px",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: "pointer",
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

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginBottom: "14px",
  border: "1px solid #ccd9d5",
  borderRadius: "9px",
  fontSize: "15px",
};

export default Cart;