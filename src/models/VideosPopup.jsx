import React, { useState, useEffect } from "react";
import axios from "axios";
import KeypadModal from "./KeypadModal";
import ConfirmModal from "./ConfirmModal";
import { FaPaperPlane } from "react-icons/fa";
import BASE_URL from "../utils/Urls";
export default function VideosPopup({ onClose }) {
  const [showMain, setShowMain] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newVideoLink, setNewVideoLink] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const PRIMARY_LOCK = process.env.PRIMARY_LOCK || "5094";
  // Fetch video link
  useEffect(() => {
    axios
      .get(`${BASE_URL}/vedio_link/`)
      .then((res) => {
        if (res.data?.data?.length > 0) {
          setVideoLink(res.data.data[0].video_link);
        }
      })
      .catch((err) => console.error("Error fetching video link:", err));
  }, []);

  const handleCloseAll = () => {
    setShowMain(false);
    setShowKeypad(false);
    setShowConfirm(false);
    onClose?.();
  };

  // Save link then open KeypadModal
  const handleSaveClick = async () => {
    if (!newVideoLink.trim()) {
      alert("Please enter a valid link!");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/vedio_link/1`, {
        video_link: newVideoLink,
      });
      setVideoLink(newVideoLink);
      setIsEditing(false);

      // Open KeypadModal after successful save
      setShowKeypad(true);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update video link");
    }
  };

  // Confirm code validation
  const handleConfirmYes = () => {
    // if (enteredCode !== "1234") {
    //   alert("❌ Invalid code!");
    //   return;
    // }
    handleCloseAll();
  };

  return (
    <>
      {/* Main Videos Popup */}
      {showMain && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-start bg-black bg-opacity-40 z-50 animate-bottom-up">
          <div
            className="rounded-lg p-6 shadow-lg relative"
            style={{
              width: "500px",
              height: "200px",
              background: "linear-gradient(to right, #0052cc, #007bff)",
              borderRadius: "0.75rem 3rem 0.75rem 0.75rem",
            }}
          >
            <div className="flex items-center gap-4 mt-10">
              <div className="bg-gray-200 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow">
                📺
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-2xl drop-shadow-lg">
                  Videos for you
                </span>

               {isEditing ? (
              <input
                type="text"
                value={newVideoLink}
                onChange={(e) => setNewVideoLink(e.target.value)}
                className="mt-2 p-2 rounded text-black w-full"
                placeholder="Enter new video link"
              />
            ) : (
              <a
                href={videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg tracking-widest break-all underline hover:text-yellow-300"
              >
                {videoLink || "Loading..."}
              </a>
            )}
              </div>
              <div className="ml-auto text-white text-3xl">›</div>
            </div>

            {/* Edit / Save Button */}
            <div className="absolute bottom-[-25px] left-1/2 -translate-x-1/2">
              {!isEditing ? (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setNewVideoLink(videoLink);
                  }}
                  className="flex items-center gap-2 text-white font-bold py-2 px-6 rounded-full"
                  style={{
                    background: "linear-gradient(to right, #5b0e2d, #a83279)",
                    border: "2px solid gold",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  EDIT <FaPaperPlane className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSaveClick}
                  className="flex items-center gap-2 text-white font-bold py-2 px-6 rounded-full"
                  style={{
                    background: "linear-gradient(to right, #0e5b2d, #32a87a)",
                    border: "2px solid gold",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  SAVE <FaPaperPlane className="w-4 h-4" />
                </button>
              )}
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
          onNo={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
