import { useState, useEffect } from "react";
import { propertyService } from "../api";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    propertyService
      .getProjects(0, 50)
      .then((data) => setProjects(data.results || []));
  }, []);

  return (
    <div>
      <h2>New Projects</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {projects.map((p) => (
          <div
            key={p.project_id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>
              {p.apartment_name} by {p.developer_name}
            </h3>
            <p>
              <strong>Price Range:</strong> ₹{p.price_min_inr?.toLocaleString()}{" "}
              - ₹{p.price_max_inr?.toLocaleString()}
            </p>
            <p>
              <strong>Area:</strong> {p.min_area_sqft} - {p.max_area_sqft} sqft
            </p>
            <p>
              <strong>Status:</strong> {p.project_status}
            </p>
            <p>
              <strong>Total Units:</strong> {p.total_units}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
