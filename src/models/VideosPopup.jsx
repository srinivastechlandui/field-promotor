import React, { useState } from "react";
import KeypadModal from "./KeypadModal";
import ConfirmModal from "./ConfirmModal";
import { FaPaperPlane } from "react-icons/fa";
export default function VideosPopup({ onClose }) {
  const [showMain, setShowMain] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

   const handleCloseAll = () => {
    setShowMain(false);
    setShowKeypad(false);
    setShowConfirm(false);
    onClose?.();
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
                {/* Close Button */}
                {/* <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white text-xl font-bold"
                >
                    ✖
                </button> */}

                {/* Main Row */}
                <div className="flex items-center gap-4 mt-10">
                    <div className="bg-gray-200 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow">
                    📺
                    </div>
                    <div className="flex flex-col">
                    <span className="text-white font-extrabold text-2xl drop-shadow-lg">
                        Videos for you
                    </span>
                    <span className="text-white text-3xl tracking-widest">
                        ************
                    </span>
                    </div>
                    <div className="ml-auto text-white text-3xl">›</div>
                </div>

                {/* Change Button */}
                <div className="absolute bottom-[-25px] left-1/2 -translate-x-1/2">
                    <button
                    onClick={() =>setShowKeypad(true)}
                    className="flex items-center gap-2 text-white font-bold py-2 px-6 rounded-full"
                    style={{
                        background: "linear-gradient(to right, #5b0e2d, #a83279)",
                        border: "2px solid gold",
                        boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                    }}
                    >
                    CHANGE <FaPaperPlane className="w-4 h-4" />
                    </button>
                </div>
                </div>
            </div>
        )}
      {/* Keypad Modal */}
      {showKeypad && (
        <KeypadModal
          onGoClick={() =>{
             setShowKeypad(true);
             setShowConfirm(true);
          }}
          onClose={() => setShowKeypad(false)}
        />
      )}

      {/* Are You Sure Modal */}
      {showConfirm && (
        <ConfirmModal
          onYes={handleCloseAll}
          onNo={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
