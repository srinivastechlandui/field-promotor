import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import ConfirmModal from "./ConfirmModal";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../utils/Urls";
import UserSelectModal from "./UserSelectModal";

export default function PaidEarnings({ onClose, selectedUser }) {
  const [showMain, setShowMain] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const AMOUNT = 500; // const value

  const handleCloseAll = () => {
    setShowMain(false);
    setShowConfirm(false);
    setShowUserSelect(false);
    onClose?.();
  };

  // Step 1: open UserSelectModal
  const handleSendClick = () => {
    if (!message.trim()) {
      alert("⚠️ Please enter a message before sending");
      return;
    }
    setShowUserSelect(true);
  };

  // Step 2: after selecting recipients, send notification
  const handleUserSelectSubmit = async (recipients) => {
    setSelectedRecipients(recipients);
    setShowUserSelect(false);

    const finalMessage = message.replace(/500/g, AMOUNT);

    const payload = {
      message: finalMessage,
      ...(recipients.length > 0 && { user_ids: recipients.map((u) => u.user_id) }),
    };

    try {
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}/notifications/`, payload);

      if (data?.notification) {
        alert(
          `✅ Sent notification to ${
            recipients.length > 0 ? "specific users" : "all users"
          }`
        );
        setMessage("");
        setSelectedRecipients([]);
        setShowConfirm(true);
      }
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
                  color: "green",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                }}
              >
                Paid Earnings
              </h2>
              <button onClick={onClose} className="p-1 rounded bg-red-600">
                <IoClose className="text-white text-2xl" />
              </button>
            </div>

            {/* Paid Earnings Details */}
            <div className="text-center mb-6 text-gray-700 font-mono">
              <span className="text-gray-600">######## </span>
              <span className="text-green-600 font-bold">
                [₹{selectedUser?.onboarding_fee || AMOUNT}]
              </span>
              <span className="text-gray-600"> ########</span>
            </div>
           

            {/* Message Input */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message... (use 500, it will be replaced with const value)"
              className="w-full p-2 border rounded text-sm mb-3 min-h-[315px]"
            />

            {/* Send Button */}
            <div
              onClick={handleSendClick}
              className="bottom-[20px] left-3/4 -translate-x-1/2 absolute"
            >
              <button
                className="flex items-center gap-2 text-white font-bold py-1 px-4 rounded-full"
                style={{
                  background: "linear-gradient(to right, #5b0e2d, #a83279)",
                  border: "2px solid gold",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}
                disabled={loading}
              >
                {loading ? "Sending..." : "SEND"}
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UserSelectModal */}
      {showUserSelect && (
        <UserSelectModal
          onClose={() => setShowUserSelect(false)}
          onSubmit={handleUserSelectSubmit}
        />
      )}

      {/* ConfirmModal */}
      {showConfirm && (
        <ConfirmModal onYes={handleCloseAll} onNo={() => setShowConfirm(false)} />
      )}
    </>
  );
}
