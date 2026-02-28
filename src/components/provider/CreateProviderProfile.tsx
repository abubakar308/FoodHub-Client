"use client";

import { createProvider, getProfile } from "@/services/provider";
import React, { useEffect, useState } from "react";

const CreateProviderProfile = () => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    address: "",
   phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [provider, setProvider] = useState(null);


useEffect(() => {
  const loadProvider = async () => {
    const data = await getProfile();
    setProvider(data);
  };

  loadProvider();
}, []);

  console.log(provider);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setSuccessMsg("");
  setErrorMsg("");

  const result = await createProvider(formData);

  if (result) {
    setSuccessMsg("Profile created successfully!");
  } else {
    setErrorMsg("Failed to create profile");
  }

  setLoading(false);
};

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md relative">
      <h1 className="text-2xl font-bold mb-4">Create Provider Profile</h1>

      {/* Toast Messages */}
      {successMsg && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md animate-slide-in">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-md animate-slide-in">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Restaurant Name */}
        <div>
          <label className="block font-medium mb-1">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter restaurant name"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter address"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <textarea
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter description"
            required
          />
        </div>


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateProviderProfile;