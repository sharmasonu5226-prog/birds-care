import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Bill() {
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  // =========================
  // LOAD BILL
  // =========================

  useEffect(() => {
    const savedOrder = localStorage.getItem(
      "birdsCareLastOrder"
    );

    if (!savedOrder) {
      return;
    }

    try {
      const parsedOrder = JSON.parse(savedOrder);

      setOrder(parsedOrder);
    } catch (error) {
      console.error(
        "Bill loading error:",
        error
      );
    }
  }, []);

  // =========================
  // NUMBER
  // =========================

  const getNumber = (value) => {
    const number = Number(
      String(value ?? 0)
        .replace("₹", "")
        .replace(/,/g, "")
        .trim()
    );

    return Number.isFinite(number)
      ? number
      : 0;
  };

  // =========================
  // PRICE FORMAT
  // =========================

  const formatPrice = (value) => {
    return getNumber(value).toLocaleString(
      "en-IN"
    );
  };

  // =========================
  // ITEM PRICE
  // =========================

  const getPrice = (item) => {
    return getNumber(item?.price);
  };

  // =========================
  // ITEM DISCOUNT
  // =========================

  const getItemDiscount = (item) => {
    return getNumber(item?.discount);
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
  // ITEM NAME
  // =========================

  const getItemName = (item) => {
    return (
      item?.name ||
      item?.title ||
      item?.birdName ||
      "Bird"
    );
  };

  // =========================
  // ITEM IMAGE
  // =========================

  const getItemImage = (item) => {
    return (
      item?.image ||
      item?.mainImage ||
      item?.img ||
      ""
    );
  };

  // =========================
  // NO BILL
  // =========================

  if (!order) {
    return (
      <section className="bill-page">
        <div className="bill-empty">

          <h2>
            No Bill Found
          </h2>

          <p>
            Please place an order first.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </button>

        </div>
      </section>
    );
  }

  // =========================
  // CUSTOMER
  // =========================

  const customer = order.customer || {};

  // =========================
  // ORDER ITEMS
  // =========================

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  // =========================
  // BILL VALUES
  // =========================

  const calculatedSubtotal = items.reduce(
    (sum, item) => {
      const price = getPrice(item);
      const quantity = getQuantity(item);

      return sum + price * quantity;
    },
    0
  );

  const calculatedDiscount = items.reduce(
    (sum, item) => {
      const itemDiscount =
        getItemDiscount(item);

      const quantity =
        getQuantity(item);

      return (
        sum +
        itemDiscount * quantity
      );
    },
    0
  );

  const subtotal =
    getNumber(order.subtotal) ||
    calculatedSubtotal;

  const discount =
    getNumber(order.discount) ||
    calculatedDiscount;

  const deliveryCharge =
    getNumber(order.deliveryCharge);

  const total =
    getNumber(order.total) ||
    Math.max(
      0,
      subtotal -
        discount +
        deliveryCharge
    );

  // =========================
  // PAGE
  // =========================

  return (
    <section className="bill-page">

      <div className="bill-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="bill-header">

          <div>
            <h1>
              BIRDS CARE
            </h1>

            <p>
              Birds & Pets Store
            </p>
          </div>

          <div className="invoice-title">

            <h2>
              TAX INVOICE
            </h2>

            <p>
              Original Bill
            </p>

          </div>

        </div>

        <div className="bill-line" />

        {/* =========================
            ORDER INFO
        ========================= */}

        <div className="bill-info-grid">

          <div>

            <h3>
              Order Details
            </h3>

            <p>
              <strong>
                Order ID:
              </strong>{" "}
              {order.orderId || "-"}
            </p>

            <p>
              <strong>
                Date:
              </strong>{" "}
              {order.orderDate || "-"}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}

              <span className="status">
                {order.orderStatus ||
                  "Confirmed"}
              </span>
            </p>

          </div>

          <div>

            <h3>
              Payment Details
            </h3>

            <p>
              <strong>
                Payment:
              </strong>{" "}
              {order.paymentMethod ||
                "Cash on Delivery"}
            </p>

            <p>
              <strong>
                Payment Status:
              </strong>{" "}
              {order.paymentStatus ||
                "Pending"}
            </p>

          </div>

        </div>

        {/* =========================
            CUSTOMER
        ========================= */}

        <div className="customer-box">

          <h3>
            Customer Details
          </h3>

          <div className="customer-grid">

            <div>
              <strong>
                Name
              </strong>

              <p>
                {customer.name || "-"}
              </p>
            </div>

            <div>
              <strong>
                Mobile
              </strong>

              <p>
                {customer.mobile || "-"}
              </p>
            </div>

            <div>
              <strong>
                Gmail / Email
              </strong>

              <p>
                {customer.email || "-"}
              </p>
            </div>

            <div>
              <strong>
                City
              </strong>

              <p>
                {customer.city || "-"}
              </p>
            </div>

            <div>
              <strong>
                Pincode
              </strong>

              <p>
                {customer.pincode || "-"}
              </p>
            </div>

          </div>

          <div className="address">

            <strong>
              Delivery Address
            </strong>

            <p>
              {customer.address || "-"}
            </p>

          </div>

        </div>

        {/* =========================
            ITEMS
        ========================= */}

        <div className="items-section">

          <h3>
            Order Items
          </h3>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>

              </thead>

              <tbody>

                {items.map(
                  (item, index) => {

                    const price =
                      getPrice(item);

                    const quantity =
                      getQuantity(item);

                    const amount =
                      price * quantity;

                    const image =
                      getItemImage(item);

                    return (
                      <tr
                        key={
                          item?.id ||
                          item?._id ||
                          index
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>

                          <div className="bill-item">

                            {image && (
                              <img
                                src={image}
                                alt={getItemName(
                                  item
                                )}
                              />
                            )}

                            <span>
                              {getItemName(
                                item
                              )}
                            </span>

                          </div>

                        </td>

                        <td>
                          {quantity}
                        </td>

                        <td>
                          ₹
                          {formatPrice(
                            price
                          )}
                        </td>

                        <td>
                          ₹
                          {formatPrice(
                            amount
                          )}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =========================
            TOTALS
        ========================= */}

        <div className="bill-bottom">

          <div className="thank-you">

            <h3>
              Thank You! 🐦
            </h3>

            <p>
              Thank you for shopping
              with Birds Care.
            </p>

            <p>
              We will contact you
              regarding your order.
            </p>

          </div>

          <div className="totals">

            {/* SUBTOTAL */}

            <div>
              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {formatPrice(
                  subtotal
                )}
              </strong>
            </div>

            {/* DISCOUNT */}

            <div>
              <span>
                Discount
              </span>

              <strong className="discount-text">
                - ₹
                {formatPrice(
                  discount
                )}
              </strong>
            </div>

            {/* DELIVERY */}

            <div>
              <span>
                Delivery
              </span>

              <strong>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${formatPrice(
                      deliveryCharge
                    )}`}
              </strong>
            </div>

            {/* GRAND TOTAL */}

            <div className="total-row">

              <span>
                Grand Total
              </span>

              <strong>
                ₹
                {formatPrice(
                  total
                )}
              </strong>

            </div>

          </div>

        </div>

        {/* =========================
            BUTTONS
        ========================= */}

        <div className="bill-actions">

          <button
            className="print-btn"
            onClick={() =>
              window.print()
            }
          >
            🖨️ Print Bill
          </button>

          <button
            className="shop-btn"
            onClick={() =>
              navigate("/products")
            }
          >
            🛍️ Continue Shopping
          </button>

        </div>

      </div>

    </section>
  );
}

export default Bill;