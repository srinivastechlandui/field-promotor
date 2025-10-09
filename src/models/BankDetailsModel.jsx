import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/Urls";
import KeypadModal from "./KeypadModal";  

export default function BankDetailsModal({ bank, onClose, onUpdated }) {
  // const BASE_URL ="http://localhost:8080/api/v1"
  const [accountNo, setAccountNo] = useState(bank.company_account_no || "");
  const [bankName, setBankName] = useState(bank.company_bank_name || "");
  const [ifscCode, setIfscCode] = useState(bank.ifsc_code || ""); // ✅ Add state for ifsc_code
  const [loading, setLoading] = useState(false);

  const [showKeypad, setShowKeypad] = useState(false);  
  const SECONDARY_LOCK = process.env.SECONDARY_LOCK || "2580";  

  // Validations
  const validateInputs = () => {
    if (!accountNo.trim()) {
      alert("⚠️ Company Account Number is required");
      return false;
    }
    if (!/^[0-9]{11}$/.test(accountNo)) {
      alert("⚠️ Account Number must be 11 digits (numbers only, no spaces/special characters)");
      return false;
    }
    if (!bankName.trim()) {
      alert("⚠️ Company Bank Name is required");
      return false;
    }
    if (bankName.length < 4) {
      alert("⚠️ Bank Name must be at least 4 characters long");
      return false;
    }
    // ✅ Add validation for IFSC code
    if (!ifscCode.trim()) {
      alert("⚠️ IFSC Code is required");
      return false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      alert("⚠️ Invalid IFSC code format. It should be 11 characters (e.g., ABCD0123456)");
      return false;
    }
    return true;
  };

  const handleUpdate = () => {
    if (!validateInputs()) return;
    setShowKeypad(true);  
  };

  const doUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`${BASE_URL}/admin/bank-details/${bank.id}`, {
        company_account_no: accountNo,
        company_bank_name: bankName,
        ifsc_code: ifscCode, // ✅ Include ifsc_code in the request body
      });

      alert(res.data.message || "✅ Updated successfully");
      onUpdated(res.data.result);

      // ✅ Refresh the page after update
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to update bank details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <h2 className="text-lg font-bold mb-4 text-center text-red-500">
            Edit Bank Details
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Company Account Number
            </label>
            <input
              type="text"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value.replace(/\s/g, ""))}
              className="w-full border rounded px-3 py-2"
              maxLength={11}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Company Bank Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          {/* ✅ Add new input field for IFSC Code */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              className="w-full border rounded px-3 py-2"
              maxLength={11}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Keypad modal integration */}
      {showKeypad && (
        <KeypadModal
          lockCode={SECONDARY_LOCK}
          onGoClick={() => {
            setShowKeypad(false);
            doUpdate();
          }}
          onClose={() => setShowKeypad(false)}
          onWrongPin={() => alert("❌ Wrong PIN")} 
        />
      )}
    </>
  );
}