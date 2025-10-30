import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaPaperPlane, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";
import UserSelectModal from "./UserSelectModal";
import BASE_URL from "../utils/Urls";

export default function NotificationPopup({ onClose }) {
  const [showMain, setShowMain] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const emptyLines = 4;

  // 📦 Open user select modal
  const handleOpenUserSelect = () => {
    setShowUserSelectModal(true);
  };

  // ✅ Receive selected users
  const handleUserSelection = (users) => {
    setSelectedUsers(users);
    setShowUserSelectModal(false);
  };

  // ⚠️ Step 1: open confirm modal first, don't call API yet
  const handleSendNotification = () => {
    if (!message.trim()) {
      alert("⚠️ Please enter a notification message");
      return;
    }
    if (selectedUsers.length === 0) {
      alert("⚠️ Please select at least one user to send the notification messages.");
      return;
    }
    setShowConfirm(true); // open confirm modal only
  };

  // 🚀 Step 2: this runs only if user clicks “YES”
  const handleConfirmYes = async () => {
    setLoading(true);
    const payload = {
      message,
      user_ids: selectedUsers,
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/notifications/`, payload);

      if (data?.notification) {
        alert(
          `✅ Sent notification to ${
            selectedUsers.length > 0 ? "specific users" : "all users"
          }`
        );
        setMessage("");
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("❌ Failed to send notification", error);
      alert("❌ Failed to send notification");
    } finally {
      setLoading(false);
      handleCloseAll();
    }
  };

  const handleCloseAll = () => {
    setShowMain(false);
    setShowConfirm(false);
    onClose?.();
  };

  return (
    <>
      {showMain && (
        <div className="fixed top-0 left-0 h-full flex items-start w-full bg-black bg-opacity-40 z-50">
          <div
            className="rounded-lg shadow-lg flex flex-col p-4 relative animate-[slideInLeft_0.4s_ease-out_forwards]"
            style={{
              width: 380,
              height: 560,
              background: "linear-gradient(to bottom, #f6d0e0, #d2aef0)",
              border: "2px solid #7a5af5",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white drop-shadow">
                Notification
              </h2>
              <button onClick={handleCloseAll} className="p-1 rounded bg-red-600">
                <IoClose className="text-white text-2xl" />
              </button>
            </div>

            {/* Notification Input */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow mb-4 p-2 rounded border border-gray-400 resize-none"
              placeholder="Type your notification message here..."
            />

            {/* Empty lines (for visual spacing) */}
            {Array.from({ length: emptyLines }).map((_, idx) => (
              <div key={idx} className="absolute border-b-4 border-white my-2"></div>
            ))}

            <div className="flex justify-between items-center mb-4">
              {/* Select Users Button */}
              <button
                onClick={handleOpenUserSelect}
                className="flex items-center gap-2 text-white font-bold py-2 px-4 rounded-full"
                style={{
                  background: "linear-gradient(to right, #5b0e2d, #a83279)",
                  border: "2px solid gold",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                <FaUserPlus /> Select Users ({selectedUsers.length})
              </button>

              {/* Send Button */}
              <button
                onClick={handleSendNotification}
                disabled={loading}
                className="flex items-center gap-2 text-white font-bold py-1 px-4 rounded-full disabled:opacity-50"
                style={{
                  background: "linear-gradient(to right, #5b0e2d, #a83279)",
                  border: "2px solid gold",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                {loading ? "Sending..." : "SEND"}
                {!loading && <FaPaperPlane className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserSelectModal && (
        <UserSelectModal
          onClose={() => setShowUserSelectModal(false)}
          onSubmit={handleUserSelection}
        />
      )}

      {/* ✅ Only sends when YES is clicked */}
      {showConfirm && (
        <ConfirmModal
          onYes={handleConfirmYes}
          onNo={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
