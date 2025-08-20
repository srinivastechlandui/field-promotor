import React, { useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

const RaiseTickets = ({onClose}) => {
  const [message, setMessage] = useState('');
  return (
    <div className="bg-gray-800 fixed top-0 left-0 font-sans z-50">
      <div className="bg-white w-[400px] h-[600px] rounded-xl shadow-lg relative pt-[60px] overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-8 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-sm z-10 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        {/* Spirals at the top */}
        <div className="absolute top-[-20px] left-0 right-0 flex justify-around px-[10px]">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-[20px] h-[50px] rounded-lg bg-[radial-gradient(circle_at_center,_#aaa_40%,_#555_100%)]"
            ></div>
          ))}
        </div>

        {/* Header with back arrow and title */}
        <div className="absolute top-[28px] left-[15px] flex items-center gap-[10px]  bg-gray-500/40 backdrop-blur-sm rounded-sm px-3 py-1 shadow-lg">
          {/* <span className="text-gray-500 text-xl cursor-pointer">&#x276E;</span>
          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-sm">📄</span>
          </div> */}
          <span className="font-bold text-lg text-white drop-shadow-md">RAISE TICKET</span>
        </div>

        {/* Lines */}
        <div className="h-full flex flex-col justify-around px-[15px] relative pb-[120px]">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i}
              className={`border-b border-gray-300 flex-1 relative ${i === 8 ? 'ninth-line' : ''}`}
            ></div>
          ))}

          <div className="absolute bottom-[125px] right-2">          
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white font-bold py-1 px-4 rounded-full"
              style={{
                background: "linear-gradient(to right, #5b0e2d, #a83279)",
                border: "2px solid gold",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
              }}
            >
              SEND <FaPaperPlane className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-4 mt-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Type your message here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseTickets;