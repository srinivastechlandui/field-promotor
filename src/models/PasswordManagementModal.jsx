import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaSave, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import BASE_URL from "../utils/Urls";

export default function PasswordManagementModal({ onClose }) {

  const [lock, setLock] = useState(null);
  const [primaryPassword, setPrimaryPassword] = useState("");
  const [secondaryPassword, setSecondaryPassword] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [showPrimary, setShowPrimary] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch lock data
  useEffect(() => {
    const fetchLock = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/locks/`);
        setLock(res.data.lock);
      } catch (err) {
        console.error("❌ Failed to fetch lock info", err);
      }
    };
    fetchLock();
  }, []);

  // ✅ Save one field at a time
  const handleSaveField = async (field) => {
    if (!lock) return;
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/locks/update`, {
        id: lock.id, // ✅ include ID
        primary_password: field === "primary" ? primaryPassword : undefined,
        secondary_password: field === "secondary" ? secondaryPassword : undefined,
      });
      alert("✅ Password updated successfully");
      setEditingField(null);
      setPrimaryPassword("");
      setSecondaryPassword("");
    } catch (err) {
      console.error("❌ Failed to update password", err);
      alert("❌ Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[450px] rounded-lg shadow-lg p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          🔐 Password Management
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Updating...</p>
        ) : (
          <>
            {/* Primary Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Primary Password
              </label>
              {editingField === "primary" ? (
                <div className="flex items-center gap-2">
                  <input
                    type={showPrimary ? "text" : "password"}
                    value={primaryPassword}
                    onChange={(e) => setPrimaryPassword(e.target.value)}
                    placeholder="Enter new primary password"
                    className="border border-gray-300 rounded p-2 flex-1 focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={() => setShowPrimary(!showPrimary)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {showPrimary ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => handleSaveField("primary")}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaSave />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                  <span className="font-semibold text-blue-600">●●●●●●●●</span>
                  <FaEdit
                    className="text-indigo-600 cursor-pointer hover:scale-110"
                    onClick={() => setEditingField("primary")}
                  />
                </div>
              )}
            </div>

            {/* Secondary Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Secondary Password
              </label>
              {editingField === "secondary" ? (
                <div className="flex items-center gap-2">
                  <input
                    type={showSecondary ? "text" : "password"}
                    value={secondaryPassword}
                    onChange={(e) => setSecondaryPassword(e.target.value)}
                    placeholder="Enter new secondary password"
                    className="border border-gray-300 rounded p-2 flex-1 focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={() => setShowSecondary(!showSecondary)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {showSecondary ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => handleSaveField("secondary")}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaSave />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                  <span className="font-semibold text-blue-600">●●●●●●●●</span>
                  <FaEdit
                    className="text-indigo-600 cursor-pointer hover:scale-110"
                    onClick={() => setEditingField("secondary")}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
