import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const UserIdPopup = ({ onClose, setFilters }) => {
  const [userPopup, setUserPopup] = useState(false);
  const [bankedPopup, setBankedPopup] = useState(false);
  const [paidPopup, setPaidPopup] = useState(false);
  const [paymentDuePopup, setPaymentDuePopup] = useState(false);
  const [joinedDatePopup, setJoinedDatePopup] = useState(false);
  const [ticketsPopup, setTicketsPopup] = useState(false);

  // Statuses
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [joinedSort, setJoinedSort] = useState(null);
  const [ticketSort, setTicketSort] = useState(null);

  // Extra filter toggles (now with state but not rendered)
  const [bankEarned, setBankEarned] = useState(false);
  const [paidEarnings, setPaidEarnings] = useState(false);
  const [pendingPayput, setPendingPayout] = useState(false);
  const [accountsCreated, setAccountsCreated] = useState(false);
  const [unRotedAccount, setUnRotedAccount] = useState(false);

  // Sort states
  const [bankedEarningsSort, setBankedEarningsSort] = useState(null);
  const [paidEarningsSort, setPaidEarningsSort] = useState(null);
  const [paymentDueSort, setPaymentDueSort] = useState(null);
  // New: No Of Account Created sort
  const [accountsCreatedSort, setAccountsCreatedSort] = useState(null);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Only one popup open at a time
  const closeAllPopups = () => {
    setUserPopup(false);
    setBankedPopup(false);
    setPaidPopup(false);
    setPaymentDuePopup(false);
    setJoinedDatePopup(false);
    setTicketsPopup(false);
  };

  const togglePopup = (popupSetter) => {
    closeAllPopups();
    popupSetter(true);
  };

  const handleApply = () => {
    // Map status filters to status_code values
    let statusCodes = [];
    selectedStatuses.forEach((status) => {
      if (status === 'TRAINING') statusCodes.push(5);
      else if (status === 'UNVERIFIED') statusCodes.push(1);
      else if (status === 'UNFILLED') statusCodes.push(0);
      else statusCodes.push(status); // For other statuses, pass as-is
    });

    setFilters({
      statuses: statusCodes,
      joinedSort,
      ticketSort,
      bankEarned,
      paidEarnings,
      pendingPayput,
      accountsCreated,
      unRotedAccount,
      paymentDue: paymentDueSort,
      tickets: ticketSort,
      bankedEarningsSort,
      paidEarningsSort,
      paymentDueSort,
      accountsCreatedSort,
    });
    onClose && onClose();
  };

  const handleClear = () => {
    setSelectedStatuses([]);
    setJoinedSort(null);
    setTicketSort(null);
    setBankEarned(false);
    setPaidEarnings(false);
    setPendingPayout(false);
    setAccountsCreated(false);
    setUnRotedAccount(false);
    setBankedEarningsSort(null);
    setPaidEarningsSort(null);
    setPaymentDueSort(null);

    setFilters({});
    onClose && onClose();
  };

  return (
    <div className="fixed top-0 right-0 w-80 h-full flex items-center justify-center p-4">
      <div className="w-[300px] border-2 border-white shadow-lg bg-[#D9D9D9]">
        {/* User */}
        <div
          className={`relative p-3 border-b border-white flex justify-between items-center transition-all duration-300 ease-in-out ${
            userPopup ? 'bg-[#9A8888]' : 'bg-[#AE9F9F]'
          }`}
        >
          <div className="text-xl font-bold text-black flex items-center gap-2"
          onClick={() => togglePopup(setUserPopup)}>
            User
            <span
              
              className={`text-white px-2 py-1 rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out ${
                userPopup ? 'bg-blue-500 scale-110' : 'bg-gray-500'
              }`}
            >
              🆔
            </span>
          </div>

          {userPopup && (
            <div
              className="absolute top-full left-0 w-[212px] bg-white shadow-lg rounded border border-gray-800 z-50 ml-1 animate-fade-in"
              style={{ transform: 'translateX(calc(-100% - 20px))' }}
            >
              <div className="p-2 space-y-1 flex flex-col">
                {[
                  'ACTIVE',
                  'UNACTIVE',
                  'TRAINING',
                  'UNVERIFIED',
                  'UNFILLED',
                  'DEACTIVATED',
                ].map((status) => (
                  <div
                    key={status}
                    onClick={() => {
                      toggleStatus(status);
                      setUserPopup(false); // Close popup on selection
                    }}
                    className={`flex items-center justify-start w-full h-[40px] text-black bg-[#D9D9D9] cursor-pointer px-4 border-2 border-transparent transition-all duration-250 ease-in-out ${
                      selectedStatuses.includes(status)
                        ? 'ring-2 ring-blue-500 bg-white'
                        : ''
                    }`}
                  >
                    <span className="ml-1">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button onClick={onClose} className="p-1 rounded bg-red-600">
            <IoClose className="text-white text-2xl" />
          </button>
        </div>

        {/* Joined date */}
        <div
          className={`p-3 border-b border-white flex justify-between items-center relative transition-all duration-300 ease-in-out ${
            joinedDatePopup ? 'bg-[#9A8888]' : 'bg-[#AE9F9F]'
          }`}
        >
          <p className="font-semibold text-black flex items-center gap-2">
            Joined date
            <span
              onClick={() => togglePopup(setJoinedDatePopup)}
              className={`text-white px-2 py-1 rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out ${
                joinedDatePopup ? 'bg-blue-500 scale-110' : 'bg-gray-500'
              }`}
            >
              📅
            </span>
          </p>
          {joinedDatePopup && (
            <div
              className="absolute top-full left-0 w-[212px] bg-white shadow-lg rounded border border-gray-300 z-50 ml-2 animate-fade-in"
              style={{ transform: 'translateX(calc(-100% - 20px))' }}
            >
              <div className="p-2 space-y-1 flex flex-col">
                <button
                  onClick={() => {
                    setJoinedSort('new');
                    setJoinedDatePopup(false); // Close popup on selection
                  }}
                  className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    joinedSort === 'new' ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  New → Old
                </button>
                <button
                  onClick={() => {
                    setJoinedSort('old');
                    setJoinedDatePopup(false); // Close popup on selection
                  }}
                  className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    joinedSort === 'old' ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  Old → New
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tickets */}
        <div
          className={`p-3 border-b border-white flex justify-between items-center relative transition-all duration-300 ease-in-out ${
            ticketsPopup ? 'bg-[#9A8888]' : 'bg-[#AE9F9F]'
          }`}
        >
          <p className="font-semibold text-black flex items-center gap-2">
            Tickets
            <span
              onClick={() => togglePopup(setTicketsPopup)}
              className={`text-white px-2 py-1 rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out ${
                ticketsPopup ? 'bg-blue-500 scale-110' : 'bg-gray-500'
              }`}
            >
              🎫
            </span>
          </p>
          {ticketsPopup && (
            <div
              className="absolute top-full left-0 w-[212px] bg-white shadow-lg rounded border border-gray-300 z-50 ml-2 animate-fade-in"
              style={{ transform: 'translateX(calc(-100% - 20px))' }}
            >
              <div className="p-2 space-y-1 flex flex-col">
                <button
                  onClick={() => {
                    setTicketSort('high');
                    setTicketsPopup(false); // Close popup on selection
                  }}
                  className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    ticketSort === 'high' ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  High → Low
                </button>
                <button
                  onClick={() => {
                    setTicketSort('low');
                    setTicketsPopup(false); // Close popup on selection
                  }}
                  className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    ticketSort === 'low' ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  Low → High
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Banked Earnings */}
        <div
          className={`p-3 border-b border-white flex justify-between items-center relative transition-all duration-300 ease-in-out ${
            bankedPopup ? 'bg-[#9A8888]' : 'bg-[#AE9F9F]'
          }`}
        >
          <p className="font-semibold text-black flex items-center gap-2">
            Banked Earnings
            <span
              onClick={() => togglePopup(setBankedPopup)}
              className={`text-white px-2 py-1 rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out ${
                bankedPopup ? 'bg-blue-500 scale-110' : 'bg-gray-500'
              }`}
            >
              💸
            </span>
          </p>
          {bankedPopup && (
            <div
              className="absolute top-full left-0 w-[212px] bg-white shadow-lg rounded border border-gray-300 z-50 ml-2 animate-fade-in"
              style={{ transform: 'translateX(calc(-100% - 20px))' }}
            >
              <div className="p-2 space-y-1 flex flex-col">
                <button
                  onClick={() => {
                    setBankedEarningsSort('high');
                    setBankedPopup(false); // Close popup on selection
                  }}
                  className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    bankedEarningsSort === 'high' ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  High → Low
                </button>
                <button
                  onClick={() => {
                    setBankedEarningsSort('low');
                    setBankedPopup(false); // Close popup on selection
                  }}
                  className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    bankedEarningsSort === 'low' ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  Low → High
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Paid Earnings */}
        <div
          className={`p-3 border-b border-white flex justify-between items-center relative transition-all duration-300 ease-in-out ${
            paidPopup ? 'bg-[#9A8888]' : 'bg-[#AE9F9F]'
          }`}
        >
          <p className="font-semibold text-black flex items-center gap-2">
            Paid Earnings
            <span
              onClick={() => togglePopup(setPaidPopup)}
              className={`text-white px-2 py-1 rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out ${
                paidPopup ? 'bg-blue-500 scale-110' : 'bg-gray-500'
              }`}
            >
              💰
            </span>
          </p>
          {paidPopup && (
            <div
              className="absolute top-full left-0 w-[212px] bg-white shadow-lg rounded border border-gray-300 z-50 ml-2 animate-fade-in"
              style={{ transform: 'translateX(calc(-100% - 20px))' }}
            >
              <div className="p-2 space-y-1 flex flex-col">
                <button
                  onClick={() => {
                    setPaidEarningsSort('high');
                    setPaidPopup(false); // Close popup on selection
                  }}
                  className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    paidEarningsSort === 'high' ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  High → Low
                </button>
                <button
                  onClick={() => {
                    setPaidEarningsSort('low');
                    setPaidPopup(false); // Close popup on selection
                    }}
                    className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    paidEarningsSort === 'low' ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    Low → High
                  </button>
                  </div>
                </div>
                )}
              </div>

              {/* No Of Account Created */}
              <div
                className={`p-3 border-b border-white flex justify-between items-center relative transition-all duration-300 ease-in-out ${
                accountsCreatedSort ? 'bg-[#9A8888]' : 'bg-[#AE9F9F]'
                }`}
              >
                <p className="font-semibold text-black flex items-center gap-2">
                No Of Account Created
                <span
                  onClick={() => setAccountsCreatedSort(accountsCreatedSort ? null : 'open')}
                  className={`text-white border-b border-black px-2 py-1 rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out ${
                  accountsCreatedSort ? 'bg-blue-500 scale-110' : 'bg-gray-500'
                  }`}
                >
                  🗂️
                </span>
                </p>
                {accountsCreatedSort === 'open' && (
                  <div
                    className="absolute top-full left-0 w-[212px] bg-white shadow-lg rounded border border-gray-300 z-50 ml-2 animate-fade-in"
                    style={{ transform: 'translateX(calc(-100% - 20px))' }}
                  >
                    <div className="p-2 space-y-1 flex flex-col">
                      <button
                        onClick={() => {
                          setAccountsCreatedSort('new');
                        }}
                        className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                          accountsCreatedSort === 'new' ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={accountsCreatedSort === 'new' ? { boxShadow: '0 0 0 2px #3B82F6' } : {}}
                      >
                        New → Old
                      </button>
                      <button
                        onClick={() => {
                          setAccountsCreatedSort('old');
                        }}
                        className={`px-2 py-1 text-left bg-white border-black text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                          accountsCreatedSort === 'old' ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={accountsCreatedSort === 'old' ? { boxShadow: '0 0 0 2px #3B82F6' } : {}}
                      >
                        Old → New
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Payment Due */}
        <div
          className={`p-3 border-b border-white flex justify-between items-center relative transition-all duration-300 ease-in-out ${
            paymentDuePopup ? 'bg-[#9A8888]' : 'bg-[#AE9F9F]'
          }`}
        >
          <p className="font-semibold text-black flex items-center gap-2">
            Payment Due
            <span
              onClick={() => togglePopup(setPaymentDuePopup)}
              className={`text-white px-2 py-1 rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out ${
                paymentDuePopup ? 'bg-blue-500 scale-110' : 'bg-gray-500'
              }`}
            >
              🗓️
            </span>
          </p>
          {paymentDuePopup && (
            <div
              className="absolute top-full left-0 w-[212px] bg-white shadow-lg rounded border border-gray-300 z-50 ml-2 animate-fade-in"
              style={{ transform: 'translateX(calc(-100% - 20px))' }}
            >
              <div className="p-2 space-y-1 flex flex-col">
                <button
                  onClick={() => {
                    setPaymentDueSort('high');
                    setPaymentDuePopup(false); // Close popup on selection
                  }}
                  className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    paymentDueSort === 'high' ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  High → Low
                </button>
                <button
                  onClick={() => {
                    setPaymentDueSort('low');
                    setPaymentDuePopup(false); // Close popup on selection
                  }}
                  className={`px-2 py-1 text-left bg-white text-black rounded border-2 border-transparent transition-all duration-150 ease-in-out ${
                    paymentDueSort === 'low' ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  Low → High
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Apply & Clear */}
        <div className="p-3 flex justify-end gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1 rounded bg-gray-300"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserIdPopup;