import React, { useState, useEffect } from "react";
import axios from "axios";
import KeypadModal from "./KeypadModal";
import ConfirmModal from "./ConfirmModal";
import { FaPaperPlane, FaEdit, FaTrash } from "react-icons/fa";
import BASE_URL from "../utils/Urls";

export default function VideosPopup({ onClose }) {
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [newVideoLink, setNewVideoLink] = useState("");

  const [showMain, setShowMain] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [enteredCode, setEnteredCode] = useState("");
  const [pendingAction, setPendingAction] = useState(null); // "save" or "delete"
  const [targetVideo, setTargetVideo] = useState(null); // video to delete

  const PRIMARY_LOCK = process.env.PRIMARY_LOCK || "5094";

  // ---- FETCH ----
  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/vedio_link/`);
      if (res.data?.data) {
        setVideos(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching video links:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ---- CLOSE ----
  const handleCloseAll = () => {
    setShowMain(false);
    setShowKeypad(false);
    setShowConfirm(false);
    onClose?.();
  };

  // ---- SAVE (start flow) ----
  const handleSaveClick = () => {
    if (!newVideoLink.trim()) {
      alert("Please enter a valid link!");
      return;
    }
    setPendingAction("save");
    setShowKeypad(true);
  };

  // ---- DELETE (start flow) ----
  const handleDeleteClick = (video) => {
    setPendingAction("delete");
    setTargetVideo(video);
    setShowKeypad(true);
  };

  // ---- Confirm Yes (execute action) ----
  const handleConfirmYes = async () => {
    try {
      if (pendingAction === "save") {
        if (editingVideo) {
          await axios.put(`${BASE_URL}/vedio_link/${editingVideo.id}`, {
            video_link: newVideoLink,
          });
        } else {
          await axios.post(`${BASE_URL}/vedio_link/`, {
            video_link: newVideoLink,
          });
        }
        await fetchVideos();
        setEditingVideo(null);
        setNewVideoLink("");
        alert("✅ Video link saved successfully!");
      }

      if (pendingAction === "delete" && targetVideo) {
        await axios.delete(`${BASE_URL}/vedio_link/${targetVideo.id}`);
        await fetchVideos();
        alert("🗑️ Video link deleted successfully!");
      }

      // reset state
      setPendingAction(null);
      setTargetVideo(null);
      handleCloseAll();
    } catch (error) {
      console.error("Action failed:", error);
      alert("❌ Failed to perform action");
    }
  };

  return (
    <>
      {/* Main Videos Popup */}
      {showMain && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-start bg-black bg-opacity-40 z-50 animate-bottom-up">
          <div
            className="rounded-lg p-6 shadow-lg relative"
            style={{
              width: "600px",
              minHeight: "350px",
              background: "linear-gradient(to right, #0052cc, #007bff)",
              borderRadius: "0.75rem 3rem 0.75rem 0.75rem",
            }}
          >
            <button
              onClick={handleCloseAll}
              className="absolute top-3 right-3 text-gray-500 text-2xl font-bold hover:text-red-500 hover:rotate-90 transition-transform duration-200"
            >
              ✕
            </button>

            <h2 className="text-white font-extrabold text-2xl drop-shadow-lg mb-4 flex items-center gap-2">
              📺 Videos for you
            </h2>

            {/* Video List */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between bg-white/20 p-3 rounded-lg"
                  >
                    <a
                      href={video.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline hover:text-yellow-300 break-all flex-1"
                    >
                      {video.video_link}
                    </a>

                    <div className="flex items-center gap-3 ml-3">
                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingVideo(video);
                          setNewVideoLink(video.video_link);
                        }}
                        className="text-yellow-300 hover:text-yellow-500"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteClick(video)}
                        className="text-red-400 hover:text-red-600"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white italic">No videos found.</p>
              )}
            </div>

            {/* Add / Edit */}
            <div className="mt-6">
              <input
                type="text"
                value={newVideoLink}
                onChange={(e) => setNewVideoLink(e.target.value)}
                className="w-full p-2 rounded text-black"
                placeholder="Enter video link"
              />
              <button
                onClick={handleSaveClick}
                className="mt-3 w-full flex items-center justify-center gap-2 text-white font-bold py-2 px-6 rounded-full"
                style={{
                  background: editingVideo
                    ? "linear-gradient(to right, #0e5b2d, #32a87a)"
                    : "linear-gradient(to right, #5b0e2d, #a83279)",
                  border: "2px solid gold",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                {editingVideo ? "SAVE CHANGES" : "ADD VIDEO"}{" "}
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keypad Modal */}
      {showKeypad && (
        <KeypadModal
          lockCode={PRIMARY_LOCK}
          onGoClick={() => {
            setShowKeypad(false);
            setShowConfirm(true);
          }}
          onClose={() => setShowKeypad(false)}
        />
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          code={enteredCode}
          setCode={setEnteredCode}
          onYes={handleConfirmYes}
          onNo={() => {
            setShowConfirm(false);
            setPendingAction(null);
            setTargetVideo(null);
          }}
        />
      )}
    </>
  );
}

