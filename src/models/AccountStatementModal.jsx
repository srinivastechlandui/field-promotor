import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import ConfirmModal from "./ConfirmModal";
import { FaPaperPlane, FaUserAlt } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../utils/Urls";
import UserSelectModal from "./UserSelectModal";

export default function AccountStatementModal({ onClose }) {
  const [showMain, setShowMain] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user object
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/users/`);
        setUsers(data?.users || []);
      } catch (error) {
        console.error("❌ Failed to fetch users", error);
        alert("❌ Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCloseAll = () => {
    setShowMain(false);
    setShowConfirm(false);
    onClose?.();
  };

  // Step 1: Handle user selection from the list
  const handleUserClick = (user) => {
    setSelectedUser(user);
    // You can set a default message here if you like
    setMessage(`Hello ${user.employer_name}, your onboarding fee of Rs. ${user.onboarding_fee} is due.`);
  };

  // Step 2: Go to the UserSelectModal after the message is ready
  const handleSendClick = () => {
    if (!message.trim()) {
      alert("⚠️ Please enter a message before sending");
      return;
    }
    setShowUserSelectModal(true);
  };

  // Step 3: After selecting recipients, actually send the notification
  const handleUserSelectSubmit = async (users) => {
    setShowUserSelectModal(false);
    
    // Use the selected user's onboarding fee
    const amount = selectedUser.onboarding_fee;
    const finalMessage = message.replace(/{{amount}}/g, amount);

    const payload = {
      message: finalMessage,
      // You can send to all selected users from the modal
      user_ids: users,
    };

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/notifications/`, payload);
      alert(`✅ Sent notification to ${users.length} user(s).`);
      setMessage("");
      setSelectedUser(null);
      setShowConfirm(true);
    } catch (error) {
      console.error("❌ Failed to send notification", error);
      alert("❌ Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showMain && (
        <div className="fixed top-0 left-0 w-80 h-full flex items-start z-50">
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
                Payment Due
              </h2>
              <button onClick={onClose} className="p-1 rounded bg-red-600">
                <IoClose className="text-white text-2xl" />
              </button>
            </div>

            {/* Conditional Rendering based on selectedUser */}
            {!selectedUser ? (
              // Initial view: User list
              <div className="flex-grow overflow-y-auto">
                <h3 className="text-md font-semibold mb-2 text-gray-800">
                  Select a User
                </h3>
                {loading ? (
                  <p className="text-center text-gray-500">Loading users...</p>
                ) : (
                  <ul className="space-y-2">
                    {users.map((user) => (
                      <li
                        key={user.user_id}
                        onClick={() => handleUserClick(user)}
                        className="p-3 border rounded-lg bg-white shadow-sm hover:bg-gray-100 cursor-pointer transition flex items-center gap-3"
                      >
                        <FaUserAlt className="text-purple-500" />
                        <div>
                          <p className="font-semibold text-gray-700">
                            {user.employer_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: {user.user_id}
                          </p>
                          <p className="text-sm font-bold text-red-500">
                            Rs. {user.onboarding_fee}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              // Second view: Payment details and message input
              <>
                <div className="text-center mb-6 text-gray-700 font-mono">
                  <span className="text-gray-600">Payment for </span>
                  <span className="text-red-600 font-bold">
                    {selectedUser.employer_name}
                  </span>
                  <span className="text-gray-600"> is due.</span>
                  <br />
                  <span className="text-red-600 font-bold">
                    [₹{selectedUser.onboarding_fee}]
                  </span>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message..."
                  className="w-full p-2 border rounded text-sm mb-3 min-h-[315px]"
                />

                <div
                  onClick={handleSendClick}
                  className="bottom-[20px] left-3/4 -translate-x-1/2 absolute"
                >
                  <button
                    className="flex items-center gap-2 text-white font-bold py-1 px-4 rounded-full"
                    style={{
                      background:
                        "linear-gradient(to right, #5b0e2d, #a83279)",
                      border: "2px solid gold",
                      boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "SEND"}
                    <FaPaperPlane className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showUserSelectModal && (
        <UserSelectModal
          onClose={() => setShowUserSelectModal(false)}
          onSubmit={handleUserSelectSubmit}
        />
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