import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaTimes, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../utils/Urls";

const RaiseTickets = ({ user_id, onClose }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("open");

  // 👉 Fetch tickets
  useEffect(() => {
    if (user_id) fetchTickets();
  }, [user_id]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tickets/${user_id}`);
      setTickets(res.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("❌ Failed to fetch tickets:", error);
      setLoading(false);
    }
  };

  // 👉 Fetch messages for a selected ticket
  const fetchMessages = async (ticket) => {
    try {
      setSelectedTicket(ticket);
      setStatus(ticket.status);

      const res = await axios.get(
        `${BASE_URL}/tickets/messages/${ticket.id}`
      );
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
    }
  };

  // 👉 Send new message
  const handleSend = async () => {
    if (!message.trim() || !selectedTicket) return;

    try {
      await axios.post(`${BASE_URL}/tickets/messages`, {
        ticket_id: selectedTicket.id,
        id: 0, // admin id if tracked
        receiver_by: 2, // 2 = admin
        message,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "admin",
          message,
          created_at: new Date().toISOString(),
        },
      ]);
      setMessage("");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  // 👉 Update status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await axios.put(`${BASE_URL}/tickets/status/${user_id}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("❌ Failed to update status:", error);
    }
  };

  return (
    <div className="bg-gray-800 fixed top-0 left-0 font-sans z-50 h-[600px] w-[400px] overflow-hidden">
      <div className="bg-white w-full h-full rounded-xl shadow-lg relative flex flex-col">
        {/* ✅ If no ticket selected → show LIST */}
        {!selectedTicket ? (
          <>
            <div className="flex justify-between items-center px-4 py-2 bg-gray-200">
              <h2 className="font-bold text-gray-800">Tickets</h2>
              <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                <FaTimes />
              </button>
            </div>

            {loading ? (
              <p className="text-center text-gray-500 p-4">Loading...</p>
            ) : tickets.length > 0 ? (
              <div className="overflow-y-auto">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => fetchMessages(ticket)}
                    className="px-4 py-3 cursor-pointer border-b hover:bg-gray-100"
                  >
                    <p className="font-semibold">Ticket #{ticket.id}</p>
                    <p className="text-xs text-gray-600">{ticket.subject}</p>
                    <span
                      className={`inline-block text-xs mt-1 px-2 py-0.5 rounded ${
                        ticket.status === "open"
                          ? "bg-green-100 text-green-700"
                          : ticket.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 p-4">No tickets found.</p>
            )}
          </>
        ) : (
          /* ✅ If ticket selected → show CHAT */
          <>
            {/* Chat Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex items-center text-gray-600 hover:text-black"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <div>
                <p className="font-bold">Ticket #{selectedTicket.id}</p>
                <p className="text-sm text-gray-600">
                  {selectedTicket.subject}
                </p>
              </div>
              <select
                value={status}
                onChange={handleStatusChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-3 flex ${
                      msg.sender === "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg text-white max-w-[70%] ${
                        msg.sender === "admin" ? "bg-blue-600" : "bg-gray-500"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <span className="text-xs text-gray-200 block mt-1">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No messages yet.</p>
              )}
            </div>

            {/* Input Box */}
            <div className="px-4 py-2 border-t flex items-center bg-white">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 h-12 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSend}
                className="ml-2 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                <FaPaperPlane />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RaiseTickets;
