
import React, { useState } from "react";

export default function ConfirmModal({ onYes, onNo }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = (callback) => {
    setTimeout(() => {
      setIsClosing(true);
      callback();
    },); 
  };
  return (
    <div className={`fixed top-0 right-0 bg-black bg-opacity-40 z-50 rounded-lg transition-all duration-500 ease-out ${
      isClosing ? "translate-y-[-100%] opacity-0" : "translate-y-0 opacity-100"
    }`}>
      <div
        className="bg-gray-200 rounded-lg shadow-lg flex flex-col items-center p-6"
        style={{
          width: "250px",
          height: "200px",
        }}
      >
        <div
          className="flex items-center justify-center text-white font-bold"
          style={{
            background: "linear-gradient(to right, #8b0000, #ff0000)",
            borderRadius: "50px",
            border: "2px solid gold",
            padding: "10px 20px",
            fontSize: "20px",
            boxShadow: "inset 0px 0px 5px rgba(255,255,255,0.5)",
          }}
        >
          ARE YOU SURE ?
        </div>

        <div
          style={{
            height: "8px",
            backgroundColor: "#8b5e5e",
            width: "100%",
            margin: "15px 0",
          }}
        ></div>

        <div className="flex justify-between w-full px-4">
          <button
            style={{
              backgroundColor: "#d4d448",
              border: "2px solid blue",
              color: "black",
              fontWeight: "bold",
              fontSize: "18px",
              width: "80px",
              height: "60px",
            }}
            onClick={() => handleClose(onYes)}
          >
            YES
          </button>
          <button
            style={{
              backgroundColor: "red",
              color: "black",
              fontWeight: "bold",
              fontSize: "18px",
              width: "80px",
              height: "60px",
            }}
            onClick={onNo}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
