import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("birdsCareUser"));

    if (!savedUser) {
      alert("No account found. Please register first.");
      navigate("/register");
      return;
    }

    if (
      email.trim().toLowerCase() !== savedUser.email.toLowerCase() ||
      password !== savedUser.password
    ) {
      alert("Invalid email or password.");
      return;
    }

    localStorage.setItem("birdsCareLoggedIn", "true");

    alert("Login successful!");

    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7faf8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#ffffff",
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.10)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "10px",
            }}
          >
            🦜
          </div>

          <h1
            style={{
              margin: "0 0 8px",
              color: "#123b35",
              fontSize: "30px",
            }}
          >
            Birds Care
          </h1>

          <p
            style={{
              margin: 0,
              color: "#777",
              fontSize: "15px",
            }}
          >
            Login to your account
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#123b35",
              fontWeight: "700",
            }}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              marginBottom: "18px",
              border: "1px solid #ccd9d5",
              borderRadius: "9px",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#123b35",
              fontWeight: "700",
            }}
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              marginBottom: "22px",
              border: "1px solid #ccd9d5",
              borderRadius: "9px",
              fontSize: "15px",
              outline: "none",
            }}
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
            }}
          >
            Login
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #e5ebe8",
          }}
        >
          <p
            style={{
              margin: "0 0 10px",
              color: "#777",
              fontSize: "14px",
            }}
          >
            Don't have an account?
          </p>

          <Link
            to="/register"
            style={{
              display: "inline-block",
              color: "#0f766e",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Create New Account
          </Link>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#0f766e",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;