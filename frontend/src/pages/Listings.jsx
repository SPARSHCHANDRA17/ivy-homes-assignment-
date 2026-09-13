import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { propertyService, favoritesService } from "../api";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const [filters, setFilters] = useState({
    locality: "",
    bhk: "",
    min_price: "",
    max_price: "",
    furnishing: "",
  });

  const fetchListings = async (currentOffset) => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );

      const data = await propertyService.getListings(
        currentOffset,
        LIMIT,
        activeFilters,
      );

      let results = data.results || [];

      if (activeFilters.locality) {
        results = results.filter(
          (l) =>
            l.locality.toLowerCase() === activeFilters.locality.toLowerCase(),
        );
      }
      if (activeFilters.bhk) {
        results = results.filter(
          (l) => l.bedroom === parseInt(activeFilters.bhk),
        );
      }
      if (activeFilters.min_price) {
        results = results.filter(
          (l) => l.price >= parseInt(activeFilters.min_price),
        );
      }
      if (activeFilters.max_price) {
        results = results.filter(
          (l) => l.price <= parseInt(activeFilters.max_price),
        );
      }
      if (activeFilters.furnishing) {
        results = results.filter(
          (l) =>
            l.furnishing.toLowerCase() ===
            activeFilters.furnishing.toLowerCase(),
        );
      }

      setListings(results);
      setHasMore(data.has_more);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(offset);
  }, [offset]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setOffset(0);
    fetchListings(0);
  };

  const handleSave = async (id) => {
    setSavingId(id);
    try {
      await favoritesService.addFavorite(id);
      alert("Saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save.");
    } finally {
      setSavingId(null);
    }
  };
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2>Browse Listings</h2>

      <form
        onSubmit={applyFilters}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          name="locality"
          placeholder="Locality"
          value={filters.locality}
          onChange={handleFilterChange}
        />
        <input
          name="bhk"
          type="number"
          placeholder="Bedrooms"
          value={filters.bhk}
          onChange={handleFilterChange}
        />
        <input
          name="min_price"
          type="number"
          placeholder="Min Price"
          value={filters.min_price}
          onChange={handleFilterChange}
        />
        <input
          name="max_price"
          type="number"
          placeholder="Max Price"
          value={filters.max_price}
          onChange={handleFilterChange}
        />
        <select
          name="furnishing"
          value={filters.furnishing}
          onChange={handleFilterChange}
        >
          <option value="">Any Furnishing</option>
          <option value="unfurnished">Unfurnished</option>
          <option value="semi-furnished">Semi-furnished</option>
          <option value="fully-furnished">Fully-furnished</option>
        </select>
        <button type="submit">Apply Filters</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {listings.map((listing) => (
            <div
              key={listing.listing_id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>
                {listing.bedroom} BHK in {listing.locality}
              </h3>
              <p>
                <strong>Price:</strong> ₹{listing.price.toLocaleString()}
              </p>
              <p>
                <strong>Area:</strong> {listing.carpet_area} sqft
              </p>
              <p>
                <strong>Furnishing:</strong> {listing.furnishing}
              </p>
              <p>
                <strong>By:</strong> {listing.posted_by_name} (
                {listing.posted_by})
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <Link
                  to={`/listings/${listing.listing_id}`}
                  style={{
                    padding: "6px 12px",
                    background: "#2563eb",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                  }}
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleSave(listing.listing_id)}
                  disabled={savingId === listing.listing_id}
                  style={{
                    padding: "6px 12px",
                    cursor: "pointer",
                    background:
                      savingId === listing.listing_id ? "#4b5563" : "#374151",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  {savingId === listing.listing_id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          disabled={offset === 0}
          onClick={() => setOffset(offset - LIMIT)}
        >
          Previous
        </button>
        <button disabled={!hasMore} onClick={() => setOffset(offset + LIMIT)}>
          Next
        </button>
      </div>
    </div>
  );
}
