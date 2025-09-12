/* eslint-disable no-sequences */
/* eslint-disable no-whitespace-before-property */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import KeypadModal from '../models/KeypadModal';
import ConfirmModal from '../models/ConfirmModal';
import EyeIconBigPopup from '../models/EyeIconBigPopup';
export default function BottomEyeIcon({ onClose}){
  const [showKeyPad, setShowKeypad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEyeIconBigPopup , setShowEyeIconBigPopup] = useState(false);
  
  const handleCloseAll = () => {
    setShowKeypad(false);
    setShowConfirm(false);
    onClose?.();
  };
  return (
    <>
    {showEyeIconBigPopup && (
        <EyeIconBigPopup
          onClose={() => setShowEyeIconBigPopup(false)}
        />
      )}
    <div className="relative h-20">
    {!showKeyPad && !showEyeIconBigPopup && (
     <div 
          onClick={() => setShowKeypad(true)}
          className="absolute bottom-0 right-0 w-[100px] h-[110px] border-2 border-[#FF0000] bg-white flex flex-col items-center justify-center rounded-lg cursor-pointer"
        >
          <FaEye className="text-6xl text-[#FF0000]" />
          <p className="text-3xl font-bold text-[#FF0000]">Total</p>
        </div>
    )}
    {showKeyPad && (
      <KeypadModal
       lockCode="2580"  
        onGoClick={() => {
          // setShowKeypad(true);
          setShowConfirm(true);
          // onClose?.(); 
        }}
      />
    )}
    {showConfirm &&(
      <ConfirmModal
        onYes={ () =>{
         setShowKeypad(false);
         setShowConfirm(false);
          setTimeout(() => {
                setShowEyeIconBigPopup(true);
              }, 0);
        }}
        onNo={() => setShowConfirm(false)}
      />
    )}
    </div>
    {showEyeIconBigPopup && (
        <EyeIconBigPopup
          onClose={() => {
            setShowEyeIconBigPopup(false);
            onClose?.();
          }}
        />
      )}
    </>
  );
};

