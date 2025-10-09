import React, { useState } from "react";
import { FaCheck, FaPaperPlane } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import KeypadModal from "./KeypadModal";
import UserSelectModal from "./UserSelectModal";
import axios from "axios";
import BASE_URL from "../utils/Urls";
//  const BASE_URL = "http://localhost:8080/api/v1";
const ProgressPopup = ({ onClose }) => {
  const [showMain, setShowMain] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showUserSelect, setShowUserSelect] = useState(false);

  const PRIMARY_LOCK = process.env.PRIMARY_LOCK || "5094";

  // Editable tracker values
  const defaultSteps = [
    { top: "0", bottom: "3" },
    { top: "0", bottom: "8" },
    { top: "SALARY", bottom: "11" },
    { top: "850", bottom: "13" },
  ];

  const [steps, setSteps] = useState(defaultSteps);

  // ✅ Update tracker values
  const handleChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  // ✅ Save to backend
  const saveForUsers = async (userIds) => {
    try {
      const amounts = steps.map((s) => s.top);
      const accounts = steps.map((s) => s.bottom);

      for (let id of userIds) {
        await axios.put(`${BASE_URL}/progress/${id}`, { amounts, accounts });
      }

      // Reset values
      setSteps(defaultSteps);
      setShowUserSelect(false);
      setShowMain(false);
      onClose?.();
    } catch (err) {
      console.error("❌ Failed to save progress", err);
    }
  };

  return (
    <>
      {/* Main Progress Modal */}
      {showMain && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-lg flex flex-col relative animate-slideUp"
            style={{ width: "500px", height: "300px" }}
          >
             
            {/* ❌ Close button */}
            <button
              onClick={() => {
                setShowMain(false);
                onClose?.();
              }}
              className="absolute top-3 right-5 text-red-600 hover:text-red-800"
            >
              <IoClose className="text-2xl" />
            </button>

            {/* Progress tracker */}
            <div
              className="border border-red-500 rounded-lg m-4 flex flex-col items-center justify-center"
              style={{ height: "480px" }}
            >
               <div className="text-left font-bold text-lg mb-4">
                 Amounts
               </div>
              <div className="flex items-center w-full relative justify-between px-10">
                {/* Gray line */}
                <div className="absolute h-[3px] bg-gray-300 top-1/2 left-[65px] right-[65px] -translate-y-1/2"></div>
                {/* Green progress line */}
                <div
                  className="absolute h-[3px] bg-green-500 top-1/2 -translate-y-1/2"
                  style={{ left: "65px", width: "300px" }}
                ></div>

                {/* Steps */}
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center z-10">
                    {/* Editable Top */}
                    <input
                      type="text"
                      value={step.top}
                      onChange={(e) =>
                        handleChange(index, "top", e.target.value)
                      }
                      className="text-lg font-bold text-black text-center w-16 border-b border-gray-300 focus:outline-none"
                    />

                    {/* Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        index < 2
                          ? "bg-green-500 text-white"
                          : "border-2 border-gray-300 bg-white"
                      }`}
                    >
                      {index < 2 && <FaCheck />}
                    </div>

                    {/* Editable Bottom */}
                    <input
                      type="text"
                      value={step.bottom}
                      onChange={(e) =>
                        handleChange(index, "bottom", e.target.value)
                      }
                      className="text-lg text-gray-700 text-center w-16 border-b border-gray-300 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
                 <div className="text-left font-bold text-lg mb-4">
                  Accounts
                </div>
            </div>

            {/* Change button */}
            <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2">
              <button
                onClick={() => setShowKeypad(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-800 to-pink-600 text-white font-bold py-3 px-10 rounded-full shadow-lg"
                style={{ border: "2px solid gold" }}
              >
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
          lockCode={PRIMARY_LOCK}
          onGoClick={() => {
            setShowKeypad(false);
            setShowUserSelect(true);
          }}
          onClose={() => setShowKeypad(false)}
        />
      )}

      {/* User Select Modal */}
      {showUserSelect && (
        <UserSelectModal
          onClose={() => setShowUserSelect(false)}
          onSubmit={saveForUsers}
        />
      )}
    </>
  );
};

export default ProgressPopup;

