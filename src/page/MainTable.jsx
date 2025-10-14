import { useState, useEffect } from "react";
import { FaEllipsisV, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
import RaiseTickets from "../models/RaiseTickets";
import ActivatePopup from "../models/ActivatePopup";
import UnFilledPopup from "../models/UnFilledPopup";
import UnVerifiedPopup from "../models/UnverifiedPopup";
import ProcessingPopup from "../models/ProcessingPopup";
import  FilterBar from "./FilterBar";
import KeypadModal from '../models/KeypadModal';
import EyeIconBigPopup from '../models/EyeIconBigPopup';
import BASE_URL from "../utils/Urls"

// const BASE_URL = "http://localhost:8080/api/v1"
const MainTable = ({ searchText, filterOption, userIdFilters = {}, onTodayTotals }) => {
  const [showEyeIconBigPopup, setShowEyeIconBigPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivatePopupOpen, setIsActivatePopupOpen] = useState(false);
  const [isUnFilledPopupOpen, setIsUnFilledPopupOpen] = useState(false);
  const [isUnVerifiedPopupOpen, setIsUnVerifiedPopupOpen] = useState(false);
  const [isProcessingPopupOpen, setIsProcessingPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ticketCounts, setTicketCounts] = useState({});
  const [openGroup, setOpenGroup] = useState(null);
  const [editingNameUserId, setEditingNameUserId] = useState(null);
  const [editingPhoneUserId, setEditingPhoneUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  
  const PRIMARY_LOCK = process.env.PRIMARY_LOCK || "0852";
  // Track accounts whose Payment Due was ended
 const [endedPaymentDueAccounts, setEndedPaymentDueAccounts] = useState(new Set());

 // --- Live Payout state
const [editingLivePayoutUserId, setEditingLivePayoutUserId] = useState(null);
const [livePayoutValues, setLivePayoutValues] = useState({});
const [showLivePayoutLock, setShowLivePayoutLock] = useState(false);

  // --- Payment Due state
  const [editingPaymentDueUserId, setEditingPaymentDueUserId] = useState(null);
  const [paymentDueValues, setPaymentDueValues] = useState({});
  const [showPaymentDueLock, setShowPaymentDueLock] = useState(false);

  // ================== Live Payout handlers ==================
  // open form request
const requestLivePayoutForm = (row) => {
  setEditingLivePayoutUserId(row.user_id);
  setLivePayoutValues((prev) => ({
    ...prev,
    [row.user_id]: String(row.livePayoutBills ?? 0),
  }));
  setShowLivePayoutLock(true); // lock first
};

// after lock success
const unlockLivePayoutForm = (row) => {
  setShowLivePayoutLock(false);
};

// handle input change
const handleLivePayoutChange = (user_id, value) => {
  setLivePayoutValues((prev) => ({
    ...prev,
    [user_id]: value,
  }));
};
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
// save to API
const endLivePayout = async (user_id) => {
  const value = parseFloat(livePayoutValues[user_id]);
    // updated_by: loggedInUser?.username || "Unknown User",
  if (isNaN(value)) {
    alert("Please enter a valid number.");
    return;
  }
  setEditLoading(true);
  try {
    await axios.put(`${BASE_URL}/users/admin/financial-update/${user_id}`, {
      livePayoutBills: value,
        updated_by: loggedInUser?.username || "Unknown User",
    });
    // ✅ reset only this user to 0 after save
    setLivePayoutValues((prev) => ({
      ...prev,
      [user_id]: 0,
    }));
    
    await reloadTableData();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to save Live Payout.");
  } finally {
    setEditLoading(false);
    setEditingLivePayoutUserId(null);
  }
};

  // ================== Payment Due handlers ==================
  const requestPaymentDueForm = (row) => {
    setEditingPaymentDueUserId(row.user_id);
    // setPaymentDueValue(String(row.paymentDue ?? 0));
     setPaymentDueValues((prev) => ({
    ...prev,
    [row.user_id]: String(row.paymentDue ?? 0),
  }));
    setShowPaymentDueLock(true);
  };
  const unlockPaymentDueForm = (row) => {
  setShowPaymentDueLock(false);
};
 
  const handlePaymentDueChange  = (user_id, value) => {
  setPaymentDueValues((prev) => ({
    ...prev,
    [user_id]: value,
  }));
};

  const endPaymentDue = async (user_id) => {
    const value = parseFloat(paymentDueValues[user_id]);
    if (isNaN(value)) {
      alert("Please enter a valid number.");
      return;
    }
    setEditLoading(true);
    try {
     const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
     const updated_by = loggedInUser?.name || "Unknown";
     console.log("updated_by:", updated_by);

    await axios.put(`${BASE_URL}/users/admin/financial-update/${user_id}`, {
      paymentDue: value,
      updated_by: loggedInUser?.username || "Unknown User",
    });
    setPaymentDueValues((prev) => ({
      ...prev,
      [user_id]: 0,
    }));
    setEndedPaymentDueAccounts((prev) => {
      const updated = new Set(prev);
      updated.add(user_id);
      return updated;
    });
    await reloadTableData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save Payment Due.");
    } finally {
      setEditLoading(false);
      setEditingPaymentDueUserId(null);
      // closePaymentDueForm();
    }
  };

  // Edit name handlers
  const handleEditNameClick = (row) => {
    setEditingNameUserId(row.user_id);
    setEditName(row.employer_name);
  };
  const handleEditNameChange = (e) => setEditName(e.target.value);
  const handleEditNameSave = async (user_id) => {
    if (!editName.trim()) {
      alert('Please enter a name.');
      return;
    }
    setEditLoading(true);
    try {
      const res = await axios.put(`${BASE_URL}/users/admin/update/${user_id}`, { employer_name: editName });
      alert(res.data.message || 'Name updated');
      setEditingNameUserId(null);
      setEditName("");
      reloadTableData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update name');
    } finally {
      setEditLoading(false);
    }
  };
  const handleEditNameCancel = () => {
    setEditingNameUserId(null);
    setEditName("");
  };

  // Edit phone handlers
  const handleEditPhoneClick = (row) => {
    setEditingPhoneUserId(row.user_id);
    setEditPhone(row.phone_number);
  };
  const handleEditPhoneChange = (e) => setEditPhone(e.target.value);
  const handleEditPhoneSave = async (user_id) => {
    if (!editPhone.trim()) {
      alert('Please enter a phone number.');
      return;
    }
    setEditLoading(true);
    try {
      const res = await axios.put(`${BASE_URL}/users/admin/update/${user_id}`, { phone_number: editPhone });
      alert(res.data.message || 'Phone updated');
      setEditingPhoneUserId(null);
      setEditPhone("");
      reloadTableData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update phone');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditPhoneCancel = () => {
    setEditingPhoneUserId(null);
    setEditPhone("");
  };
  const [tableData, setTableData] = useState([]);
    
  // --- NEW: UI filter states
  const [selectedOption, setSelectedOption] = useState(filterOption || "All"); // group filter from FilterBar
  const [userIdFiltersState, setUserIdFilters] = useState(userIdFilters || {}); // advanced filters from UserIdPopup


  useEffect(() => {
    // if parent passes updated filterOption prop, keep local selectedOption in sync
    if (filterOption) setSelectedOption(filterOption);
  }, [filterOption]);
 const fetchTicketCount = async (user_id) => {
  try {
    const res = await axios.get(`${BASE_URL}/tickets/${user_id}`);
    setTicketCounts((prev) => ({
      ...prev,
      [user_id]: res.data.data.length || 0,
    }));
  } catch (err) {
    console.error(`Error fetching tickets for ${user_id}:`, err);
    setTicketCounts((prev) => ({
      ...prev,
      [user_id]: 0,
    }));
  }
};

  const reloadTableData = () => {
    axios
      .get(`${BASE_URL}/users/`)
      .then((res) => {
        if (res.data && res.data.users) {
          const formattedUsers = res.data.users.map((user) => ({
            profile_img: user.profile_img || "https://avatar.iran.liara.run/public/1",
            login_image: user.login_image ,
            user_id: user.user_id,
            email: user.email || "",
            phone_number: user.phone_number,
            status: formatStatus(user.status, user),
            status_code: user.status_code,
            employer_name: user.employer_name,
            joinedDate: user.created_at,
            updated_at: user.updated_at,
            onboarding_fee: user.onboarding_fee,
            livePayoutBills:user.livePayoutBills|| 0,
            liveAmountIsEditedBy:user.liveAmountIsEditedBy || "-",
            paymentDueIsEditedBy:user.paymentDueIsEditedBy || "-",
            paymentDue: user.paymentDue || 0,
            paidEarnings: user.paidEarnings|| 0,
            bankedEarnings: user.bankedEarnings|| 0,
            superBonus: "$0",
            accountsCreated: 0,
            unrootedAccounts: 0,
            tickets: 0,
            group: user.group || "Group",
            purpose: user.purpose || "Part-Time",
            aadhar_no: user.aadhar_no || "",
            aadhar_front_img: user.aadhar_front_img || "",
            aadhar_back_img: user.aadhar_back_img || "",
            pan_card_number: user.pan_card_number || "",
            pan_front_img: user.pan_front_img || "",
            ifsc_code: user.ifsc_code || "",
            bank_account_no: user.bank_account_no || "",
            nominee_name: user.nominee_name || "",
            nominee_phone_no: user.nominee_phone_no || "",
            transaction_id: user.transaction_id || "",
            transaction_img: user.transaction_img || "",
            approved: user.approved,
            rejected: user.rejected,
            coupon_code:user.coupon_code,
            valid_date:formatDate(user.valid_date),
            expired_date:formatDate(user.expired_date),
            redeemed: user.redeem,
            deactivate_reason: user.deactivate_reason
          }));
          setTableData(formattedUsers);
          res.data.users.forEach((u) => fetchTicketCount(u.user_id));
          console.log("Formatted Users:", formattedUsers);
        }
      })
      .catch((err) => console.error("API Error:", err));
  };

  // Initial load and reload on demand
  useEffect(() => {
    reloadTableData();
  }, []);

  // ✅ Format date function
   const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatStatus = (status, user) => {
    if (!status) return "N/A";

    switch (status.toLowerCase()) {
      case "active":
        return "ACTIVE";
      case "unfilled":
        return "UNFILLED";
      case (user.status_code === 5 && user.approved.includes(1) && user.approved.includes(2) && user.approved.includes(3) && user.approved.includes(4)):
        return "TRAINING";
      default:
        return status;
    }
  };


  
  const rowBorderColors = ["#3B82F6", "#10B981", "#8B5CF6", "#F97316", "#EC4899", "#6366F1"];

  const getRowBorderStyle = (index) => {
    const color = rowBorderColors[index % rowBorderColors.length];
    return {
      borderTop: `2px solid ${color}`,
      borderBottom: `2px solid ${color}`
    };
  };

  const handleProfileClick = (user) => {

    if (user.status_code === 0 || user.status_code === 1) {
      setSelectedUser(user);
      console.log("setIsUnFilledPopupOpen-----", user, user.status, user.status_code)
      setIsUnFilledPopupOpen(true); // ✅ Open UnFilledPopup
    }

    else if ((user.status_code === 1 || user.status_code === 2 || user.status_code === 3 || user.status_code === 4 || user.status_code === 5) &&
      (user.status === "UNFILLED")) {
      if (user.status_code === 5 && user.rejected.length === 0 && Array.isArray(user.approved) && user.approved.length === 4) {
        setSelectedUser(user);
        setIsProcessingPopupOpen(true);
      } else {
        setSelectedUser(user);
        setIsUnVerifiedPopupOpen(true);
      }
    }
    else if (user.status === "ACTIVE" && (user.status_code === 4 || user.status_code === 5 || user.status_code === 6) && user.approved.includes(6)) {
      setSelectedUser(user);
      console.log("setIsActivatePopupOpen--", user, user.status, user.status_code)
      setIsActivatePopupOpen(true); // ✅ Open ActivatePopup
    }
    else if (user.status === "DEACTIVATED" && (user.status_code === -1) && user.approved.includes(6)) {
      setSelectedUser(user);
      console.log("setIsActivatePopupOpen--", user, user.status, user.status_code)
      setIsActivatePopupOpen(true); // ✅ Open ActivatePopup
    }

  };


  // ✅ GroupBy helper
  const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = item[key] || "Unknown";
      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(item);
      return result;
    }, {});
  };

  // -----------------------------
  // Filtering logic (search remains untouched)
  // -----------------------------
  let filteredData = tableData;

  // keep the existing search behavior exactly as before
  if (searchText !== undefined && searchText.trim() !== "") {
    const search = searchText.trim().toLowerCase();
    filteredData = filteredData.filter((row) => (
      row.user_id?.toString().toLowerCase().includes(search) ||
      row.employer_name?.toLowerCase().includes(search) ||
      row.group?.toLowerCase().includes(search) ||
      row.email?.toLowerCase().includes(search) ||
      row.status?.toLowerCase().includes(search) ||
      row.phone_number.includes(search)
    ));
  }

  // Group filter: prefer external prop `filterOption` if provided, otherwise the UI-selected `selectedOption`
  const activeGroupFilter = filterOption || selectedOption;
  if (activeGroupFilter && activeGroupFilter !== "All") {
    filteredData = filteredData.filter((row) => row.group === activeGroupFilter);
  }

  const filters = userIdFiltersState || {};

  // helper to parse money strings like "$1,234" => 1234
  const parseAmount = (val) => {
    if (!val && val !== 0) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const n = Number(val.replace(/[^0-9.-]+/g, ""));
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };

  // status filter
  if (filters.statuses && Array.isArray(filters.statuses) && filters.statuses.length > 0) {
    filteredData = filteredData.filter(row => filters.statuses.includes(row.status));
  }

  // numeric/boolean filters
  if (filters.bankEarned) {
    filteredData = filteredData.filter(row => parseAmount(row.bankedEarnings) > 0);
  }
  if (filters.paidEarnings) {
    filteredData = filteredData.filter(row => parseAmount(row.paidEarnings) > 0);
  }
  if (filters.pendingPayput) {
    filteredData = filteredData.filter(row => parseAmount(row.paymentDue) > 0);
  }
  if (filters.accountsCreated) {
    filteredData = filteredData.filter(row => (row.accountsCreated || 0) > 0);
  }
  if (filters.unRotedAccount) {
    filteredData = filteredData.filter(row => (row.unrootedAccounts || 0) > 0);
  }
  if (filters.tickets) {
    filteredData = filteredData.filter(row => (ticketCounts[row.user_id] || 0) > 0);
  }

  // Sorting: joined date
  if (filters.joinedSort === "new") {
    filteredData = filteredData.slice().sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
  } else if (filters.joinedSort === "old") {
    filteredData = filteredData.slice().sort((a, b) => new Date(a.joinedDate) - new Date(b.joinedDate));
  }

  // Sorting: tickets (use ticketCounts)
  if (filters.ticketSort === "high") {
    filteredData = filteredData.slice().sort((a, b) => (ticketCounts[b.user_id] || 0) - (ticketCounts[a.user_id] || 0));
  } else if (filters.ticketSort === "low") {
    filteredData = filteredData.slice().sort((a, b) => (ticketCounts[a.user_id] || 0) - (ticketCounts[b.user_id] || 0));
  }

  // --- Added: Sorting for Banked Earnings, Paid Earnings, Payment Due ---
  if (filters.bankedEarningsSort === "high") {
    filteredData = filteredData.slice().sort((a, b) => parseAmount(b.bankedEarnings) - parseAmount(a.bankedEarnings));
  } else if (filters.bankedEarningsSort === "low") {
    filteredData = filteredData.slice().sort((a, b) => parseAmount(a.bankedEarnings) - parseAmount(b.bankedEarnings));
  }
  if (filters.paidEarningsSort === "high") {
    filteredData = filteredData.slice().sort((a, b) => parseAmount(b.paidEarnings) - parseAmount(a.paidEarnings));
  } else if (filters.paidEarningsSort === "low") {
    filteredData = filteredData.slice().sort((a, b) => parseAmount(a.paidEarnings) - parseAmount(b.paidEarnings));
  }
  if (filters.paymentDueSort === "high") {
    filteredData = filteredData.slice().sort((a, b) => parseAmount(b.paymentDue) - parseAmount(a.paymentDue));
  } else if (filters.paymentDueSort === "low") {
    filteredData = filteredData.slice().sort((a, b) => parseAmount(a.paymentDue) - parseAmount(b.paymentDue));
  }

  const toggleGroup = (groupName) => {
    setOpenGroup((prev) => (prev === groupName ? null : groupName));
  };




  // Helper to sum a column
const sumBy = (rows, key) =>
  rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
// Helper: check if a date is today
const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
const todayGroupTotals = Object.entries(groupBy(tableData, "group")).reduce(
  (acc, [groupName, users]) => {
    acc[groupName] = {
      paymentDue: users.filter(u => u.paymentDue > 0 && isToday(u.updated_at)).length,
      bankedEarnings: users.filter(u => u.bankedEarnings > 0 && isToday(u.updated_at)).length,
      paidEarnings: users.filter(u => u.paidEarnings > 0 && isToday(u.updated_at)).length,
    };
    return acc;
  },
  {}
);



  // Today edited count
  const todayTotals = {
    paymentDue: tableData.filter(u => u.paymentDue > 0 && isToday(u.updated_at)).length,
    bankedEarnings: tableData.filter(u => u.bankedEarnings > 0 && isToday(u.updated_at)).length,
    paidEarnings: tableData.filter(u => u.paidEarnings > 0 && isToday(u.updated_at)).length,
  };
  // Notify parent (Header) of todayTotals
  useEffect(() => {
    if (typeof onTodayTotals === 'function') {
      onTodayTotals(todayTotals);
    }
  }, [todayTotals, onTodayTotals]);
  // const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  // console.log("loggedInuser",loggedInUser);
  return (
    <>
       <FilterBar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        setUserIdFilters={setUserIdFilters}
      />
      {Object.entries(groupBy(filteredData, "group")).map(([groupName, users]) => (
        <div key={groupName} className="mt-2 mb-6 border border-gray-300 rounded-lg shadow">
          <div
            className="flex justify-between items-center bg-gray-200 px-4 py-2 cursor-pointer"
            onClick={() => toggleGroup(groupName)}
          >
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-gray-800">
                {groupName.toUpperCase()} Group
              </h2>
            </div>
            <span className="text-gray-600">
              <span className="mr-3 inline-flex items-center justify-center  w-7 h-7 rounded-full bg-gray-500 text-white font-bold text-base">
                {users.length}
              </span>
              {openGroup === groupName ? "▲" : "▼"}
            </span>
          </div>

          {openGroup === groupName && (
            <>
              <div className="overflow-x-auto bg-white rounded-lg shadow mt-3">
                <table className="min-w-full">
                  <thead className="bg-gray-300 border-2 border-gray-950 rounded-lg">
                    <tr>
                      <th className="px-6 py-3 text-left text-base font-extrabold text-gray-950 uppercase tracking-wider">
                        View Profile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-extrabold text-gray-950 uppercase tracking-wider">
                        User ID & Status
                      </th>
                      <th className="px-6 py-3 text-left text-2xl font-extrabold text-gray-950 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-extrabold text-gray-950 uppercase tracking-wider">
                        Phone Number & Joined Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-extrabold text-gray-950 uppercase tracking-wider">
                        Banked Earnings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-extrabold text-[#29A80C] uppercase tracking-wider">
                        Paid Earnings
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-extrabold text-gray-950 uppercase tracking-wider">
                        Live Payout Bills
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-extrabold text-gray-950 uppercase tracking-wider">
                        Super Bonus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-extrabold text-[#29A80C] uppercase tracking-wider">
                        No. of Accounts Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-extrabold text-red-300 uppercase tracking-wider">
                        No. of Unrooted Accounts
                      </th>
                      <th className="px-6 py-3 text-left text-base font-extrabold text-red-500 uppercase tracking-wider">
                        Payment Due
                      </th>
                      <th className="px-6 py-3 text-left text-base font-extrabold text-[#0D0099] uppercase tracking-wider">
                        Tickets
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((row, index) => (
                        <tr
                          key={row.user_id}
                          style={getRowBorderStyle(index)}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              className="h-[54px] w-[54px] rounded-full object-cover border-2 border-gray-200"
                              src={row.profile_img}
                              alt={`${row.employer_name}'s profile`}
                              onClick={() => handleProfileClick(row)}
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              {row.purpose}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {row.user_id}
                            </div>
                            <div
                              className={`text-sm ${row.status === "ACTIVE"
                                ? "text-green-500"
                                : row.status_code === 0
                                  ? "text-[#E19034]"
                                  : row.status_code === 1
                                    ? "text-red-600"
                                    : (row.status_code === 5 && row.status === "UNFILLED" && row.approved.length === 4)
                                      ? "text-[#B100AE]"
                                      : row.status === "REJECTED"
                                        ? "text-red-600"
                                        : "text-gray-500"
                                }`}
                            >
                              {(row.status_code === 5 && row.status === "UNFILLED" && row.approved.length === 4
                              ) ? "TRAINING" : (row.login_image === null && row.status === "ACTIVE"  ? "UNACTIVE" : row.status)}
                              {/*  */}
                            </div>
                          </td>
                         <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              <div className="text-3xl flex items-center justify-between">
                                <button
                                  className="ml-4 text-gray-500 hover:text-blue-600 focus:outline-none"
                                  onClick={() => handleEditNameClick(row)}
                                  title="Edit Employee Name"
                                  disabled={editingNameUserId !== null && editingNameUserId !== row.user_id}
                                >
                                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <defs>
                                      <linearGradient id="uniformGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#D9D9D9" />
                                        <stop offset="100%" stopColor="#4203EF" />
                                      </linearGradient>
                                    </defs>
                                    <circle cx="5" cy="12" r="3" fill="url(#uniformGradient)" />
                                    <circle cx="12" cy="12" r="3" fill="url(#uniformGradient)" />
                                    <circle cx="19" cy="12" r="3" fill="url(#uniformGradient)" />
                                  </svg>
                                </button>
                              </div>

                              {editingNameUserId === row.user_id ? (
                                <div className="absolute z-50 bg-white border border-gray-300 rounded shadow-md p-2 mt-2 w-56">
                                  <label className="block text-xs text-gray-700 mb-1">Employee Name</label>
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={handleEditNameChange}
                                    className="w-full border rounded px-2 py-1 mb-2 text-sm"
                                    disabled={editLoading}
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      className="px-2 py-1 bg-green-500 text-white rounded flex items-center text-xs"
                                      onClick={() => handleEditNameSave(row.user_id)}
                                      disabled={editLoading}
                                    >
                                      <FaSave className="mr-1" /> Save
                                    </button>
                                    <button
                                      className="px-2 py-1 bg-gray-400 text-white rounded flex items-center text-xs"
                                      onClick={handleEditNameCancel}
                                      disabled={editLoading}
                                    >
                                      <FaTimes className="mr-1" /> Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-900 text-center">
                                  {row.employer_name || "---"}
                                </div>
                              )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap  ">
                            <div className="text-3xl flex items-start justify-between mt-6">
                              
                              <button
                                className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                onClick={() => handleEditPhoneClick(row)}
                                title="Edit Phone Number"
                                disabled={editingPhoneUserId !== null && editingPhoneUserId !== row.user_id}
                              >
                               <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <defs>
                                  <linearGradient id="uniformGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#D9D9D9" />
                                    <stop offset="100%" stopColor="#4203EF" />
                                  </linearGradient>
                                </defs>
                                <circle cx="5" cy="12" r="3" fill="url(#uniformGradient)" />
                                <circle cx="12" cy="12" r="3" fill="url(#uniformGradient)" />
                                <circle cx="19" cy="12" r="3" fill="url(#uniformGradient)" />
                              </svg>
                              </button>
                            </div>
                            {editingPhoneUserId === row.user_id ? (
                              <div className="absolute z-50 bg-white border border-gray-300 rounded shadow-md p-2 mt-2 w-56">
                                <label className="block text-xs text-gray-700 mb-1">Phone Number</label>
                                <input
                                  type="text"
                                  value={editPhone}
                                  onChange={handleEditPhoneChange}
                                  className="w-full border rounded px-2 py-1 mb-2 text-sm"
                                  disabled={editLoading}
                                  maxLength={10}
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    className="px-2 py-1 bg-green-500 text-white rounded flex items-center text-xs"
                                    onClick={() => handleEditPhoneSave(row.user_id)}
                                    disabled={editLoading}
                                  >
                                    <FaSave className="mr-1" /> Save
                                  </button>
                                  <button
                                    className="px-2 py-1 bg-gray-400 text-white rounded flex items-center text-xs"
                                    onClick={handleEditPhoneCancel}
                                    disabled={editLoading}
                                  >
                                    <FaTimes className="mr-1" /> Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-900">{row.phone_number}</div>
                            )}
                            <div className="text-sm text-[#3021D7]">{formatDate(row.joinedDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-3xl flex items-center mt-10">
                              {/* <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <defs>
                                  <linearGradient id="dotsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#D9D9D9" />
                                    <stop offset="100%" stopColor="#FF0707" />
                                  </linearGradient>
                                </defs>
                                <circle cx="5" cy="12" r="3" fill="url(#dotsGradient)" />
                                <circle cx="12" cy="12" r="3" fill="url(#dotsGradient)" />
                                <circle cx="19" cy="12" r="3" fill="url(#dotsGradient)" />
                              </svg> */}
                            </div>
                            <div className="text-sm text-[#A60CA8] font-bold">
                              ${row.bankedEarnings}
                            </div>
                            <div className="text-sm text-[#3021D7]">{formatDate(row.updated_at)}</div>
                           <div className="text-sm text-blue-600">(Updated at)</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#29A80C]">
                            ${row.paidEarnings}
                          </td>

                        
                     <td className="px-6 py-4 whitespace-nowrap mt-5">
                  <div className="flex items-start justify-between">
                    <button
                      className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                      onClick={() => requestLivePayoutForm(row)}
                      title="Edit Live Payout"
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <defs>
                          <linearGradient id="dotsGradientLive" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D9D9D9" />
                            <stop offset="100%" stopColor="#FF0707" />
                          </linearGradient>
                        </defs>
                        <circle cx="5" cy="12" r="3" fill="url(#dotsGradientLive)" />
                        <circle cx="12" cy="12" r="3" fill="url(#dotsGradientLive)" />
                        <circle cx="19" cy="12" r="3" fill="url(#dotsGradientLive)" />
                      </svg>
                    </button>
                  </div>

                  {/* Lock first */}
                  {editingLivePayoutUserId === row.user_id && showLivePayoutLock && (
                    <KeypadModal
                      lockCode={PRIMARY_LOCK}
                      onGoClick={() => unlockLivePayoutForm(row)}
                      onClose={() => {
                        setShowLivePayoutLock(false);
                        setEditingLivePayoutUserId(null);
                      }}
                    />
                  )}

                  {/* Actual form after unlock */}
                  {editingLivePayoutUserId === row.user_id && !showLivePayoutLock && (
                    <div className="absolute z-50 bg-white border border-gray-300 rounded shadow-md p-3 mt-2 w-56">
                      <button
                        className="absolute top-2 right-2 text-red-600 text-lg"
                        onClick={() => setEditingLivePayoutUserId(null)}
                      >
                        ✕
                      </button>

                      <label className="block text-xs text-gray-700 mb-1">Live Payout Bills</label>
                      <input
                        type="number"
                        value={livePayoutValues[row.user_id] ?? row.livePayoutBills}
                        onChange={(e) => handleLivePayoutChange(row.user_id, e.target.value)}
                        className="w-full border rounded px-2 py-1 mb-2 text-sm"
                      />

                      <div className="flex gap-2 justify-end">
                         <button
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                          onClick={() => {
                            setEditingLivePayoutUserId(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          onClick={() => endLivePayout(row.user_id)}
                          disabled={editLoading}
                        >
                          End
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Default display */}
                  {editingLivePayoutUserId !== row.user_id && (
                    <>
                    <div
                      className="text-[#A80C0F] text-lg font-bold cursor-pointer"
                      onClick={() => requestLivePayoutForm(row)}
                    >
                      ${livePayoutValues[row.user_id] ? livePayoutValues[row.user_id] : "0"}
                    </div>
                       <div className="text-sm text-[#3021D7]">{formatDate(row.updated_at)}</div>
                       <div className="text-sm text-blue-600">(EDITED BY)</div>
                       <div className="text-sm text-blue-400">{row.liveAmountIsEditedBy || "-"}</div>
                       {/* <td>{user.updated_by || "—"}</td> */}
                    </>
                  )}
                </td>

                          <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#5907FF]">
                            {row.superBonus}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-[#E19034] text-2xl font-bold">
                              {row.accountsCreated}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-[#FF0E12] text-2xl font-bold">
                              {row.unrootedAccounts}
                            </div>
                          </td>

                         

                        <td className="px-6 py-4 whitespace-nowrap mt-5">
                            <div className="flex items-start justify-start">
                              <button
                                className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                onClick={() => requestPaymentDueForm(row)}
                                title="Edit Payment Due"
                              >
                               <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <defs>
                                  <linearGradient id="dotsGradientLive" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#D9D9D9" />
                                    <stop offset="100%" stopColor="#FF0707" />
                                  </linearGradient>
                                </defs>
                                <circle cx="5" cy="12" r="3" fill="url(#dotsGradientLive)" />
                                <circle cx="12" cy="12" r="3" fill="url(#dotsGradientLive)" />
                                <circle cx="19" cy="12" r="3" fill="url(#dotsGradientLive)" />
                              </svg>
                              </button>
                            </div>

                            {/* Lock first */}
                            {editingPaymentDueUserId === row.user_id && showPaymentDueLock && (
                              <KeypadModal
                                  lockCode={PRIMARY_LOCK}
                                   onGoClick={() => unlockPaymentDueForm(row)}
                                  onClose={() => {
                                    setShowPaymentDueLock(false);
                                    setEditingPaymentDueUserId(null);
                                  }}
                                />
                            )}

                            {/* Actual form after unlock */}
                            {editingPaymentDueUserId === row.user_id && !showPaymentDueLock && (
                              <div className="absolute z-50 bg-white border border-gray-300 rounded shadow-md p-3 mt-2 right-10 w-56">
                                  <button
                                    className="absolute top-2 right-2 text-red-600 text-lg"
                                    onClick={() => setEditingPaymentDueUserId(null)}
                                  >
                                    ✕
                                  </button>
                                <label className="block text-xs text-gray-700 mb-1">Payment Due</label>
                                  <input
                                    type="number"
                                    value={paymentDueValues[row.user_id] ?? row.paymentDue}
                                    onChange={(e) => handlePaymentDueChange(row.user_id, e.target.value)}
                                    className="w-full border rounded px-2 py-1 mb-2 text-sm"
                                  />

                                  <div className="flex gap-2 justify-end">
                                    <button
                                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                      onClick={() => {
                                      setEditingPaymentDueUserId(null);
                                    }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                                      onClick={() => endPaymentDue(row.user_id)}
                                      disabled={editLoading}
                                    >
                                      End
                                    </button>
                                  </div>
                              </div>
                            )}

                            {/* Default display */}
                            {editingPaymentDueUserId !== row.user_id && (
                              <>
                              <div
                                className="text-[#FF0707] text-lg font-bold cursor-pointer"
                               onClick={() => requestPaymentDueForm(row)}
                                
                              >
                                {/* {row.paymentDue} */}
                                 ${paymentDueValues[row.user_id] ?? row.paymentDue}
                              </div>
                               <div className="text-sm text-[#3021D7]">{formatDate(row.updated_at)}</div>
                               <div className="text-sm text-blue-600">(EDITED BY)</div>
                               <div className="text-sm text-blue-400">
                                {row.paymentDueIsEditedBy || "-"}
                              </div>
                           </>
                            )}
                          </td>
                          

                          <td
                            className="px-6 py-4 whitespace-nowrap text-center"
                            onClick={() => {
                              setSelectedUser(row); 
                              setIsModalOpen(true); 
                            }}
                          >
                            <div className="text-lg font-extrabold text-[#0D0099]">
                              {ticketCounts[row.user_id] ?? 0}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="13" className="text-center py-4">No matching records found as of Now.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              <div className='mx-2 w-full h-[132px] bg-blue-200 flex flex-col items-center justify-center
                           border-2 border-red-500 mt-4 shadow-lg  rounded-lg'>
                <div className='flex items-center justify-between w-full px-4 text-[#29A80C] font-bold'>
                  {/* <p>NO OF LAST PAID EARNINGS ACCOUNTS</p> */}
                    <p>NO OF LAST PAID EARNINGS ACCOUNTS - {groupName}</p>
                    <span>{todayGroupTotals[groupName]?.paidEarnings || 0} -Accounts</span>
                </div>
                <div className='flex items-center justify-between w-full px-4 text-[#A80C0F] font-bold'>
                   <p>NO OF PENDING PAYMENT DUES ACCOUNTS - {groupName}</p>
                   <span>{todayGroupTotals[groupName]?.paymentDue  || 0} -Accounts</span>
                </div>
                <div className='flex items-center justify-between w-full px-4 text-[#B100AE] font-bold'>
                  <p>NO OF BANKED EARNINGS ACCOUNTS- {groupName}</p>
                  <span>{todayGroupTotals[groupName]?.bankedEarnings || 0} -Accounts</span>
                </div>
              </div>
              </div>
              {/* Ticket popup */}
              {isModalOpen && selectedUser && (
                <RaiseTickets
                  user_id={selectedUser.user_id}
                  onClose={() => setIsModalOpen(false)}
                  reloadTableData={reloadTableData}
                />
              )}
              {isActivatePopupOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <ActivatePopup
                    user={selectedUser}
                    onClose={() => {
                      setIsActivatePopupOpen(false);
                      reloadTableData();
                    }}
                  />
                </div>
              )}
              {isUnFilledPopupOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <UnFilledPopup
                    user={selectedUser}
                    onClose={() => {
                      setIsUnFilledPopupOpen(false);
                      reloadTableData();
                    }}
                  />
                </div>
              )}
              {isUnVerifiedPopupOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <UnVerifiedPopup
                    user={selectedUser}
                    onClose={() => {
                      setIsUnVerifiedPopupOpen(false);
                      reloadTableData();
                    }}
                  />
                </div>
              )}
              {isProcessingPopupOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <ProcessingPopup
                    user={selectedUser}
                    onClose={() => {
                      setIsProcessingPopupOpen(false);
                      reloadTableData();
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}
      <div className='mx-2 w-full h-[132px] bg-blue-200 flex flex-col items-center justify-center
                           border-2 border-red-500 mt-4 shadow-lg rounded-lg'>
        <div className='flex items-center justify-between w-full px-4 text-[#29A80C] font-bold'>
          <p>NO OF LAST PAID EARNINGS ACCOUNTS</p>
        <span>{todayTotals.paidEarnings} -Accounts</span>
        </div>
       
        <div className='flex items-center justify-between w-full px-4 text-[#A80C0F] font-bold'>
          <p>NO OF LAST PAYMENT DUES ACCOUNTS</p>
            <span>{todayTotals.paymentDue} -Accounts</span>
        </div>
        <div className='flex items-center justify-between w-full px-4 text-[#B100AE] font-bold'>
          <p>NO OF BANKED EARNINGS ACCOUNTS</p>
          <span>{todayTotals.bankedEarnings} -Accounts</span>
        </div>
      </div>
    </>
  );
};

export default MainTable;