import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === "admin123") {
      localStorage.setItem("admin", "true");
      navigate("/admin");
    } else {
      alert("Wrong Password");
    }
  };

  return (
    <div className="login-page">
      <h1>Admin Login</h1>

      <form
        onSubmit={handleLogin}
        className="login-form"
      >
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;