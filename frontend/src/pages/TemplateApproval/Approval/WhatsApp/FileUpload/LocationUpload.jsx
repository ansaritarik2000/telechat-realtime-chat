import React, { useState } from "react";

const LocationUpload = () => {
  const [location, setLocation] = useState("");

  const handleLocationChange = (e) => setLocation(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location) {
      console.log("Location submitted:", location);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={handleLocationChange}
        className="border border-gray-300 p-2 rounded"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default LocationUpload;
