import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/Urls";
export default function TermsAndConditions() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/terms`);
        setTerms(res.data.result); // result = array of T&C from backend
      } catch (err) {
        setError(err.response?.data?.message || "❌ Failed to load privacy policy");
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading privacy policy...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Privacy Policy
      </h1>
      {terms.map((term) => (
        <div
          key={term.id}
          className="bg-white border rounded-lg shadow-md p-4 mb-4"
        >
          <p className="text-gray-700 whitespace-pre-line">{term.content}</p>
          <p className="text-xs text-gray-400 mt-2">
            Last updated: {new Date(term.updated_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
