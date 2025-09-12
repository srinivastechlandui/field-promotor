

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const UserIdPopup = ({ onClose, setFilters }) => {
  const [userPopup, setUserPopup] = useState(false);

  // Statuses
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [joinedSort, setJoinedSort] = useState(null);
  const [ticketSort, setTicketSort] = useState(null);

  // Extra filter toggles
  const [bankEarned, setBankEarned] = useState(false);
  const [paidEarnings, setPaidEarnings] = useState(false);
  const [pendingPayput, setPendingPayout] = useState(false);
  const [accountsCreated, setAccountsCreated] = useState(false);
  const [unRotedAccount, setUnRotedAccount] = useState(false);
  const [paymentDue, setPaymentDue] = useState(false);
  const [tickets, setTickets] = useState(false);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleApply = () => {
    setFilters({
      statuses: selectedStatuses,
      joinedSort,
      ticketSort,
      bankEarned,
      paidEarnings,
      pendingPayput,
      accountsCreated,
      unRotedAccount,
      paymentDue,
      tickets,
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
    setPaymentDue(false);
    setTickets(false);

    setFilters({});
    onClose && onClose();
  };

  return (
    <div className="fixed top-0 right-0 w-80 h-full flex items-center justify-center p-4">
      <div className="w-[300px] border-2 border-white shadow-lg bg-[#D9D9D9]">
        {/* Header Row */}
        <div
          onMouseEnter={() => setUserPopup(true)}
          onMouseLeave={() => setUserPopup(false)}
          className={`p-3 border-b border-white flex justify-between items-center ${
            userPopup ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
          }`}
        >
          <div className="text-xl font-bold text-black relative">
            User
            <span
              className={`text-white px-2 py-1 rounded-md text-sm cursor-pointer transition-all  ${
                userPopup ? 'bg-blue-500 scale-110' : 'bg-gray-500'
              }`}
              onClick={() => setUserPopup(!userPopup)}
            >
              🆔
            </span>

            {userPopup && (
              <div
                className="absolute top-full left-0 w-[212px] bg-white shadow-lg rounded border border-gray-300 z-50 ml-2"
                style={{ transform: 'translateX(calc(-100% - 20px))' }}
                onMouseEnter={() => setUserPopup(true)}
                onMouseLeave={() => setUserPopup(false)}
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
                      onClick={() => toggleStatus(status)}
                      className={`flex items-center justify-start w-full h-[40px] text-black bg-[#D9D9D9] cursor-pointer px-4 ${
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
          </div>

          <button onClick={onClose} className="p-1 rounded bg-red-600">
            <IoClose className="text-white text-2xl" />
          </button>
        </div>

        {/* Joined date */}
        <div className="p-3 border-b border-white cursor-pointer bg-[#AE9F9F]">
          <p className="font-semibold">Joined date</p>
          <div className="flex justify-around mt-2">
            <button
              onClick={() => setJoinedSort('new')}
              className={`px-2 py-1 bg-white text-black rounded ${
                joinedSort === 'new' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              New → Old
            </button>
            <button
              onClick={() => setJoinedSort('old')}
              className={`px-2 py-1 bg-white text-black rounded ${
                joinedSort === 'old' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              Old → New
            </button>
          </div>
        </div>

        {/* Tickets */}
        <div className="p-3 border-b border-white cursor-pointer bg-[#AE9F9F]">
          <p className="font-semibold">Tickets</p>
          <div className="flex justify-around mt-2">
            <button
              onClick={() => setTicketSort('high')}
              className={`px-2 py-1 bg-white text-black rounded ${
                ticketSort === 'high' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              High → Low
            </button>
            <button
              onClick={() => setTicketSort('low')}
              className={`px-2 py-1 bg-white text-black rounded ${
                ticketSort === 'low' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              Low → High
            </button>
          </div>
        </div>

        {/* Extra dummy filters */}
        <div className="p-3 border-b border-white bg-[#AE9F9F]">
          <p className="font-semibold">Extra Filters</p>
          <div className="flex flex-col gap-2 mt-2">
            <label>
              <input
                type="checkbox"
                checked={bankEarned}
                onChange={() => setBankEarned(!bankEarned)}
              />{' '}
              Bank Earned
            </label>
            <label>
              <input
                type="checkbox"
                checked={paidEarnings}
                onChange={() => setPaidEarnings(!paidEarnings)}
              />{' '}
              Paid Earnings
            </label>
            <label>
              <input
                type="checkbox"
                checked={pendingPayput}
                onChange={() => setPendingPayout(!pendingPayput)}
              />{' '}
              Pending Payout
            </label>
            <label>
              <input
                type="checkbox"
                checked={accountsCreated}
                onChange={() => setAccountsCreated(!accountsCreated)}
              />{' '}
              Accounts Created
            </label>
            <label>
              <input
                type="checkbox"
                checked={unRotedAccount}
                onChange={() => setUnRotedAccount(!unRotedAccount)}
              />{' '}
              UnRoted Account
            </label>
            <label>
              <input
                type="checkbox"
                checked={paymentDue}
                onChange={() => setPaymentDue(!paymentDue)}
              />{' '}
              Payment Due
            </label>
          </div>
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
