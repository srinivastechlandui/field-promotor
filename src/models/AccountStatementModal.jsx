import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../utils/Urls";
import UserSelectModal from "./UserSelectModal";
import ConfirmModal from "./ConfirmModal";

export default function AccountStatementModal({ onClose }) {
  const TEMPLATE = "Hello {{name}}, your onboarding fee of Rs. {{amount}} is due.";
  const [message, setMessage] = useState(TEMPLATE);
  const [users, setUsers] = useState([]);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const lastValidMessageRef = useRef(TEMPLATE);

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
    // initial render of editor content
    renderTemplateIntoEditor(TEMPLATE);
    lastValidMessageRef.current = TEMPLATE;
  }, []);

  // helper to create protected placeholder span
  const makePlaceholderSpan = (name) => {
    const span = document.createElement("span");
    span.textContent = `{{${name}}}`;
    span.setAttribute("contenteditable", "false");
    span.dataset.placeholder = name; // mark it
    // styling class (Tailwind style via className)
    span.className =
      "text-blue-600 font-semibold px-1 rounded hover:text-blue-800 transition-colors cursor-default";
    return span;
  };

  // Render template string into editor as text nodes + placeholder spans
  const renderTemplateIntoEditor = (tpl) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    // clear
    while (editor.firstChild) editor.removeChild(editor.firstChild);

    // split by placeholders keeping them
    const parts = tpl.split(/(\{\{name\}\}|\{\{amount\}\})/g);
    parts.forEach((part) => {
      if (part === "{{name}}") {
        editor.appendChild(makePlaceholderSpan("name"));
      } else if (part === "{{amount}}") {
        editor.appendChild(makePlaceholderSpan("amount"));
      } else {
        // regular text node
        editor.appendChild(document.createTextNode(part));
      }
    });
  };

  // parse editor DOM -> template string (placeholders become {{name}} etc)
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
          // other element (fall back to its text)
          result += el.textContent || "";
        }
      }
    });
    return result;
  };

  // onInput handler - update message, but protect placeholders
  const handleInput = (e) => {
    const newTpl = parseEditorToTemplate();

    // ensure both placeholders are present; if not, revert to last valid state
    if (!newTpl.includes("{{name}}") || !newTpl.includes("{{amount}}")) {
      // revert editor to last valid HTML (keeps caret awkwardness to minimal)
      renderTemplateIntoEditor(lastValidMessageRef.current);
      // place caret at end - optional UX
      placeCaretAtEnd(editorRef.current);
      return;
    }

    // otherwise accept it
    setMessage(newTpl);
    lastValidMessageRef.current = newTpl;
  };

  // helper to place caret at end (small UX nicety when we revert)
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

  // open user select modal
  const handleSendClick = () => {
    if (!message || !message.trim()) {
      alert("⚠️ Please enter a message before sending.");
      return;
    }
    setShowUserSelectModal(true);
  };

  // send personalized notifications (one request per user to match backend)
  const handleUserSelectSubmit = async (selectedIds) => {
    setShowUserSelectModal(false);
    if (!selectedIds || selectedIds.length === 0) {
      alert("⚠️ No users selected.");
      return;
    }

    const selectedUsers = users.filter((u) => selectedIds.includes(u.user_id));
    try {
      setLoading(true);
      for (const u of selectedUsers) {
        const personalized = message
          .replace(/{{name}}/g, u.employer_name)
          .replace(/{{amount}}/g, u.onboarding_fee);

        await axios.post(`${BASE_URL}/notifications/`, {
          message: personalized,
          user_ids: [u.user_id],
        });
      }

      alert(`✅ Sent personalized notification to ${selectedUsers.length} user(s).`);
      setShowConfirm(true);
      setMessage(TEMPLATE);
      lastValidMessageRef.current = TEMPLATE;
      renderTemplateIntoEditor(TEMPLATE);
    } catch (err) {
      console.error("❌ Failed to send notification", err);
      alert("❌ Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    setShowConfirm(false);
    onClose?.();
  };

  // When message changes programmatically (only happens after send/reset), re-render editor
  useEffect(() => {
    // only re-render if editor content doesn't match message (prevents caret jumps while typing)
    if (!editorRef.current) return;
    const currentTpl = parseEditorToTemplate();
    if (currentTpl !== message) renderTemplateIntoEditor(message);
  }, [message]);

  return (
    <>
      <div className="fixed top-0 left-0 w-80 h-full flex items-start z-50">
        <div
          className="rounded-2xl shadow-2xl flex flex-col p-5 relative animate-[slideInLeft_0.4s_ease-out_forwards] hover:shadow-purple-400 transition-all"
          style={{
            width: "320px",
            height: "480px",
            background: "linear-gradient(to bottom right, #ffffff, #f0e8ff)",
            border: "2px solid #8b5cf6",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-red-700 tracking-wide drop-shadow">
              💸 Payment Due
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 transition-transform transform hover:scale-110"
            >
              <IoClose className="text-white text-2xl" />
            </button>
          </div>

          {/* Editable Message */}
          <div className="flex flex-col flex-grow">
            <label className="font-semibold text-gray-700 mb-2">
              Compose your message:
            </label>

            <div
              ref={editorRef}
              contentEditable={true}
              onInput={handleInput}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white shadow-inner min-h-[250px] focus:outline-none focus:ring-2 focus:ring-indigo-400 overflow-y-auto leading-relaxed hover:border-indigo-400 transition"
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "system-ui, sans-serif",
              }}
              spellCheck={false}
            ></div>

            <div className="text-xs text-gray-500 mt-3">
               <span className="font-semibold text-purple-700">Ex:</span>{" "}
              Hello
              <code className="bg-gray-100 px-1 rounded text-blue-600">Raju</code> and{" "}
              your onboarding fee of Rs. 
              <code className="bg-gray-100 px-1 rounded text-blue-600">1000</code>{" "}is due.
            </div>

            {/* Send Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSendClick}
                disabled={loading}
                // className="flex items-center gap-2 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg transition-all hover:shadow-indigo-500/50 hover:scale-105"
               className="flex items-center gap-2 text-white font-bold py-2.5 px-6 rounded-full shadow-lg transition-all hover:scale-105"
                               style={{
                                 background: "linear-gradient(to right, #5b0e2d, #a83279)",
                                 border: "2px solid gold",
                                 boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                               }}
              >
                {loading ? "Sending..." : "Select Users & Send"}
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showUserSelectModal && (
        <UserSelectModal
          onClose={() => setShowUserSelectModal(false)}
          onSubmit={handleUserSelectSubmit}
        />
      )}

      {showConfirm && (
        <ConfirmModal onYes={handleCloseAll} onNo={() => setShowConfirm(false)} />
      )}
    </>
  );
}
