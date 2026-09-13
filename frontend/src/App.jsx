import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./api";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Saved from "./pages/Saved";
import Rentals from "./pages/Rentals";
import Projects from "./pages/Projects";
import Navigation from "./components/Navigation";

function PrivateRoute({ children }) {
  const user = authService.getUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navigation />
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/listings"
          element={
            <PrivateRoute>
              <Listings />
            </PrivateRoute>
          }
        />
        <Route
          path="/listings/:id"
          element={
            <PrivateRoute>
              <ListingDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/rentals"
          element={
            <PrivateRoute>
              <Rentals />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <PrivateRoute>
              <Saved />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
