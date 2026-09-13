import { Link, useNavigate } from "react-router-dom";
import { authService } from "../api";

function Navigation() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#333",
        color: "white",
        padding: "1rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <strong style={{ marginRight: "auto" }}>Ivy Homes</strong>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Insights
      </Link>
      <Link to="/listings" style={{ color: "white", textDecoration: "none" }}>
        Listings
      </Link>
      <Link to="/rentals" style={{ color: "white", textDecoration: "none" }}>
        Rentals
      </Link>
      <Link to="/projects" style={{ color: "white", textDecoration: "none" }}>
        Projects
      </Link>
      <Link to="/saved" style={{ color: "white", textDecoration: "none" }}>
        Saved
      </Link>

      <span style={{ marginLeft: "auto", fontSize: "0.9rem" }}>
        {user?.email}
      </span>
      <button
        onClick={handleLogout}
        style={{ padding: "4px 8px", cursor: "pointer" }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navigation;
