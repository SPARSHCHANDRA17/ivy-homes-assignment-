import { useState, useEffect } from "react";
import { propertyService } from "../api";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    propertyService
      .getRentals(0, 50)
      .then((data) => setRentals(data.results || []));
  }, []);

  return (
    <div>
      <h2>Rentals</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {rentals.map((r) => (
          <div
            key={r.listing_id}
            style={{ border: "1px solid #ccc", padding: "15px" }}
          >
            <h3>{r.title}</h3>
            <p>
              <strong>Rent:</strong> ₹{r.price}/month
            </p>
            <p>
              <strong>Deposit:</strong> ₹{r.deposit}
            </p>
            <p>
              <strong>Locality:</strong> {r.locality}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
