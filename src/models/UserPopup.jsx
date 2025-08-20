import React, { useState } from 'react';
import { FaChevronUp, FaTimes } from 'react-icons/fa'; // Import X icon
import job from '../Assets/jonoprtunity.png'; // Import your background image
import ConfirmModal from './ConfirmModal';

const UserPopup = ({ onClose }) => {
    const [showMain, setShowMain] = useState(true);
          const [showConfirm, setShowConfirm] = useState(false);
          const handleCloseAll = () => {
            setShowMain(false);
            setShowConfirm(false);
            onClose?.();
            };
  return (
        <>
         {showMain && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="relative rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
        style={{ backgroundImage: `url(${job})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Semi-transparent white overlay to make text readable */}
        {/* <div className="absolute inset-0 bg-white bg-opacity-80"></div> */}
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-sm z-10 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        
        {/* Content container */}
        <div className="relative p-6 my-5">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-white text-sm font-semibold mb-1">USER ID</label>
                <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
                    <input 
                        type="text" 
                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"                
                        placeholder="Enter user ID"
                    />
                </div>
            </div>
            
            <div>
              <label className="block text-white text-sm font-semibold mb-1">Ph number</label>
              <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
              <input 
                type="tel" 
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                placeholder="Enter phone number"
              />
              </div>
            </div>
            
            <div>
              <label className="block text-white text-sm font-semibold mb-1">EMAIL</label>
                <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
                    <input 
                        type="email" 
                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                        placeholder="Enter email"
                    />
                </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <p className="text-white text-lg font-bold">Onboarding/Diagrama verification fee</p>
                <div className="w-44 h-28">
                    <input
                    type="text"
                    className="w-full h-full px-3 py-2 text-sm border-2 border-dashed border-red-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500
                     bg-gray-400 placeholder:text-center placeholder:text-slate-50 text-white text-center"
                    placeholder="Amount"
                    />
                </div>
          </div>
          <div className='flex items-center justify-center mb-6 text-white text-lg font-bold'>
            <FaChevronUp />
          </div>
          <button onClick={() => setShowConfirm(true)}
            className="w-full bg-green-500 border-2 border-white text-white font-bold py-3 px-4 rounded-lg transition duration-200">
            CREATE ACCOUNT
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
};

export default UserPopup;