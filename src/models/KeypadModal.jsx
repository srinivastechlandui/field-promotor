
import React from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function KeypadModal({ onGoClick, onClose }) {
  return (
    <div className="fixed top-0 left-0 bg-black bg-opacity-40 z-50">
      <div
        className="bg-white rounded-lg shadow-lg flex flex-col p-2 relative"
        style={{
          width: "200px",
          height: "300px",
        }}
      >
        <div className="grid grid-cols-3 gap-2 border-4 border-red-600 p-1 bg-red-600 flex-grow">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
            (key) => (
              <div
                key={key}
                className="flex items-center justify-center text-black font-bold bg-white"
                style={{ fontSize: "20px", height: "50px" }}
              >
                {key}
              </div>
            )
          )}
        </div>

        <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2">
          <button
            className="flex items-center justify-center gap-1 text-white font-bold rounded-full shadow-lg"
            style={{
              background: "linear-gradient(to right, purple, #d4145a)",
              fontSize: "16px",
              border: "2px solid gold",
              padding: "4px 12px",
            }}
             onClick={onGoClick} 
          >
            Enter
            <span><FaPaperPlane className="w-4 h-4" /></span>
          </button>
        </div>
      </div>
    </div>
  );
}
