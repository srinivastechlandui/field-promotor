import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import car from "../Assets/car.jpg";
import hook from "../Assets/hook.png";
import KeypadModal from "./KeypadModal";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
import BankDetailsModal from "./BankDetailsModel";
import AccessModal from "./AccessModal"
import BASE_URL from "../utils/Urls";
import PasswordManagementModal from "./PasswordManagementModal";

export default function EyeIconBigPopup({user, onClose }) {
  // console.log("usersticket",user)
  const [showKeypad, setShowKeypad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMain, setShowMain] = useState(true);
  const [bankDetails, setBankDetails] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  // const [showPasswordModal, setShowPasswordModal] = useState(false);
  // Accept editedAccountsCount and editedAccountsBankedEarnings from props
  const [stats, setStats] = useState({
    unfilled: 0,
    unverified: 0,
    training: 0,
    active: 0,
    inactive: 0,
    deactivate: 0,
    total: 0,
  });

  // Props for edited accounts
  // Accept todayTotals from props for today's banked earnings accounts
  const editedBankedEarningsCount = user?.todayBankedEarningsCount ?? 0;
  const editedPaidEarningsCount = user?.todayPaidEarningsCount ?? 0;
  // const editedPaymentDueCount = user?.todayPaymentDueCount ?? 0;
  const [showAccess, setShowAccess] = useState(false);

  // const SECONDARY_LOCK = process.env.SECONDARY_LOCK || "2580";

  const [lockLoaded, setLockLoaded] = useState(false);
    // ✅ Fetch lock info from backend (just to confirm backend has it)
    useEffect(() => {
      const fetchLock = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/locks/`);
          if (res.data?.lock) {
            console.log("🔐 Primary lock found:", res.data.lock);
            setLockLoaded(true);
          }
        } catch (err) {
          console.error("❌ Failed to fetch primary lock:", err);
        }
      };
      fetchLock();
    }, []);


  // ✅ Fetch users and compute stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/`);
        const allUsers = res.data?.users || [];

        // Calculate totals before using them in the stats object
        const totalLivePayoutBill = allUsers.reduce((sum, u) => {
          const val = parseFloat(u.livePayoutBills || 0);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        const totalBankEarnings = allUsers.reduce((sum, u) => {
          const val = parseFloat(u.bankedEarnings || 0);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        // const totalPaidEarnings = allUsers.reduce((sum, u) => {
        //   const val = parseFloat(u.paidEarnings || 0);
        //   return sum + (isNaN(val) ? 0 : val);
        // }, 0);

        const totalPaymentDue = allUsers.reduce((sum, u) => {
          const val = parseFloat(u.paymentDue || 0);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);

        // Fetch total tickets and user count from backend
        let totalTickets = 0;
        let totalTicketUsers = 0;
        try {
          const ticketRes = await axios.get(`${BASE_URL}/tickets/count/all`);
          totalTickets = ticketRes.data.total_tickets || 0;
          totalTicketUsers = ticketRes.data.total_users || 0;
        } catch (err) {
          console.error("❌ Failed to fetch total tickets count", err);
        }

        const counts = {
          unfilled: allUsers.filter(
            (u) => u.status_code === 0 && u.status === "unfilled"
          ).length,

          unverified: allUsers.filter(
            (u) => (u.status_code === 1 || u.status_code === 2 ||  u.status_code === 3 ||  u.status_code === 4) && u.status === "unfilled"
          ).length,

          training: allUsers.filter(
            (u) =>
              u.status === "unfilled" &&
              u.status_code === 5 &&
              u.rejected.length === 0 &&
              Array.isArray(u.approved) &&
              u.approved.length === 4
             && u.token === null
          ).length,

          deactivate: allUsers.filter((u) => u.status_code === -1).length,

          active: allUsers.filter((u) => (u.status === "active" || u.status === "ACTIVE") && u.status_code === 6 && u.login_image !== null ).length,

          inactive: allUsers.filter((u) => u.status_code === 6 && (u.status === "active" || u.status === "ACTIVE")  && u.login_image === null).length,

          total: allUsers.length,
          totalBankEarnings: totalBankEarnings,
          totalLivePayoutBill: totalLivePayoutBill,
          totalPaymentDue: totalPaymentDue,
          totalDue: totalLivePayoutBill + totalPaymentDue,

          bankedTotal: allUsers.reduce((sum, u) => {
            const val = parseFloat(u.bankedEarnings || 0);
            return sum + (isNaN(val) ? 0 : val);
          }, 0),
          paidEarnings: allUsers.reduce((sum, u) => {
            const val = parseFloat(u.paidEarnings || 0);
            return sum + (isNaN(val) ? 0 : val);
          }, 0),
          totalTickets: totalTickets,
          totalTicketUsers: totalTicketUsers,
        };

        setStats(counts);
      } catch (err) {
        console.error("❌ Failed to fetch user stats", err);
      }
    };

    fetchStats();
  }, []);

  // ✅ Fetch bank details on mount
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/bank-details`);
        setBankDetails(res.data.result || []);
      } catch (err) {
        console.error("❌ Failed to fetch bank details", err);
      }
    };
    fetchBankDetails();
  }, []);
  const handleCloseAll = () => {
    setShowMain(false);
    setShowKeypad(false);
    setShowConfirm(false);
    onClose?.();
  };


  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setShowPasswordModal(true);
    }, 2000); // 2 seconds hold
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer);
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
                      <span className="text-lg font-bold text-orange-500">[{stats.unfilled}]</span>
                    </div>
                    <div className="flex items-center gap-4 w-20">
                      <span className="text-lg font-bold text-[#A80C0F] min-w-[120px]">UNVERIFIED</span>
                      <span className="text-lg font-bold text-[#A80C0F]">[{stats.unverified}]</span>
                    </div>
                    <div className="flex items-center gap-4 w-20">
                      <span className="text-lg font-bold text-[#B100AE] min-w-[120px]">TRAINING</span>
                      <span className="text-lg font-bold text-[#B100AE]">[{stats.training}]</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mr-8 z-10">
                    <div className="flex items-center w-20">
                      <span className="text-lg font-bold text-[#6EDC54] min-w-[100px]">Active</span>
                      <span className="text-lg font-bold text-[#6EDC54]">[{stats.active}]</span>
                    </div>
                    <div className="flex items-center w-20">
                      <span className="text-lg font-bold text-[#F10000] min-w-[100px]">Inactive</span>
                      <span className="text-lg font-bold text-[#F10000]">[{stats.inactive}]</span>
                    </div>
                    <div className="flex items-center w-20">
                      <span className="text-lg font-bold text-[#A80C0F] min-w-[100px]">Deactivate</span>
                      <span className="text-lg font-bold text-[#A80C0F]">[{stats.deactivate}]</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center min-w-[100px]">
                    Total : [{stats.total}]
                  </div>
                </div>

                <div className="flex flex-col z-10 min-w-[100px]">
                  <div className="mb-1">
                    <span className="text-lg font-bold text-purple-700">${stats.bankedTotal}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-700">
                      NO.OF Edited Accounts [{editedBankedEarningsCount}]
                    </span>
                  </div>
                </div>

                {/* Boxes */}
                <div className="flex items-center justify-center">
                  <div className="w-[121px] h-[114px] border-2 border-green-500 text-green-500 rounded-md flex items-center justify-center z-10">
                    <span className="font-bold text-sm">$${stats.paidEarnings}</span>
                  </div>
                </div>
                <div className="px-3 py-1 border-2 border-brown-700 text-brown-700 rounded-md text-center mx-1 z-10">
                  <span className="text-xs block">...</span>
                  <span className="font-bold text-sm block text-[#A80C0F]">${stats.totalLivePayoutBill}</span>
                  <span className="text-xs block text-[#A80C0F]">NO.OF Edited Accounts [{editedPaidEarningsCount}]</span>
                  {/* <span className="text-xs block">NO.OF Edited payment due Accounts [{editedPaymentDueCount}]</span> */}
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
                        {/* <span className="text-lg text-white font-bold">50K</span> */}
                        {/* <span className="text-lg text-[#B100AE] font-bold">000</span> */}
                      </div>
                      {/* <div className="text-lg font-bold text-orange-500">[#]</div> */}
                      {/* <div className="text-lg font-bold text-[#A80C0F]">[#]</div> */}
                      <div className="border-2 border-red-500 bg-white bg-opacity-90 p-2 rounded text-black text-center font-bold">
                        <span className="block">#</span>
                        <span className="text-red-500 block">$${stats.totalPaymentDue}</span>
                        <span className="text-xs block">NO.OF Edited payment due Accounts [{editedBankedEarningsCount}]</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ticket count */}
                <div>{" "}{stats.totalTickets !== undefined ? stats.totalTickets : "Loading..."}{" "}</div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-center -mt-8 relative">
              {/* Exit Button */}
              <div className="relative z-10 w-[140px] h-[50px] bg-[#333] border-4 border-red-500 rounded-l-2xl border-r-0 ml-5">
                <button className="w-full h-full bg-red-500 text-white font-bold text-lg flex justify-center items-center rounded-l-2xl shadow-inner">
                  <span>EXIT</span>
                  <span className="ml-2 text-xl"
                    onClick={() => setShowKeypad(true)}>
                    X
                  </span>
                </button>
              </div>
              {/* <div className="border-4 border-red-500 rounded-2xl bg-white px-5 h-[40px] flex items-center justify-center -translate-x-[20px] translate-y-3">
            <span className="font-bold text-red-500 mr-2">Company Account Number</span>
            <span className="font-bold whitespace-nowrap">
              <span className="text-[#A80C0F]">12345678912</span> + <span className="text-[#FF0505]">Bank name</span>
            </span>
          </div> */}
              <div
                onClick={() => setSelectedBank(bankDetails[0])} // Open first (or latest) bank detail
                className="cursor-pointer border-4 border-red-500 rounded-2xl bg-white ml-3 px-5 h-[40px] flex items-center justify-center -translate-x-[20px] translate-y-3"
              >
                <span className="font-bold text-red-500 mr-2">
                  Company Account Number -
                </span>
                {bankDetails.length > 0 ? (
                  <span className="font-bold whitespace-nowrap">
                    <span className="text-[#A80C0F]">
                      {bankDetails[0].company_account_no},
                    </span>{" "}
                    {" "}
                    <span className="text-[#FF0505]">
                      {bankDetails[0].company_bank_name}
                    </span>{" "} and {" "}
                    <span className="text-blue-500">
                      IFSC: {bankDetails[0].ifsc_code}
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-500">No Bank Details</span>
                )}
              </div>
              <div
                onClick={() => setShowAccess(true)}
                className="cursor-pointer border-4 border-green-500 rounded-2xl bg-white px-5 h-[40px] flex items-center justify-center -translate-x-[10px] translate-y-3"
              >
                <span className="font-bold text-green-600">Access</span>
              </div>

               <div
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="cursor-pointer border-4 border-green-500 rounded-2xl bg-white px-5 h-[40px] flex items-center justify-center -translate-x-[10px] translate-y-3 mt-1 opacity-10 hover:opacity-50"
                >
                  <img src={hook} alt="hook" className="w-10 h-8" />
                </div>


              {/* Due Section */}
              <div className="border-4 border-red-500 rounded-2xl bg-white px-5 h-[40px] flex items-center justify-center -translate-x-[20px] translate-y-3">
                <span className="font-bold text-red-500 mr-2">DUE</span>
                <span className="font-bold whitespace-nowrap">
                  <span className="text-[#A80C0F]">{stats.totalLivePayoutBill}.00</span> + <span className="text-[#FF0505]">{stats.totalPaymentDue}.00</span> = {stats.totalDue}.00
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAccess && <AccessModal onClose={() => setShowAccess(false)} />}
      {showPasswordModal && (
        <PasswordManagementModal onClose={() => setShowPasswordModal(false)} />
      )}

      {selectedBank && (
        <BankDetailsModal
          bank={selectedBank}
          onClose={() => setSelectedBank(null)}
          onUpdated={(updated) => {
            setBankDetails((prev) =>
              prev.map((b) => (b.id === updated.id ? updated : b))
            );
            setSelectedBank(null);
          }}
        />
      )}
      {showKeypad && (
        <KeypadModal
          // lockCode={SECONDARY_LOCK}
          type="primary"
          onGoClick={() => {
            setShowConfirm(true);
            setShowKeypad(false);
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
