// import React, { useState } from "react";
// import { FaPaperPlane } from "react-icons/fa";
// const PRIMARY_LOCK = process.env.PRIMARY_LOCK;
// export default function KeypadModal({ lockCode = PRIMARY_LOCK, onGoClick, onClose }) {
//   const [input, setInput] = useState("");

//   const handleKeyPress = (key) => {
//     if (input.length < 4) {
//       setInput((prev) => prev + key);
//     }
//   };

//   const handleClear = () => {
//     setInput("");
//   };

//   const handleEnter = () => {
//     if (input === lockCode) {
//       onGoClick?.();
//       setInput("");
//     } else {
//       alert("❌ Wrong PIN");
//       setInput("");
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
//       <div
//         className="bg-white rounded-lg shadow-lg flex flex-col p-2 relative"
//         style={{ width: "200px", height: "320px" }}
//       >
//         {/* PIN Display */}
//         <div className="text-center text-lg font-bold py-2 tracking-widest">
//           {input.split("").map(() => "•").join(" ")}
//         </div>

//         {/* Keypad */}
//         <div className="grid grid-cols-3 gap-2 border-4 border-red-600 p-1 bg-red-600 flex-grow">
//           {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => (
//             <div
//               key={key}
//               className="flex items-center justify-center text-black font-bold bg-white cursor-pointer"
//               style={{ fontSize: "20px", height: "50px" }}
//               onClick={() => handleKeyPress(key)}
//             >
//               {key}
//             </div>
//           ))}
//           {/* Clear Button */}
//           <div
//             className="flex items-center justify-center text-black font-bold bg-white cursor-pointer p-5"
//             style={{ fontSize: "20px", height: "50px" }}
//             onClick={handleClear}
//           >
//             Clear
//           </div>
//           {/* Zero Button */}
//           <div
//             className="flex items-center justify-center text-black font-bold bg-white cursor-pointer"
//             style={{ fontSize: "20px", height: "50px" }}
//             onClick={() => handleKeyPress("0")}
//           >
//             0
//           </div>
//           {/* Backspace Button */}
//           <div
//             className="flex items-center justify-center text-black font-bold bg-white cursor-pointer text-2xl"
//             style={{ fontSize: "20px", height: "50px" }}
//             onClick={() => setInput(input.slice(0, -1))}
//           >
//             ←
//           </div>
//         </div>

//         {/* Enter Button */}
//         <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2">
//           <button
//             className="flex items-center justify-center gap-1 text-white font-bold rounded-full shadow-lg"
//             style={{
//               background: "linear-gradient(to right, purple, #d4145a)",
//               fontSize: "16px",
//               border: "2px solid gold",
//               padding: "4px 12px",
//             }}
//             onClick={handleEnter}
//           >
//             Enter
//             <FaPaperPlane className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-1 right-1 text-red-600 font-bold"
//         >
//           ✕
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../utils/Urls";

export default function KeypadModal({ type = "primary", onGoClick, onClose }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (key) => {
    if (input.length < 4) setInput((prev) => prev + key);
  };

  const handleClear = () => setInput("");

  const handleEnter = async () => {
    if (loading || !input) return;
    setLoading(true);

    // ✅ Choose endpoint based on type
    const endpoint =
      type === "primary"
        ? `${BASE_URL}/locks/verify-primary`
        : `${BASE_URL}/locks/verify-secondary`;

    try {
      const res = await axios.post(endpoint, { code: input });

      if (res.data?.valid) {
        console.log(`✅ ${type.toUpperCase()} lock verified successfully`);
        onGoClick?.();
        setInput("");
      } else {
        alert("❌ Wrong PIN");
        setInput("");
      }
    } catch (err) {
      console.error("❌ Verification failed:", err);
      alert("❌ Failed to verify PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg shadow-lg flex flex-col p-2 relative"
        style={{ width: "200px", height: "320px" }}
      >
        <div className="text-center text-lg font-bold py-2 tracking-widest">
          {input.split("").map(() => "•").join(" ")}
        </div>

        <div className="grid grid-cols-3 gap-2 border-4 border-red-600 p-1 bg-red-600 flex-grow">
          {["1","2","3","4","5","6","7","8","9"].map((key) => (
            <div
              key={key}
              className="flex items-center justify-center text-black font-bold bg-white cursor-pointer"
              style={{ fontSize: "20px", height: "50px" }}
              onClick={() => handleKeyPress(key)}
            >
              {key}
            </div>
          ))}
          <div
            className="flex items-center justify-center text-black font-bold bg-white cursor-pointer"
            style={{ fontSize: "20px", height: "50px" }}
            onClick={handleClear}
          >
            Clear
          </div>
          <div
            className="flex items-center justify-center text-black font-bold bg-white cursor-pointer"
            style={{ fontSize: "20px", height: "50px" }}
            onClick={() => handleKeyPress("0")}
          >
            0
          </div>
          <div
            className="flex items-center justify-center text-black font-bold bg-white cursor-pointer text-2xl"
            style={{ fontSize: "20px", height: "50px" }}
            onClick={() => setInput(input.slice(0, -1))}
          >
            ←
          </div>
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
            onClick={handleEnter}
            disabled={loading}
          >
            {loading ? "Loading..." : "Enter"}
            <FaPaperPlane className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-red-600 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
