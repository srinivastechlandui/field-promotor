import { useState, useEffect } from "react";
import axios from "axios";
import RaiseTickets from "../models/RaiseTickets";
import ActivatePopup from "../models/ActivatePopup";
import UnFilledPopup from "../models/UnFilledPopup";
import UnVerifiedPopup from "../models/UnverifiedPopup";
import ProcessingPopup from "../models/ProcessingPopup";
import BASE_URL from "../utils/Urls"
const MainTable = ({ searchText }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivatePopupOpen, setIsActivatePopupOpen] = useState(false);
  const [isUnFilledPopupOpen, setIsUnFilledPopupOpen] = useState(false);
  const [isUnVerifiedPopupOpen, setIsUnVerifiedPopupOpen] = useState(false);
  const [isProcessingPopupOpen, setIsProcessingPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/users/`)
      .then((res) => {
        if (res.data && res.data.users) {
          const formattedUsers = res.data.users.map((user) => ({
            profile_img: user.profile_img || "https://avatar.iran.liara.run/public/1",
            user_id: user.user_id,
            email: user.email || "",
            phone_number: user.phone_number,
            status: formatStatus(user.status),
            status_code: user.status_code,
            employer_name: user.employer_name,
            joinedDate: formatDate(user.created_at),
            bankedEarnings: "$0",
            paidEarnings: "$0",
            livePayoutBills: "$0",
            superBonus: "$0",
            accountsCreated: 0,
            unrootedAccounts: 0,
            paymentDue: "$0",
            tickets: 1,
            group: user.group || "Group",
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
          }));
          setTableData(formattedUsers);
          // console.log("data",formattedUsers)
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // ✅ Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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


  // ✅ Existing code for row border
  const rowBorderColors = ["#3B82F6", "#10B981", "#8B5CF6", "#F97316", "#EC4899", "#6366F1"];
  const getRowBorderStyle = (index) => {
    const color = rowBorderColors[index % rowBorderColors.length];
    return {
      borderTop: `2px solid ${color}`,
      borderBottom: `2px solid ${color}`
    };
  };
  // console.log("data-----",user.status, user.status_code)
  // ✅ Profile click logic remains same
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

  // ✅ Filtering by search text
  const filteredData = searchText !== undefined
    ? tableData.filter((row) => {
      const search = searchText.trim().toLowerCase();
      return (
        row.user_id?.toString().toLowerCase().includes(search) ||
        row.employer_name?.toLowerCase().includes(search) ||
        row.group?.toLowerCase().includes(search) ||
        row.email?.toLowerCase().includes(search) ||
        row.status?.toLowerCase().includes(search) ||
        row.phone_number.includes(search)
      );
    })
    : tableData;

  const toggleGroup = (groupName) => {
    setOpenGroup((prev) => (prev === groupName ? null : groupName));
  };
  return (
    <>
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
                      {/* <th className="px-6 py-3 text-left text-base font-extrabold text-gray-950 uppercase tracking-wider">
                        Group
                      </th> */}
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
                              ) ? "TRAINING" : row.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            <div className="text-3xl">
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
                            </div>
                            <div className="text-sm text-gray-900">{row.employer_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-3xl">
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
                            </div>
                            <div className="text-sm text-gray-900">{row.phone_number}</div>
                            <div className="text-sm text-[#3021D7]">{row.joinedDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-3xl">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <defs>
                                  <linearGradient id="dotsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#D9D9D9" />
                                    <stop offset="100%" stopColor="#FF0707" />
                                  </linearGradient>
                                </defs>
                                <circle cx="5" cy="12" r="3" fill="url(#dotsGradient)" />
                                <circle cx="12" cy="12" r="3" fill="url(#dotsGradient)" />
                                <circle cx="19" cy="12" r="3" fill="url(#dotsGradient)" />
                              </svg>
                            </div>
                            <div className="text-sm text-[#A60CA8] font-bold">
                              {row.bankedEarnings}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#29A80C]">
                            {row.paidEarnings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            <div className="text-3xl">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <defs>
                                  <linearGradient id="dotsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#D9D9D9" />
                                    <stop offset="100%" stopColor="#FF0707" />
                                  </linearGradient>
                                </defs>
                                <circle cx="5" cy="12" r="3" fill="url(#dotsGradient)" />
                                <circle cx="12" cy="12" r="3" fill="url(#dotsGradient)" />
                                <circle cx="19" cy="12" r="3" fill="url(#dotsGradient)" />
                              </svg>
                            </div>
                            <div className="text-[#A80C0F] text-lg font-bold">
                              {row.livePayoutBills}
                            </div>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="text-3xl">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <defs>
                                  <linearGradient id="dotsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#D9D9D9" />
                                    <stop offset="100%" stopColor="#FF0707" />
                                  </linearGradient>
                                </defs>
                                <circle cx="5" cy="12" r="3" fill="url(#dotsGradient)" />
                                <circle cx="12" cy="12" r="3" fill="url(#dotsGradient)" />
                                <circle cx="19" cy="12" r="3" fill="url(#dotsGradient)" />
                              </svg>
                            </div>
                            <div className="text-[#FF0707] text-lg font-bold">
                              {row.paymentDue}
                            </div>
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-center"
                            onClick={() => {
                              setSelectedUser(row); 
                              setIsModalOpen(true); 
                            }}
                          >
                            <div className="text-lg font-extrabold text-[#0D0099]">
                              {row.tickets}
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-[#E19034] text-1xl font-bold">
                              {row.group ? row.group.charAt(0).toUpperCase() + row.group.slice(1) : ''}
                            </div>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="13" className="text-center py-4">No matching records found as of Now.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className='mx-2 w-full h-[132px] bg-blue-200 flex flex-col items-center justify-center
                           border-2 border-red-500 mt-4 shadow-lg relative rounded-lg'>
                <div className='flex items-center justify-between w-full px-4 text-[#29A80C] font-bold'>
                  <p>NO OF LAST PAID EARNINGS ACCOUNTS</p>
                  <span>$$$$$$$$$$</span>
                </div>
                <div className='flex items-center justify-between w-full px-4 text-[#A80C0F] font-bold'>
                  <p>NO OF PENDING PAYOUT LEFT ACCOUNTS ACCOUNTS</p>
                  <span>$$$$$$$$$$</span>
                </div>
                <div className='flex items-center justify-between w-full px-4 text-[#B100AE] font-bold'>
                  <p>NO OF BANKED EARNINGS ACCOUNTS</p>
                  <span>$$$$$$$$$$</span>
                </div>
              </div>
              {/* Ticket popup */}
              {isModalOpen && selectedUser && (
                <RaiseTickets
                  user_id={selectedUser.user_id}
                  // ticketId={selectedUser.ticketId || 10} // use dynamic ticketId if exists
                  onClose={() => setIsModalOpen(false)}
                />
              )}
              {isActivatePopupOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <ActivatePopup
                    user={selectedUser || 7}
                    onClose={() => setIsActivatePopupOpen(false)}
                  />
                </div>
              )}
              {isUnFilledPopupOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <UnFilledPopup
                    user={selectedUser}
                    onClose={() => setIsUnFilledPopupOpen(false)}
                  />
                </div>
              )}
              {isUnVerifiedPopupOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <UnVerifiedPopup
                    user={selectedUser}
                    onClose={() => setIsUnVerifiedPopupOpen(false)}
                  />
                </div>
              )}
              {isProcessingPopupOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <ProcessingPopup
                    user={selectedUser}
                    onClose={() => setIsProcessingPopupOpen(false)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}
      <div className='mx-2 w-full h-[132px] bg-blue-200 flex flex-col items-center justify-center
                           border-2 border-red-500 mt-4 shadow-lg relative rounded-lg'>
        <div className='flex items-center justify-between w-full px-4 text-[#29A80C] font-bold'>
          <p>NO OF LAST PAID EARNINGS ACCOUNTS</p>
          <span>$$$$$$$$$$</span>
        </div>
        <div className='flex items-center justify-between w-full px-4 text-[#A80C0F] font-bold'>
          <p>NO OF PENDING PAYOUT LEFT ACCOUNTS ACCOUNTS</p>
          <span>$$$$$$$$$$</span>
        </div>
        <div className='flex items-center justify-between w-full px-4 text-[#B100AE] font-bold'>
          <p>NO OF BANKED EARNINGS ACCOUNTS</p>
          <span>$$$$$$$$$$</span>
        </div>
      </div>
    </>
  );
};

export default MainTable;