import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import ConfirmModal from "./ConfirmModal";
import { FaPaperPlane } from "react-icons/fa";

export default function AccountStatementModal({ onClose }) {
  const [showMain, setShowMain] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const emptyLines = 6;

  const handleCloseAll = () => {
    setShowMain(false);
    setShowConfirm(false);
    onClose?.();
    };
  return (
    <>
         {showMain && (
        <div className="fixed top-0 left-0 w-80 h-full flex items-start z-50 ">
            <div
                className="rounded-lg shadow-lg flex flex-col p-4 relative
                 animate-[slideInLeft_0.4s_ease-out_forwards]"
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
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                }}
              >
              Payment Due
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded bg-red-600"
              >
                <IoClose className="text-white text-2xl" />
              </button>
            </div>
            

            {/* Statement lines */}
            {/* <div className="text-center mb-2 text-gray-700 font-mono">
                <span className="text-gray-600">######## </span>
                <span className="text-green-600 font-bold">[$$$$$]</span>
                <span className="text-gray-600"> ########</span>
            </div> */}
            <div className="text-center mb-6 text-gray-700 font-mono">
                <span className="text-gray-600">######## </span>
                <span className="text-red-600 font-bold">[$$$$$]</span>
                <span className="text-gray-600"> ########</span>
            </div>

            {/* Horizontal lines */}
            <div className="flex flex-col gap-2 overflow-y-auto mb-4 flex-grow">
              {Array.from({ length: emptyLines }).map((_, index) => (
                <div
                  key={index}
                  className="border-b-4 border-black pb-1 text-sm text-black my-4"
                >
                </div>
              ))}
            </div>

            {/* Send Button */}
            <div onClick={() => setShowConfirm(true)} 
              className="bottom-[70px] left-1/2 -translate-x-1/2  absolute">
                <button className="flex items-center gap-2 text-white font-bold py-1 px-4 rounded-full"
                style={{
                  background: "linear-gradient(to right, #5b0e2d, #a83279)",
                  border: "2px solid gold",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                }}>
                SEND
                <FaPaperPlane className="w-4 h-4" />
                </button>
            </div>
            </div>
        </div>
      )}
      {showConfirm && (
              <ConfirmModal
                onYes={handleCloseAll}
                onNo={() => setShowConfirm(false)}
              />
            )}
    </>

  );
}
