import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import KeypadModal from "../models/KeypadModal";
import ConfirmModal from "../models/ConfirmModal";
import EyeIconBigPopup from "../models/EyeIconBigPopup";
import BASE_URL from "../utils/Urls";

export default function BottomEyeIcon({
  onClose,
  todayBankedEarningsCount = 0,
  todayPaidEarningsCount = 0,
  todayPaymentDueCount = 0,
}) {
  // const BASE_URL = "http://localhost:8080/api/v1";
  const [showKeyPad, setShowKeypad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEyeIconBigPopup, setShowEyeIconBigPopup] = useState(false);

  // ✅ Fetch lock info once (optional sanity check)
  useEffect(() => {
    const fetchLock = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/locks/`);
        console.log("🔐 Lock fetched:", res.data.lock);
      } catch (err) {
        console.error("❌ Failed to fetch lock:", err);
      }
    };
    fetchLock();
  }, []);

  // Close everything safely
  const handleCloseAll = () => {
    console.log("🔒 Closing all modals");
    setShowKeypad(false);
    setShowConfirm(false);
    setShowEyeIconBigPopup(false);
    onClose?.();
  };

  return (
    <>
      {/* === EyeIconBigPopup === */}
      {showEyeIconBigPopup && (
        <EyeIconBigPopup
          user={{
            todayBankedEarningsCount,
            todayPaidEarningsCount,
            todayPaymentDueCount,
          }}
          onClose={() => {
            console.log("👁️ Closing EyeIconBigPopup");
            setShowEyeIconBigPopup(false);
            onClose?.();
          }}
        />
      )}

      <div className="relative h-20 mt-10">
        {/* === Eye Button === */}
        {!showKeyPad && !showEyeIconBigPopup && !showConfirm && (
          <div
            onClick={() => {
              console.log("👁️ Eye button clicked — showing keypad");
              setShowKeypad(true);
            }}
            className="absolute bottom-0 right-0 w-[100px] h-[110px] border-2 border-[#FF0000] bg-white flex flex-col items-center justify-center rounded-lg cursor-pointer"
          >
            <FaEye className="text-6xl text-[#FF0000]" />
            <p className="text-3xl font-bold text-[#FF0000]">Total</p>
          </div>
        )}

        {/* === KeypadModal === */}
        {showKeyPad && (
          <KeypadModal
            type="primary" // ✅ this makes it call /locks/verify-primary
            onGoClick={() => {
              console.log("✅ primary lock verified — showing confirm modal");
              setShowConfirm(true);
              setShowKeypad(false);
            }}
            onClose={() => {
              console.log("❌ Keypad closed");
              setShowKeypad(false);
            }}
          />
        )}

        {/* === ConfirmModal === */}
        {showConfirm && (
          <ConfirmModal
            onYes={() => {
              console.log("✅ Confirmed — opening EyeIconBigPopup");
              setShowConfirm(false);
              setShowEyeIconBigPopup(true);
            }}
            onNo={() => {
              console.log("❌ Confirmation canceled");
              setShowConfirm(false);
            }}
          />
        )}
      </div>
    </>
  );
}
