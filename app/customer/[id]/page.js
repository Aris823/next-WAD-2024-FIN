"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CustomerDetail() {
  const [customer, setCustomer] = useState(null); // Customer state
  const [loading, setLoading] = useState(true); // Loading state
  const API_BASE = process.env.NEXT_PUBLIC_API_URL; // Your API base URL

  const params = useParams(); // Get dynamic route parameters
  const id = params.id; // Extract `id` from params

  // Fetch customer details by ID
  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  async function fetchCustomer() {
    try {
      const response = await fetch(`${API_BASE}/customer/${id}`);
      const customerData = await response.json();
      setCustomer(customerData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div>
      <main className="p-8 bg-gray-100 min-h-screen pt-20">
        <div className="bg-white shadow p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-blue-800">{customer.name}</h1>
          <p className="mt-2 text-lg">Member Number: {customer.memberNumber}</p>
          <p className="mt-2 text-gray-600">
            Date of Birth: {new Date(customer.dateOfBirth).toLocaleDateString()} {/* Format date here */}
          </p>
          <p className="mt-4 text-sm">Interests: {customer.interests}</p>
        </div>
      </main>
    </div>
  );

}
