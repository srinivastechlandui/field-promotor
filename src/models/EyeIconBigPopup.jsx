import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import car from '../Assets/car.jpg'
import KeypadModal from "./KeypadModal";
import ConfirmModal from "./ConfirmModal";
export default function EyeIconBigPopup({ onClose }) {
    const [showKeypad, setShowKeypad] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMain, setShowMain] = useState(true);
     const handleCloseAll = () => {
        setShowMain(false);
        setShowKeypad(false);
        setShowConfirm(false);
        onClose?.();
  };
  return (
    <>
     {showMain && (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
      <div className="w-full h-[278px] p-2">
        {/* Top Bar */}
        <div
          className="flex items-center relative border-4 border-red-500 rounded-2xl bg-white p-4 h-[150px] overflow-hidden" // CHANGED: Added overflow-hidden
        >
          {/* Stats Section */}
          <div className="flex items-center flex-grow relative">
            <div className="text-center relative z-10 mr-5">
              <span className="w-[30px] h-[30px] mb-1 flex justify-center items-center text-3xl">
                <FaEye />
              </span>
              <span className="font-bold text-sm text-red-500">TOTAL</span>
            </div>

            <div className="flex items-center gap-7">
              <div className="flex flex-col items-center mr-20 z-10">
                <div className="flex items-center gap-4 w-20">
                  <span className="text-lg font-bold text-orange-500 min-w-[120px]">UNFILLED</span>
                  <span className="text-lg font-bold text-orange-500">[###]</span>
                </div>
                <div className="flex items-center gap-4 w-20">
                  <span className="text-lg font-bold text-[#A80C0F] min-w-[120px]">UNVERIFIED</span>
                  <span className="text-lg font-bold text-[#A80C0F]">[###]</span>
                </div>
                <div className="flex items-center gap-4 w-20">
                  <span className="text-lg font-bold text-[#B100AE] min-w-[120px]">PROCESSING</span>
                  <span className="text-lg font-bold text-[#B100AE]">[###]</span>
                </div>
              </div>

              <div className="flex flex-col items-center mr-8 z-10">
                <div className="flex items-center w-20">
                  <span className="text-lg font-bold text-[#6EDC54] min-w-[100px]">Active</span>
                  <span className="text-lg font-bold text-[#6EDC54]">[###]</span>
                </div>
                <div className="flex items-center w-20">
                  <span className="text-lg font-bold text-[#F10000] min-w-[100px]">Inactive</span>
                  <span className="text-lg font-bold text-[#F10000]">[###]</span>
                </div>
                <div className="flex items-center w-20">
                  <span className="text-lg font-bold text-[#A80C0F] min-w-[100px]">Deactivate</span>
                  <span className="text-lg font-bold text-[#A80C0F]">[###]</span>
                </div>
              </div>

              <div className="flex items-center justify-center min-w-[100px]">
                Total : [#]
              </div>
            </div>

            <div className="flex flex-col z-10 min-w-[100px]">
              <div className="mb-1">
                <span className="text-lg font-bold text-purple-700">$$$$</span>
              </div>
              <div>
                <span className="text-xs font-bold text-purple-700">
                  NO.OF Edited Accounts [#]
                </span>
              </div>
            </div>

            {/* Boxes */}
            <div className="flex items-center justify-center">
              <div className="w-[121px] h-[114px] border-2 border-green-500 text-green-500 rounded-md flex items-center justify-center z-10">
                <span className="font-bold text-sm">$$$$$$$$</span>
              </div>
            </div>
            <div className="px-3 py-1 border-2 border-brown-700 text-brown-700 rounded-md text-center mx-1 z-10">
              <span className="text-xs block">...</span>
              <span className="font-bold text-sm block">$$$$</span>
              <span className="text-xs block">NO.OF Edited Accounts [#]</span>
            </div>
            <div className="relative w-[380px] h-[120px] border-2 border-gray-300 rounded overflow-hidden flex-shrink-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center filter blur-xs"
                    style={{ backgroundImage: `url(${car})` }}
                ></div>
            
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center p-2">
                    {/* Text Content */}
                    <div className="flex w-full justify-between z-10 mx-5">
                    <div className="flex flex-col items-start">
                        <span className="text-xs text-white font-medium">Accounts</span>
                        <span className="text-lg text-white font-bold">50K</span>
                        <span className="text-lg text-[#B100AE] font-bold">000</span>
                    </div>
                    <div className="text-lg font-bold text-orange-500">[#]</div>
                    <div className="text-lg font-bold text-[#A80C0F]">[#]</div>
                    <div className="border-2 border-red-500 bg-white bg-opacity-90 p-2 rounded text-black text-center font-bold">
                        <span className="block">#</span>
                        <span className="text-red-500 block">$$$$$$$$</span>
                        <span className="text-xs block">NO.OF Edited Accounts [#]</span>
                    </div>
                    </div>
                </div>
            </div>
            <div>000</div>
          </div>         
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-center -mt-8 relative">
          {/* Exit Button */}
          <div className="relative z-10 w-[150px] h-[50px] bg-[#333] border-4 border-red-500 rounded-l-2xl border-r-0 ml-5">
            <button className="w-full h-full bg-red-500 text-white font-bold text-lg flex justify-center items-center rounded-l-2xl shadow-inner">
              <span>EXIT</span>
              <span className="ml-2 text-xl"
               onClick={() =>setShowKeypad(true)}>
                X
              </span>
            </button>
          </div>

          {/* Due Section */}
          <div className="border-4 border-red-500 rounded-2xl bg-white px-5 h-[40px] flex items-center justify-center -translate-x-[20px] translate-y-3">
            <span className="font-bold text-red-500 mr-2">DUE</span>
            <span className="font-bold whitespace-nowrap">
              <span className="text-[#A80C0F]">$$$$$$$$$</span> + <span className="text-[#FF0505]">$$$$$$$$$</span> = $$$$$$$$$
            </span>
          </div>
        </div>
      </div>
    </div>
     )}
    {showKeypad && (
            <KeypadModal
              onGoClick={() =>{
                 setShowKeypad(true);
                 setShowConfirm(true);
              }}
              onClose={() => setShowKeypad(false)}
            />
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
