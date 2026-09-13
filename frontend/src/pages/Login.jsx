import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api";

function Login() {
  const [email, setEmail] = useState("demo1@ivy.homes");
  const [password, setPassword] = useState("58b2525506");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed. Please check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Sign in to Ivy Homes</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
