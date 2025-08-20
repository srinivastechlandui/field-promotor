import React, { useState } from 'react';
import RaiseTickets from '../models/RaiseTickets';
import ActivatePopup from '../models/ActivatePopup';
import UnFilledPopup from '../models/UnFilledPopup';
import UnVerifiedPopup from '../models/UnverifiedPopup';
import ProcessingPopup from '../models/ProcessingPopup';

const MainTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivatePopupOpen, setIsActivatePopupOpen] = useState(false);
  const [isUnFilledPopupOpen, setIsUnFilledPopupOpen] = useState(false);
  const [isUnVerifiedPopupOpen, setIsUnVerifiedPopupOpen] = useState(false);
  const [isProcessingPopupOpen, setIsProcessingPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // Dummy data for 5 rows
  const tableData = [
    {
      profileImg: 'https://randomuser.me/api/portraits/men/1.jpg',
      userId: 'UID1001',
      status: 'Active',
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      joinedDate: '2023-05-15',
      bankedEarnings: '$1,250',
      paidEarnings: '$980',
      livePayoutBills: '$270',
      superBonus: '$150',
      accountsCreated: 12,
      unrootedAccounts: 2,
      paymentDue: '$320',
      tickets: 3
    },
    {
      profileImg: 'https://randomuser.me/api/portraits/women/2.jpg',
      userId: 'UID1002',
      status: 'Un Active',
      name: 'Jane Smith',
      phone: '+1 (555) 987-6543',
      joinedDate: '2023-07-22',
      bankedEarnings: '$850',
      paidEarnings: '$720',
      livePayoutBills: '$130',
      superBonus: '$75',
      accountsCreated: 8,
      unrootedAccounts: 1,
      paymentDue: '$180',
      tickets: 1
    },
    {
      profileImg: 'https://randomuser.me/api/portraits/men/3.jpg',
      userId: 'UID1003',
      status: 'UNFILLED',
      name: 'Robert Johnson',
      phone: '+1 (555) 456-7890',
      joinedDate: '2023-09-10',
      bankedEarnings: '$2,100',
      paidEarnings: '$1,650',
      livePayoutBills: '$450',
      superBonus: '$225',
      accountsCreated: 15,
      unrootedAccounts: 3,
      paymentDue: '$550',
      tickets: 5
    },
    {
      profileImg: 'https://randomuser.me/api/portraits/women/4.jpg',
      userId: 'UID1004',
      status: 'Un verified',
      name: 'Emily Davis',
      phone: '+1 (555) 789-0123',
      joinedDate: '2023-11-05',
      bankedEarnings: '$1,750',
      paidEarnings: '$1,200',
      livePayoutBills: '$550',
      superBonus: '$300',
      accountsCreated: 18,
      unrootedAccounts: 4,
      paymentDue: '$420',
      tickets: 2
    },
    {
      profileImg: 'https://randomuser.me/api/portraits/men/5.jpg',
      userId: 'UID1005',
      status: 'Processing',
      name: 'Michael Wilson',
      phone: '+1 (555) 234-5678',
      joinedDate: '2023-12-18',
      bankedEarnings: '$500',
      paidEarnings: '$300',
      livePayoutBills: '$200',
      superBonus: '$50',
      accountsCreated: 5,
      unrootedAccounts: 1,
      paymentDue: '$150',
      tickets: 4
    },
    {
      profileImg: 'https://randomuser.me/api/portraits/women/6.jpg',
      userId: 'UID1006',
      status: 'DEACTIVATED',
      name: 'Michael Wilson',
      phone: '+1 (555) 234-5678',
      joinedDate: '2023-12-18',
      bankedEarnings: '$500',
      paidEarnings: '$300',
      livePayoutBills: '$200',
      superBonus: '$50',
      accountsCreated: 5,
      unrootedAccounts: 1,
      paymentDue: '$150',
      tickets: 4
    }
  ];

  // Different border colors for each row
  const rowBorderColors = [
    '#3B82F6', // blue-500
    '#10B981', // green-500
    '#8B5CF6', // purple-500
    '#F97316', // orange-500
    '#EC4899', // pink-500
    '#6366F1'  // indigo-500
  ];
   const getRowBorderStyle = (index) => {
    const color = rowBorderColors[index % rowBorderColors.length];
    return {
      borderTop: `2px solid ${color}`,
      borderBottom: `2px solid ${color}`
    };
  };

  const handleProfileClick = (user) => {
    if (user.status === 'Active') {
      setSelectedUser(user);
      setIsActivatePopupOpen(true);
    }
    if (user.status === 'Un Active') {
      setSelectedUser(user);
      setIsActivatePopupOpen(true);
    }
    if (user.status === 'UNFILLED') {
      setSelectedUser(user);
      setIsUnFilledPopupOpen(true);
    }
    if (user.status === 'Un verified') {
      setSelectedUser(user);
      setIsUnVerifiedPopupOpen(true);
    }
    if (user.status === 'Processing') {
      setSelectedUser(user);
      setIsProcessingPopupOpen(true);
    }
  };
  return (
    <>
    <div className="overflow-x-auto bg-white rounded-lg shadow mt-3">
      <table className="min-w-full">
        <thead className="bg-gray-300 border-2 border-gray-950 rounded-lg">
          <tr>
            <th className="px-6 py-3 text-left text-base font-extrabold text-gray-950 uppercase tracking-wider">View Profile</th>
            <th className="px-6 py-3 text-left text-xs font-extrabold text-gray-950 uppercase tracking-wider">User ID & Status</th>
            <th className="px-6 py-3 text-left text-2xl font-extrabold text-gray-950 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-extrabold text-gray-950 uppercase tracking-wider">Phone Number & Joined Date</th>
            <th className="px-6 py-3 text-left text-sm font-extrabold text-gray-950 uppercase tracking-wider">Banked Earnings</th>
            <th className="px-6 py-3 text-left text-xs font-extrabold text-[#29A80C] uppercase tracking-wider">Paid Earnings</th>
            <th className="px-6 py-3 text-left text-sm font-extrabold text-gray-950 uppercase tracking-wider">Live Payout Bills</th>
            <th className="px-6 py-3 text-left text-xs font-extrabold text-gray-950 uppercase tracking-wider">Super Bonus</th>
            <th className="px-6 py-3 text-left text-xs font-extrabold text-[#29A80C] uppercase tracking-wider">No. of Accounts Created</th>
            <th className="px-6 py-3 text-left text-xs font-extrabold text-red-300 uppercase tracking-wider">No. of Unrooted Accounts</th>
            <th className="px-6 py-3 text-left text-base font-extrabold text-red-500 uppercase tracking-wider">Payment Due</th>
            <th className="px-6 py-3 text-left text-base font-extrabold text-[#0D0099] uppercase tracking-wider">Tickets</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((row, index) => (
            <tr 
              key={row.userId} 
              style={getRowBorderStyle(index)}
                className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <img 
                  className="h-[54px] w-[54px] rounded-full object-cover border-2 border-gray-200"
                  src={row.profileImg} 
                  alt={`${row.name}'s profile`}
                  onClick={() =>handleProfileClick(row)}
                />              
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{row.userId}</div>
                <div className={`text-sm ${
                  row.status === 'Active' ? 'text-green-500' : 
                  row.status === 'Un Active' ? 'text-[#FF0E12]' :
                  row.status === 'UNFILLED' ? 'text-[#E19034]' :
                  row.status === 'Un verified' ? 'text-[#A44143]' :
                  row.status === 'Processing' ? 'text-[#B100AE]' :
                  row.status === 'DEACTIVATED' ? 'text-white bg-red-500 m-auto rounded-lg w-24 h-5 ' :
                  'text-red-500'
                }`}>
                  {row.status}
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
                <div className="text-sm text-gray-900">{row.name}</div>
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
                <div className="text-sm text-gray-900">{row.phone}</div>
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
                <div className="text-sm text-[#A60CA8] font-bold">{row.bankedEarnings}</div>
                <div className='text-xs text-[#3021D7]'>(EDITED date)</div>
                <div className='text-xs text-[#3021D7]'>(EDITED BY)</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-lg fotn-bold text-[#29A80C]">{row.paidEarnings}</td>
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
                <div className='text-[#A80C0F] text-0lg font-bold'>{row.livePayoutBills}</div>
                <div className='flex items-center gap-1'>
                  <span className='text-[15px] font-extrabold'>@1.1</span>
                  <div className='text-xs text-[#3021D7] flex flex-col'>
                    <span>(EDITED date)</span>
                    <span>(EDITED BY)</span>
                  </div>
                </div>
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-[#5907FF]">{row.superBonus}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                <div className='text-[#E19034] text-2xl font-bold'>{row.accountsCreated}</div>
                <div className='text-xs text-[#3021D7]'>(Date)</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                <div className='text-[#FF0E12] text-2xl font-bold'>{row.unrootedAccounts}</div>
                <div className='text-xs text-[#3021D7]'>(Date)</div>
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
                <div className='text-[#FF0707] text-lg font-bold'>{row.paymentDue}</div>
                <div className='text-xs text-[#3021D7]'>(Edit Date)</div>
                <div className='text-xs text-[#3021D7]'>(EDITED BY)</div>
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-center"
                onClick={() => setIsModalOpen(true)}>
                <div className="text-lg font-extrabold text-[#0D0099]">
                  {row.tickets}
                </div>
              </td>
            </tr>
          ))}
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
      {isModalOpen && (
        <RaiseTickets
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isActivatePopupOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ActivatePopup 
            user={selectedUser}
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
  );
};

export default MainTable;