import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const UserIdPopup = ({onClose}) => {
const [userPopup, setUserPopup] = useState(false);
const [showJoinedPopup, setShowJoinedPopup] = useState(false);
const [bankEarned, setBankEarned] = useState(false);
const [paidEarnings, setPaidEarnings] = useState(false);
const [pendingPayput, setPendingPayout] = useState(false);
const [accountsCreated, setAccountsCreated] = useState(false);
const [unRotedAccount, setUnRotedAccount] = useState(false);
const [paymentDue, setPaymentDue] = useState(false);
const [tickets, setTickets] = useState(false);
// const [isUserIdHovered, setIsUserIdHovered] = useState(false);
  return (
    <div className="fixed top-0 right-0 w-80 h-full flex items-center justify-center p-4">
      <div className="w-[300px] border-2 border-white shadow-lg bg-[#D9D9D9]">
            {/* Header Row */}
            <div onMouseEnter={() => setUserPopup(true)}
                onMouseLeave={() => setUserPopup(false)}
                className={`p-3 border-b border-white flex justify-between items-center ${
                    userPopup ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
                }`}>
                <div 
                className="text-xl font-bold text-black relative">
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
                        <div className="absolute top-full left-0 w-[212px] h-[352px] bg-white shadow-lg rounded border border-gray-300 z-50 ml-2"
                            style={{ transform: 'translateX(calc(-100% - 20px))' }}
                            onMouseEnter={() => setUserPopup(true)}
                            onMouseLeave={() => setUserPopup(false)}>
                            <div className="p-2 space-y-1 flex flex-col">
                                <div className="flex items-center justify-start w-full h-[52px] text-[#43C701] bg-[#D9D9D9] cursor-pointer">
                                    <span className='ml-5'>Acivated</span>
                                </div>
                                <div className="flex items-center justify-start w-full h-[52px] text-[#FF0E12] bg-[#D9D9D9] cursor-pointer">
                                    <span className='ml-5'>un Active</span>
                                </div>
                                <div className="flex items-center justify-start w-full h-[52px] text-[#B100AE] bg-[#D9D9D9] cursor-pointer">
                                    <span className='ml-5'>processing</span>
                                </div>
                                <div className="flex items-center justify-start w-full h-[52px] text-[#A44143] bg-[#D9D9D9] cursor-pointer">
                                    <span className='ml-5'>un verified</span>
                                </div>
                                <div className="flex items-center justify-start w-full h-[52px] text-[#E19034] bg-[#D9D9D9] cursor-pointer">
                                    <span className='ml-5'>UN FILLED</span>
                                </div>
                                <div className="flex items-center justify-start w-full h-[52px] text-[#D51215] bg-[#D9D9D9] cursor-pointer">
                                    <span className='ml-5'>DEACTIVATED</span>
                                </div>
                            </div>
                        </div>

                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded bg-red-600"
                    >
                    <IoClose className="text-white text-2xl" />
                </button>
            </div>
        
        {/* Data Rows */}
         <div  
            onMouseEnter={() => setShowJoinedPopup(true)}
            onMouseLeave={() => setShowJoinedPopup(false)}
            className={`p-3 border-b border-white cursor-pointer relative ${
                showJoinedPopup ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
            }`}>
            Joined date
            {showJoinedPopup && (
            <div className="absolute top-full left-0 w-[180px] h-[122px] bg-[#D9D9D9] shadow-lg rounded border border-gray-300 z-50 ml-2"
               style={{ transform: 'translateX(calc(-100% - 1px))' }}
                    onMouseEnter={() => setShowJoinedPopup(true)}
                    onMouseLeave={() => setShowJoinedPopup(false)}>
              <div className="p-2 text-center text-[#3021D7] font-medium">
                Joined data
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-[156px] h-[36px] flex items-center justify-center text-black bg-[#FFFDFD] cursor-pointer">
                  New to old
                </div>
                <div className="w-[156px] h-[36px] flex items-center justify-center text-black bg-[#FFFDFD] cursor-pointer">
                  Old to new
                </div>
              </div>
            </div>
          )}
        </div>
        <div  onMouseEnter={() => setBankEarned(true)}
            onMouseLeave={() => setBankEarned(false)}
            className={`p-3 border-b border-white cursor-pointer relative ${
                bankEarned ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
            }`}>
            Banked earnings
            {bankEarned && (
                <div className="absolute top-full left-0 w-[352px] h-[92px] bg-[#FFFAFA] shadow-lg rounded border border-gray-300 z-50
                  flex justify-center items-center gap-3"
                  style={{ transform: 'translateX(calc(-100% - 1px))' }}
                    onMouseEnter={() => setBankEarned(true)}
                    onMouseLeave={() => setBankEarned(false)}>
                    <div className='w-[113px] h-[90px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#A60CA8]'>AMOUNT</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>High to low</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>Low to high</p>
                        </div>
                    </div>
                     <div className='w-[113px] h-[90px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#A60CA8]'>UPDATED</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>High to low</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>Low to high</p>
                        </div>
                    </div>
                     <div className='w-[113px] h-[90px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#A60CA8]'>EDIT</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>High to low</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>Low to high</p>
                        </div>
                    </div>

                </div>
            )}
        </div>
        <div onMouseEnter={() => setPaidEarnings(true)}
            onMouseLeave={() => setPaidEarnings(false)}
            className={`p-3 border-b border-white cursor-pointer relative ${
                paidEarnings ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
            }`}>
            Paid earnings
            {paidEarnings && (
                <div className="absolute top-full left-0 w-[117px] h-[94px] bg-[#D9D9D9] shadow-lg rounded border border-gray-300 z-50
                  flex flex-col justify-center items-center"
                   style={{ transform: 'translateX(calc(-100% - 1px))' }}
                    onMouseEnter={() => setPaidEarnings(true)}
                    onMouseLeave={() => setPaidEarnings(false)}>
                    <h3 className='font-bold text-[#29A80C] my-2'>AMOUNT</h3>
                    <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center mb-2'>
                        <p className='text-black text-base'>High to low</p>
                    </div>
                    <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center mb-2'>
                        <p className='text-black text-base'>Low to high</p>
                    </div>
                </div>
            )}
        </div>
        <div onMouseEnter={() => setPendingPayout(true)}
            onMouseLeave={() => setPendingPayout(false)}
            className={`p-3 border-b border-white cursor-pointer relative ${
                pendingPayput ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
            }`}>
            Pending Payout left
            {pendingPayput &&(
                 <div className="absolute top-full left-0 w-[352px] h-[92px] bg-[#FFFAFA] shadow-lg rounded border border-gray-300 z-50
                  flex justify-center items-center gap-3"
                   style={{ transform: 'translateX(calc(-100% - 1px))' }}
                    onMouseEnter={() => setPendingPayout(true)}
                    onMouseLeave={() => setPendingPayout(false)}>
                    <div className='w-[113px] h-[90px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#A80C0F]'>AMOUNT</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>High to low</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>Low to high</p>
                        </div>
                    </div>
                     <div className='w-[113px] h-[90px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#A80C0F]'>UPDATED</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>Old to new</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>New to old</p>
                        </div>
                    </div>
                     <div className='w-[113px] h-[90px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#A80C0F]'>EDIT</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>Edited</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>not edited</p>
                        </div>
                    </div>

                </div>
            )}
        </div>
        <div onMouseEnter={() => setAccountsCreated(true)}
            onMouseLeave={() => setAccountsCreated(false)}
            className={`p-3 border-b border-white cursor-pointer relative font-bold ${
                accountsCreated ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
            }`}>
            NO of accounts created
            {accountsCreated &&(
                <div className="absolute top-full left-0 w-[252px] h-[94px] bg-[#FFFAFA] shadow-lg rounded border border-gray-300 z-50
                  flex justify-center items-center gap-3"
                    style={{ transform: 'translateX(calc(-100% - 1px))' }}
                    onMouseEnter={() => setAccountsCreated(true)}
                    onMouseLeave={() => setAccountsCreated(false)}>
                    <div className='w-[116px] h-[93px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#E19034]'>UPDATED</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>Old to new</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>new to old</p>
                        </div>
                    </div>
                    <div className='w-[116px] h-[93px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#E19034] text-xs'>CREATED ACCOUNT</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>High to low</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>Low to high</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div onMouseEnter={() => setUnRotedAccount(true)}
            onMouseLeave={() => setUnRotedAccount(false)}
            className={`p-3 border-b border-white cursor-pointer relative font-bold ${
                unRotedAccount ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
            }`}>
            NO of unrotted accounts
            {unRotedAccount &&(
                <div className="absolute top-full left-0 w-[252px] h-[94px] bg-[#FFFAFA] shadow-lg rounded border border-gray-300 z-50
                  flex justify-center items-center gap-3"
                  style={{ transform: 'translateX(calc(-100% - 1px))' }}
                    onMouseEnter={() => setUnRotedAccount(true)}
                    onMouseLeave={() => setUnRotedAccount(false)}>
                    <div className='w-[116px] h-[93px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#FF0E12]'>UPDATED</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>Old to new</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>new to old</p>
                        </div>
                    </div>
                    <div className='w-[116px] h-[93px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#FF0E12] text-xs'>Created unAccounts</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>High to low</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>Low to high</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div onMouseEnter={() => setPaymentDue(true)}
            onMouseLeave={() => setPaymentDue(false)}
            className={`p-3 border-b border-white cursor-pointer relative ${
                paymentDue ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
            }`}>
            Payment due
            {paymentDue &&(
                 <div className="absolute top-full left-0 w-[352px] h-[92px] bg-[#FFFAFA] shadow-lg rounded border border-gray-300 z-50
                  flex justify-center items-center gap-3"
                  style={{ transform: 'translateX(calc(-100% - 1px))' }}
                    onMouseEnter={() => setPaymentDue(true)}
                    onMouseLeave={() => setPaymentDue(false)}>
                    <div className='w-[113px] h-[90px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#FF0707]'>AMOUNT</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>High to low</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>Low to high</p>
                        </div>
                    </div>
                     <div className='w-[113px] h-[90px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#FF0707]'>UPDATED</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>Old to new</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>New to old</p>
                        </div>
                    </div>
                     <div className='w-[113px] h-[90px] bg-[#D9D9D9] rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-bold text-[#FF0707]'>EDIT</h3>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2 mb-2'>
                            <p className='text-black text-base'>Edited</p>
                        </div>
                        <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center space-y-2'>
                            <p className='text-black text-base'>not edited</p>
                        </div>
                    </div>

                </div>
            )}
        </div>
        <div onMouseEnter={() => setTickets(true)}
            onMouseLeave={() => setTickets(false)}
            className={`p-3 border-b border-white cursor-pointer relative ${
                tickets ? 'bg-[#9A8888] scale-110' : 'bg-[#AE9F9F]'
            }`}>
            TICKETS
            {tickets && (
                 <div className="absolute bottom-full left-0 w-[117px] h-[94px] bg-[#D9D9D9] shadow-lg rounded border border-gray-300 z-50
                  flex flex-col justify-center items-center"
                  style={{ transform: 'translateX(calc(-100% - 1px))' }}
                    onMouseEnter={() => setTickets(true)}
                    onMouseLeave={() => setTickets(false)}>
                    <h3 className='font-bold text-[#0D0099] my-2'>UPDATED</h3>
                    <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center mb-2'>
                        <p className='text-black text-base'>High to low</p>
                    </div>
                    <div className='w-[92px] h-[20px] bg-[#FFFAFA] flex justify-center items-center mb-2'>
                        <p className='text-black text-base'>Low to high</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserIdPopup;