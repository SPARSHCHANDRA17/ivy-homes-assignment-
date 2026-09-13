import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { propertyService } from "../api";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    propertyService.getListingDetails(id).then(setListing).catch(console.error);
  }, [id]);

  if (!listing) return <p>Loading details...</p>;

  return (
    <div>
      <h2>
        {listing.apartment_name || "Property"} - {listing.locality}
      </h2>
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>
        ₹{listing.price.toLocaleString()}
      </p>
      <p>{listing.description}</p>
      <ul>
        <li>
          <strong>Bedrooms:</strong> {listing.bedroom}
        </li>
        <li>
          <strong>Bathrooms:</strong> {listing.bathroom}
        </li>
        <li>
          <strong>Carpet Area:</strong> {listing.carpet_area} sqft
        </li>
        <li>
          <strong>Posted By:</strong> {listing.posted_by_name} (
          {listing.posted_by_contact})
        </li>
      </ul>
    </div>
  );
}
