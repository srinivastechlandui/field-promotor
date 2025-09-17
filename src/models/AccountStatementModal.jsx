
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import ConfirmModal from "./ConfirmModal";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../utils/Urls";


export default function AccountStatementModal({ onClose }) {
  const [showMain, setShowMain] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emptyLines = 6;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${BASE_URL}/users/`);
        // Only users with transaction_id === null
        const filtered = (res.data?.users || []).filter(
          u => u.transaction_id === null
        );
        setUsers(filtered);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users by search (employer_name)
  const filteredUsers = users.filter(u =>
    (
      (u.employer_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.user_id || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.onboarding_fee || "").toLowerCase().includes(search.toLowerCase())
    )
  );
  const handleCloseAll = () => {
    setShowMain(false);
    setShowConfirm(false);
    onClose?.();
  };

  return (
    <>
      {showMain && (
        <div className="fixed top-0 left-0 w-80 h-full flex items-start z-50 ">
          <div
            className="rounded-lg shadow-lg flex flex-col p-4 relative animate-[slideInLeft_0.4s_ease-out_forwards]"
            style={{
              width: "300px",
              height: "500px",
              background: "linear-gradient(to bottom right, #ffffff, #e9d5ff)",
              border: "2px solid #7a5af5",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-lg font-bold"
                style={{
                  color: "red",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                }}
              >
                {selectedUser ? `Payment Due` : `Payment Dues`}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded bg-red-600"
              >
                <IoClose className="text-white text-2xl" />
              </button>
            </div>

            {/* Search Bar */}
            {!selectedUser && (
              <div className="mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search User_id, employer name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                />
                <div className="mt-2 max-h-[70] overflow-y-auto">
                  {loading && <div className="text-gray-500 text-sm">Loading...</div>}
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {!loading && !error && filteredUsers.length === 0 && (
                    <div className="text-gray-500 text-sm">No users found.</div>
                  )}
                  {!loading && !error && filteredUsers.map(user => (
                    <div
                      key={user.user_id}
                      className="cursor-pointer px-2 py-1 hover:bg-purple-100 rounded text-black border-b border-gray-400"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="font-semibold">{user.user_id}</div>
                      <div className="text-xs">{user.employer_name}</div>
                      <div className="text-xs text-purple-700">Onboarding Fee: ₹{user.onboarding_fee}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Due Details for Selected User */}
            {selectedUser && (
              <>
                <div className="text-center mb-6 text-gray-700 font-mono">
                  <span className="text-gray-600">######## </span>
                  <span className="text-red-600 font-bold">[₹{selectedUser.onboarding_fee}]</span>
                  <span className="text-gray-600"> ########</span>
                </div>
                <div className="text-center text-xs text-gray-700 mb-2">
                  User ID: <span className="font-semibold">{selectedUser.user_id}</span>
                </div>
                <div className="text-center text-xs text-gray-700 mb-2">
                  Employer Name: <span className="font-semibold">{selectedUser.employer_name}</span>
                </div>
                {/* Horizontal lines */}
                <div className="flex flex-col gap-2 overflow-y-auto mb-4 flex-grow">
                  {Array.from({ length: emptyLines }).map((_, index) => (
                    <div
                      key={index}
                      className="border-b-4 border-black pb-1 text-sm text-black my-4"
                    >
                    </div>
                  ))}
                </div>
                {/* Send Button */}
                <div onClick={() => setShowConfirm(true)}
                  className="bottom-[70px] left-1/2 -translate-x-1/2 absolute">
                  <button className="flex items-center gap-2 text-white font-bold py-1 px-4 rounded-full"
                    style={{
                      background: "linear-gradient(to right, #5b0e2d, #a83279)",
                      border: "2px solid gold",
                      boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                    }}>
                    SEND
                    <FaPaperPlane className="w-4 h-4" />
                  </button>
                </div>
                {/* Back to search */}
                <div className="absolute top-4 right-16">
                  <button
                    className="text-xs text-purple-700 underline"
                    onClick={() => setSelectedUser(null)}
                  >
                    Back to search
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {showConfirm && (
        <ConfirmModal
          onYes={handleCloseAll}
          onNo={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
