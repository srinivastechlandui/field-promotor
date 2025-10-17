import React, { useState, useRef, useEffect } from "react";
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
  // const [message, setMessage] = useState("");
  const TEMPLATE = "Hello {{name}}, your paid earnings of ₹{{amount}} have been successfully processed. Thank you!";
  const [message, setMessage] = useState(TEMPLATE);
  const editorRef = useRef(null);
  const lastValidMessageRef = useRef(TEMPLATE);
  // Helper to create protected amount span
  // Helper to create protected placeholder span (name or amount)
  const makePlaceholderSpan = (name, displayText) => {
    const span = document.createElement("span");
    span.textContent = displayText || `{{${name}}}`;
    span.setAttribute("contenteditable", "false");
    span.dataset.placeholder = name;
    span.className = "text-blue-600 font-semibold px-1 rounded bg-blue-50 cursor-default";
    return span;
  };

  // Render template string into editor as text nodes + placeholder spans
  const renderTemplateIntoEditor = (tpl) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    while (editor.firstChild) editor.removeChild(editor.firstChild);
    const parts = tpl.split(/(\{\{name\}\}|\{\{amount\}\})/g);
    parts.forEach((part) => {
      if (part === "{{name}}") {
        editor.appendChild(makePlaceholderSpan("name", "{{name}}"));
      } else if (part === "{{amount}}") {
        editor.appendChild(makePlaceholderSpan("amount", "{{amount}}"));
      } else {
        editor.appendChild(document.createTextNode(part));
      }
    });
  };

  // Parse editor DOM -> template string
  const parseEditorToTemplate = () => {
    if (!editorRef.current) return "";
    let result = "";
    const nodes = Array.from(editorRef.current.childNodes);
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        if (el.dataset && el.dataset.placeholder) {
          result += `{{${el.dataset.placeholder}}}`;
        } else {
          result += el.textContent || "";
        }
      }
    });
    return result;
  };

  // onInput handler - update message, but protect amount
  const handleInput = (e) => {
    const newTpl = parseEditorToTemplate();
    // ensure both placeholders remain present
    if (!newTpl.includes("{{amount}}") || !newTpl.includes("{{name}}")) {
      renderTemplateIntoEditor(lastValidMessageRef.current);
      placeCaretAtEnd(editorRef.current);
      return;
    }
    setMessage(newTpl);
    lastValidMessageRef.current = newTpl;
  };

  // helper to place caret at end
  const placeCaretAtEnd = (el) => {
    if (!el) return;
    el.focus();
    if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

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

   // Step 2: after selecting recipients (ids), map them to user objects and open confirm
  const handleUserSelectSubmit = (selectedIds) => {
    setShowUserSelect(false);
    if (!selectedIds || selectedIds.length === 0) {
      alert("⚠️ No users selected.");
      return;
    }
    const selectedUsers = users.filter((u) => selectedIds.includes(u.user_id));
    setSelectedRecipients(selectedUsers);
    setShowConfirm(true); // ask before sending
  };

// when user clicks "Yes" in ConfirmModal
const handleConfirmYes = async () => {
  if (!selectedRecipients.length) return;

    try {
    setLoading(true);
    for (const u of selectedRecipients) {
      const personalized = message
        .replace(/\{\{amount\}\}/g, u.paidEarnings || AMOUNT)
        .replace(/\{\{name\}\}/g, u.employer_name || "");
      await axios.post(`${BASE_URL}/notifications/`, {
        message: personalized,
        user_ids: [u.user_id],
      });
    }
    alert(`✅ Sent personalized notification to ${selectedRecipients.length} user(s).`);
    setMessage(TEMPLATE);
    setSelectedRecipients([]);
    setShowConfirm(false);
    onClose?.();
  } catch (error) {
    console.error("❌ Failed to send notification", error);
    alert("❌ Failed to send notification");
  } finally {
    setLoading(false);
  }
};

// when user clicks "No"
const handleConfirmNo = () => {
  setShowConfirm(false);
};


  // When message changes programmatically, re-render editor
  useEffect(() => {
    if (!editorRef.current) return;
    const currentTpl = parseEditorToTemplate();
    if (currentTpl !== message) renderTemplateIntoEditor(message);
  }, [message]);

  // initial render of editor content
  useEffect(() => {
    renderTemplateIntoEditor(TEMPLATE);
    lastValidMessageRef.current = TEMPLATE;
  }, []);

  // fetch users for personalization
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/users/`);
        setUsers(data?.users || []);
      } catch (err) {
        console.error("❌ Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);
  return (
    <>
      {showMain && (
        <div className="fixed top-0 left-0 w-full h-full flex items-start bg-black bg-opacity-40 z-50 ">
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
              <button onClick={onClose} className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 transition-transform transform hover:scale-110">
                <IoClose className="text-white text-2xl" />
              </button>
            </div>

            {/* Paid Earnings Details */}
            <div className="text-center mb-6 text-gray-700 font-mono">
              <span className="text-gray-600">######## </span>
              <span className="text-green-600 font-bold">
                [₹{selectedUser?.paidEarnings || AMOUNT}]
              </span>
              <span className="text-gray-600"> ########</span>
            </div>
           

            {/* Message Input */}
            <div className="mb-3">
              <label className="font-semibold text-gray-700 mb-2 block">Compose your message:</label>
              <div
                ref={editorRef}
                contentEditable={true}
                onInput={handleInput}
                className="w-full p-2 border rounded text-sm min-h-[250px] bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400"
                style={{ whiteSpace: "pre-wrap", fontFamily: "system-ui, sans-serif" }}
                spellCheck={false}
              ></div>
              <div className="text-xs text-gray-500 mt-2">
                <span className="font-semibold text-purple-700">Ex:</span> Hello <code className="bg-gray-100 px-1 rounded text-blue-600">Raju</code>, your paid earnings of ₹<code className="bg-gray-100 px-1 rounded text-blue-600">500</code> have been successfully processed. Thank you!
              </div>
            </div>
  

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
        <ConfirmModal onYes={handleConfirmYes} onNo={handleConfirmNo} />
      )}
    </>
  );
}
