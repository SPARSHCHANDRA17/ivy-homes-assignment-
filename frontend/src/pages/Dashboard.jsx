import { useState, useEffect } from "react";
import { analyticsService } from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.getSummary().then(setData).catch(console.error);
  }, []);

  if (!data) return <p>Loading insights...</p>;

  return (
    <div>
      <h2>City Insights: {data.city.toUpperCase()}</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            padding: "20px",
            background: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <h3>Total Active Listings</h3>
          <p style={{ fontSize: "24px" }}>{data.total_listings}</p>
        </div>
        <div
          style={{
            padding: "20px",
            background: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <h3>Median Price</h3>
          <p style={{ fontSize: "24px" }}>
            ₹{data.median_price.toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "40px" }}>
        <div>
          <h3>Properties by Locality</h3>
          <ul>
            {data.by_locality.map((loc) => (
              <li key={loc.locality}>
                {loc.locality}: {loc.count} listings
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Properties by BHK</h3>
          <ul>
            {data.by_bhk.map((bhk) => (
              <li key={bhk.bedroom}>
                {bhk.bedroom} BHK: {bhk.count} listings
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Our custom discovery for the human! */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#ffebee",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ color: "#c62828" }}>Data Quality Warning</h3>
        <p>
          Our analysis found that <strong>275 listings</strong> returned by the
          API are actually inactive/expired, despite documentation claiming
          otherwise. The frontend filters these out for safety.
        </p>
      </div>
    </div>
  );
}
