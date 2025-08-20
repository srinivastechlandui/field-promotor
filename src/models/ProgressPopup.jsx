import React, { useState } from "react";
import { FaCheck, FaPaperPlane } from "react-icons/fa";
import KeypadModal from "./KeypadModal";
import ConfirmModal from "./ConfirmModal";

const ProgressPopup = ({ onClose }) => {
    const [showMain, setShowMain] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <>
      {/* Main Progress Modal */}
      {showMain && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center z-50">
            <div
            className="bg-white rounded-lg shadow-lg flex flex-col relative animate-slideUp"
            style={{
                width: "500px",
                height: "300px",
            }}
            >
              {/* Progress tracker section */}
              <div
                className="border border-red-500 rounded-lg m-4 flex items-center justify-center flex-col"
                style={{ height: "480px" }}
              >
                <div className="flex items-center w-full relative justify-between px-10">
                {/* Gray line */}
                <div className="absolute h-[3px] bg-gray-300 top-1/2 left-[65px] right-[65px] -translate-y-1/2"></div>
                {/* Green progress line */}
                <div
                    className="absolute h-[3px] bg-green-500 top-1/2 -translate-y-1/2"
                    style={{ left: "65px", width: "300px" }}
                ></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center z-10">
                    <span className="text-lg font-bold text-black">0</span>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    <FaCheck />
                    </div>
                    <span className="text-lg text-gray-700">3</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center z-10">
                    <span className="text-lg font-bold text-black">0</span>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    <FaCheck />
                    </div>
                    <span className="text-lg text-gray-700">8</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center z-10">
                    <span className="text-lg font-bold text-black">550</span>
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-white"></div>
                    <span className="text-lg text-gray-700">11</span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center z-10">
                    <span className="text-lg font-bold text-black">850</span>
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white"></div>
                    <span className="text-lg text-gray-700">13</span>
                </div>
              </div>
              </div>
            {/* Change button area */}
            <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2">
                <button
                onClick={() => setShowKeypad(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-800 to-pink-600 text-white font-bold py-3 px-10 rounded-full shadow-lg"
                 style={{border:"2px solid gold"}}>
                CHANGE
                <FaPaperPlane className="w-4 h-4" />
                </button>
            </div>
            </div>
        </div>
      )}
      {/* Keypad Modal */}
    {showKeypad && (
        <KeypadModal
          onGoClick={() => {
            setShowKeypad(true);
            setShowConfirm(true);
          }}
          onClose={() => setShowKeypad(false)}
        />
    )}
    {showConfirm && (
        <ConfirmModal
          onYes={() => {
            setShowConfirm(false);
            setShowMain(false);
            onClose?.(); 
          }}
          onNo={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default ProgressPopup;
