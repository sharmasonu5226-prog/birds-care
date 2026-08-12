import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const { cart, clearCart } = useContext(CartContext);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // PRICE
  // =========================

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

  // =========================
  // QUANTITY
  // =========================

  const getQuantity = (item) => {
    const quantity = Number(
      item?.quantity ?? item?.qty ?? 1
    );

    return quantity > 0 ? quantity : 1;
  };

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal = cart.reduce((sum, item) => {
    return (
      sum +
      getPrice(item) * getQuantity(item)
    );
  }, 0);

  // =========================
  // DISCOUNT
  // =========================

  const discount = cart.reduce((sum, item) => {
    const itemDiscount = Number(
      item?.discount ?? 0
    ) || 0;

    return (
      sum +
      itemDiscount * getQuantity(item)
    );
  }, 0);

  // =========================
  // DELIVERY
  // =========================

  const deliveryCharge = 0;

  // =========================
  // GRAND TOTAL
  // =========================

  const total = Math.max(
    0,
    subtotal - discount + deliveryCharge
  );

  // =========================
  // CHANGE HANDLER
  // =========================

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT ORDER
  // =========================

  const submitOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty 🛒");
      return;
    }

    if (
      !form.name.trim() ||
      !form.mobile.trim() ||
      !form.email.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.pincode.trim()
    ) {
      alert("Please fill all details ❌");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // ORDER ID
      // =========================

      const orderId = "BC" + Date.now();

      const orderDate =
        new Date().toLocaleString("en-IN");

      // =========================
      // BILL DATA
      // =========================

      const billData = {
        orderId,
        orderDate,

        orderStatus: "Confirmed",

        paymentMethod: "Cash on Delivery",

        paymentStatus: "Pending",

        customer: {
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
        },

        items: cart,

        subtotal,
        discount,
        deliveryCharge,
        total,
      };

      // =========================
      // SEND TO SERVER
      // =========================

      const response = await fetch(
        "http://localhost:5000/api/send-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            orderId,
            orderDate,

            orderStatus: "Confirmed",

            paymentMethod:
              "Cash on Delivery",

            paymentStatus: "Pending",

            customer: {
              name: form.name.trim(),
              mobile: form.mobile.trim(),
              email: form.email.trim(),
              address: form.address.trim(),
              city: form.city.trim(),
              pincode: form.pincode.trim(),
            },

            items: cart,

            subtotal,
            discount,
            deliveryCharge,
            total,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "SERVER RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Order failed"
        );
      }

      // =========================
      // SAVE BILL
      // =========================

      localStorage.setItem(
        "birdsCareLastOrder",
        JSON.stringify(billData)
      );

      // =========================
      // VERIFY BILL SAVED
      // =========================

      const savedBill =
        localStorage.getItem(
          "birdsCareLastOrder"
        );

      console.log(
        "BILL SAVED:",
        savedBill
      );

      if (!savedBill) {
        throw new Error(
          "Bill save nahi hua. Please try again."
        );
      }

      // =========================
      // CLEAR CART
      // =========================

      clearCart();

      // =========================
      // SUCCESS
      // =========================

      alert(
        "Order placed successfully 🎉"
      );

      // =========================
      // BILL PAGE
      // =========================

      navigate("/bill");

    } catch (error) {
      console.error(
        "ORDER ERROR:",
        error
      );

      alert(
        "Order place nahi hua ❌\n\n" +
          error.message
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PAGE
  // =========================

  return (
    <section className="checkout-section">

      <div className="checkout-box">

        <h1>
          🧾 Checkout
        </h1>

        <form
          onSubmit={submitOrder}
        >

          {/* NAME */}

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={changeHandler}
            required
          />

          {/* MOBILE */}

          <input
            name="mobile"
            type="tel"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={changeHandler}
            required
          />

          {/* EMAIL */}

          <input
            name="email"
            type="email"
            placeholder="Gmail Address"
            value={form.email}
            onChange={changeHandler}
            required
          />

          {/* ADDRESS */}

          <textarea
            name="address"
            placeholder="Full Delivery Address"
            value={form.address}
            onChange={changeHandler}
            required
          />

          {/* CITY */}

          <input
            name="city"
            type="text"
            placeholder="City"
            value={form.city}
            onChange={changeHandler}
            required
          />

          {/* PINCODE */}

          <input
            name="pincode"
            type="text"
            inputMode="numeric"
            placeholder="Pincode"
            value={form.pincode}
            onChange={changeHandler}
            required
          />

          {/* SUMMARY */}

          <div className="checkout-summary">

            <h3>
              Order Summary
            </h3>

            <p>
              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </p>

            <p>
              <span>
                Discount
              </span>

              <strong>
                - ₹
                {discount.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </p>

            <p>
              <span>
                Delivery
              </span>

              <strong>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge.toLocaleString(
                      "en-IN"
                    )}`}
              </strong>
            </p>

            <hr />

            <h2>
              <span>
                Grand Total
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </h2>

          </div>

          {/* PLACE ORDER */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

          {/* CANCEL */}

          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
            disabled={loading}
          >
            Cancel
          </button>

        </form>

      </div>

    </section>
  );
}

export default Checkout;