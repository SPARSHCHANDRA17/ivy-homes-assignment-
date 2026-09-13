import { useState, useEffect } from "react";
import { favoritesService } from "../api";
import { Link } from "react-router-dom";

export default function Saved() {
  const [saved, setSaved] = useState([]);

  const fetchSaved = () => {
    favoritesService
      .getFavorites()
      .then((data) => setSaved(data.results || []));
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (id) => {
    await favoritesService.removeFavorite(id);
    fetchSaved(); // refresh list
  };

  return (
    <div>
      <h2>Saved Listings</h2>
      {saved.length === 0 ? <p>No saved listings yet.</p> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {saved.map((item) => (
          <div
            key={item.listing_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <span>
              {item.bedroom} BHK in {item.locality} - ₹
              {item.price.toLocaleString()}
            </span>
            <div>
              <Link
                to={`/listings/${item.listing_id}`}
                style={{ marginRight: "10px" }}
              >
                View
              </Link>
              <button onClick={() => handleRemove(item.listing_id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
