import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";
import BASE_URL from "../utils/Urls";

export default function NotificationPopup({ onClose }) {
  const [showMain, setShowMain] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState(""); // ✅ search bar state
  const emptyLines = 6;

  // ✅ Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/users/`);
        if (data?.users) setUsers(data.users);
      } catch (err) {
        console.error("❌ Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showMain]);

  // ✅ Toggle select individual user
  const handleUserSelect = (user_id) => {
    setSelectedUsers((prev) =>
      prev.includes(user_id)
        ? prev.filter((id) => id !== user_id)
        : [...prev, user_id]
    );
  };

  // ✅ Select/unselect all users (filtered list only)
  const handleCheckAll = () => {
    const filteredIds = filteredUsers.map((u) => u.user_id);
    const allSelected = filteredIds.every((id) => selectedUsers.includes(id));

    setSelectedUsers(
      allSelected
        ? selectedUsers.filter((id) => !filteredIds.includes(id)) // unselect only filtered
        : [...new Set([...selectedUsers, ...filteredIds])] // select all filtered
    );
  };

  // ✅ Derived filtered users
  const filteredUsers = users.filter((user) => {
  const name = user?.employer_name ?? ""; // fallback empty string
  const id = String(user?.user_id ?? "");
  return (
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    id.includes(searchTerm)
  );
  });

  

  // ✅ Send notification API
  const handleSendNotification = async () => {
    if (!message.trim()) {
      alert("⚠️ Please enter a notification message");
      return;
    }

    const payload = {
      message,
      ...(selectedUsers.length > 0 && { user_ids: selectedUsers }),
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
        setShowConfirm(true);
      }
    } catch (error) {
      console.error("❌ Failed to send notification", error);
      alert("❌ Failed to send notification");
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
        <div className="fixed top-0 left-0 h-full flex items-start z-50">
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
              <button
                onClick={handleCloseAll}
                className="p-1 rounded bg-red-600"
              >
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

            {/* ✅ Search bar */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2 p-2 rounded border border-gray-400 w-full"
              placeholder="🔍 Search users by ID or name..."
            />

            {/* User List */}
            <div className="overflow-y-auto max-h-40 border rounded p-2 bg-white">
              <label className="block font-bold mb-2">Send To:</label>

              {loading ? (
                <p className="text-sm text-purple-600 font-semibold">
                  ⏳ Loading users...
                </p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-600">No matching users</p>
              ) : (
                <>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-purple-700">
                    <input
                      type="checkbox"
                      checked={
                        filteredUsers.length > 0 &&
                        filteredUsers.every((u) =>
                          selectedUsers.includes(u.user_id)
                        )
                      }
                      onChange={handleCheckAll}
                    />
                    <span>Check All (Filtered)</span>
                  </label>

                  {filteredUsers.map((user) => (
                    <label
                      key={user.user_id}
                      className="flex items-center gap-2 mb-1 ml-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.user_id)}
                        onChange={() => handleUserSelect(user.user_id)}
                      />
                      <span>{`User #${user.user_id} - ${user.employer_name}`}</span>
                    </label>
                  ))}
                </>
              )}
            </div>

            {/* Empty lines */}
            {Array.from({ length: emptyLines }).map((_, idx) => (
              <div key={idx} className="border-b-4 border-white my-1"></div>
            ))}

            {/* Send button */}
            <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2">
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
                {loading ? "Loading..." : "SEND"}
                {!loading && <FaPaperPlane className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal onYes={handleCloseAll} onNo={() => setShowConfirm(false)} />
      )}
    </>
  );
}
