import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/Urls";
import KeypadModal from "../models/KeypadModal";

export default function TermsAndConditions() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingTerm, setEditingTerm] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [saving, setSaving] = useState(false);

  const [showKeypad, setShowKeypad] = useState(false);
  const [unlocked, setUnlocked] = useState(false); 
  const PRIMARY_LOCK = process.env.PRIMARY_LOCK || "5094";
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/terms`);
        setTerms(res.data.result);
      } catch (err) {
        setError(
          err.response?.data?.message || "❌ Failed to load privacy policy"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const startEdit = (term) => {
    setEditingTerm(term);
    setNewContent(term.content);
    setUnlocked(false);
  };

  const unlockEdit = () => {
    setUnlocked(true); 
    setShowKeypad(false);
  };

  const handleSave = async () => {
    if (!editingTerm || !unlocked) return; 
    setSaving(true);
    try {
      await axios.put(`${BASE_URL}/admin/terms/${editingTerm.id}`, {
        content: newContent,
      });

      setTerms((prev) =>
        prev.map((t) =>
          t.id === editingTerm.id ? { ...t, content: newContent } : t
        )
      );

      setEditingTerm(null);
      setNewContent("");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to update");
    } finally {
      setSaving(false);
    }
  };

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
          className="bg-white border rounded-lg shadow-md p-4 mb-4 relative"
        >
          <p className="text-gray-700 whitespace-pre-line">{term.content}</p>
          <p className="text-xs text-gray-400 mt-2">
            Last updated: {new Date(term.updated_at).toLocaleDateString()}
          </p>
          <button
            onClick={() => startEdit(term)}
            className="absolute top-2 right-2 text-sm text-blue-600 hover:underline"
          >
            ✏️ Edit
          </button>
        </div>
      ))}

      {editingTerm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-3">Edit Term</h2>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full border rounded p-2 mb-3"
              rows="6"
            />
            <div className="flex justify-between items-center">
              {!unlocked && (
                <button
                  onClick={() => setShowKeypad(true)}
                  className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  🔒 Unlock to Save
                </button>
              )}
              <div className="space-x-2">
                <button
                  onClick={() => setEditingTerm(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!unlocked || saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showKeypad && (
        <KeypadModal
          lockCode={PRIMARY_LOCK}
          onGoClick={unlockEdit}
          onClose={() => setShowKeypad(false)}
        />
      )}
    </div>
  );
}
