import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const existingUser = localStorage.getItem("birdsCareUser");

    if (existingUser) {
      const user = JSON.parse(existingUser);

      if (user.email.toLowerCase() === email.trim().toLowerCase()) {
        alert("This email is already registered. Please login.");
        navigate("/login");
        return;
      }
    }

    const userData = {
      name: name.trim(),
      email: email.trim(),
      password: password,
    };

    localStorage.setItem("birdsCareUser", JSON.stringify(userData));

    localStorage.removeItem("birdsCareLoggedIn");

    alert("Registration successful! You can now login.");

    navigate("/login");
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
            Create your account
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#123b35",
              fontWeight: "700",
            }}
          >
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Register
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
            Already have an account?
          </p>

          <Link
            to="/login"
            style={{
              color: "#0f766e",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Login Here
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

export default Register;