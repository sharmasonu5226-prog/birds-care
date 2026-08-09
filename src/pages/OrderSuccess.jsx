import { Link } from "react-router-dom";

function OrderSuccess() {
  const orderId = Math.floor(Math.random() * 1000000);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "80px auto",
        background: "#fff",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 5px 20px rgba(0,0,0,.1)",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#2e7d32" }}>
        🎉 Order Placed Successfully!
      </h1>

      <h2 style={{ marginTop: "20px" }}>
        Thank You for Shopping
      </h2>

      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        Your Order ID
      </p>

      <h1 style={{ color: "#ff9800" }}>
        #{orderId}
      </h1>

      <p style={{ marginTop: "20px" }}>
        Our team will contact you soon.
      </p>

      <Link to="/">
        <button
          style={{
            marginTop: "30px",
            padding: "15px 35px",
            background: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}

export default OrderSuccess;