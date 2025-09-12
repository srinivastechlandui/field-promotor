import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom"; // import at the top
import header from '../Assets/headerbg.png';
import { FaBell } from 'react-icons/fa';
import profile from '../Assets/profile.png'
import SearchBar from '../page/SearchBar';
import FilterBar from '../page/FilterBar';
import MainTable from '../page/MainTable';
import ProgressPopup from '../models/ProgressPopup';
import NotificationPopup from '../models/NotificationPopup';
import VideosPopup from '../models/VideosPopup';
import AccountStatementModal from '../models/AccountStatementModal';
import UserPopup from '../models/UserPopup';
import BottomEyeIcon from '../page/BottomEyeIcon';
import { TbDots } from 'react-icons/tb';
import PaidEarnings from '../models/PaidEarnings';
const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showVideosPopup, setShowVideosPopup] = useState(false);
  const [showAccountStatement, setShowAccountStatement] = useState(false);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [showPaidEarnings, setShowPaidEarnings] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState("All");
  const [userIdFilters, setUserIdFilters] = useState({});
    const navigate = useNavigate(); 
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/", { replace: true }); 
    }
  }, [navigate]);
  const handleLogout = () => {
    navigate("/", { replace: true }); 
  };
  return (
    <>
     <section className='w-full flex justify-between items-start px-5 gap-4'>
      <div className="flex-1 max-w-[calc(100%-241px-1rem)]"> 
        <div
          className="h-[168px] flex items-center gap-4 p-4 rounded-xl shadow-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${header})` }}
        >
          {/* Progress Tracker */}
          <div onClick={() => setIsPopupOpen(true)} 
             className="relative flex items-center flex-col justify-center bg-white rounded-lg border border-red-200 px-3 py-2 shadow-md w-[319px] h-[149px]">
            <div className="flex items-center w-full relative justify-between">
              <div 
                className="absolute h-[2px] bg-gray-300 top-1/2 -translate-y-1/2"
                style={{
                  left: '24px',  
                  right: '24px',  
                }}
              ></div>
              
              <div 
                className="absolute h-[2px] bg-green-500 top-1/2 -translate-y-1/2"
                style={{ 
                  left: '24px',  
                  width: '64px' 
                }}
              ></div>

              <div className="flex flex-col items-center z-10">
                <span className="text-xs font-bold text-black">0</span>
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">✓</div>
                <span className="text-xs text-gray-600">3</span>
              </div>

              <div className="flex flex-col items-center z-10">
                <span className="text-xs font-bold text-black">0</span>
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">✓</div>
                <span className="text-xs text-gray-600">8</span>
              </div>

              <div className="flex flex-col items-center z-10">
                <span className="text-xs font-bold text-black">SALARY</span>
                <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-white"></div>
                <span className="text-xs text-gray-600">11</span>
              </div>

              <div className="flex flex-col items-center z-10">
                <span className="text-xs font-bold text-black">850</span>
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white"></div>
                <span className="text-xs text-gray-600">13</span>
              </div>
            </div>
            <div onClick={() => setIsPopupOpen(true)}
              className="absolute bottom-2 left-2 text-2xl text-red-500">
              <TbDots />
            </div>
          </div>

          {/* Gold Bell Icon */}
          <div  onClick={() => setShowNotification(true)}
            className="w-[108px] h-[109px] rounded-lg bg-white shadow-md flex items-center justify-center">
            <FaBell className="text-amber-400 w-[80%] h-[80%]" />
          </div>

          {/* Videos Button */}
          <button onClick={() => setShowVideosPopup(true)}
             className="relative flex items-center justify-center gap-4 w-[322px] h-[123px] bg-blue-600 hover:bg-blue-700 text-[#fffafa] rounded-r-3xl shadow-md">
            <span className="bg-gray-200 w-[30px] h-[30px] rounded-full"></span>
            <span className="text-[25px] font-extrabold font-inter">Videos for you</span>
            <div 
              className="absolute bottom-2 left-10 text-4xl text-red-500">
              <TbDots />
            </div>
          </button>

          {/* Red Notification Bell */}
         <div onClick={() => setShowAccountStatement(true)}
            className="flex items-center justify-center bg-white shadow-md rounded-lg"
            style={{
              width: "108px",
              height: "108px",
              // borderRadius: "50%",
              aspectRatio: "1/1",
            }}
          >
            <FaBell className="text-red-500 w-[90%] h-[90%] -rotate-12" />
          </div>
          {/* Green Mic Button with Bell */}
          <div onClick={() => setShowPaidEarnings(true)}
            className="w-[108px] h-[108px] rounded-lg bg-white shadow-md flex items-center justify-center aspect-square">
            <FaBell className="text-green-500 rounded-lg w-[90%] h-[90%]" />
          </div> 
          <div className="absolute top-2 right-5 flex gap-4 mr-5">
            <button
              className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/privacy")}
            >
              Privacy
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          
        </div>
        {/* Search Bar */}
         <div className='w-full mt-4'>
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
          </div>
           
      </div>
      
      {/* Profile Image */}
     <div onClick={() => setIsUserPopupOpen(true)}
        className="relative flex-shrink-0 w-[241px] h-[241px] mt-[40px]">
        <div className="absolute inset-0 bg-white rounded-3xl shadow-lg overflow-hidden">
          <img 
            src={profile} 
            alt="Profile" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
    {/* <FilterBar selectedOption={selectedOption} setSelectedOption={setSelectedOption} setUserIdFilters={setUserIdFilters} /> */}
  <MainTable searchText={searchText} filterOption={selectedOption} userIdFilters={userIdFilters} />
  {/* <div className='mx-2 w-full h-[132px] bg-blue-200 flex flex-col items-center justify-center
                           border-2 border-red-500 mt-30 shadow-lg relative rounded-lg'>
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
      </div> */}
    <BottomEyeIcon/>
    {isPopupOpen && <ProgressPopup onClose={() => setIsPopupOpen(false)} />}
    {showNotification && <NotificationPopup onClose={() => setShowNotification(false)} />}
    {showVideosPopup && <VideosPopup onClose={() => setShowVideosPopup(false)} />}
    {showAccountStatement && <AccountStatementModal onClose={() => setShowAccountStatement(false)} />}
    {showPaidEarnings && <PaidEarnings onClose={()=>setShowPaidEarnings(false)}/>}
    {isUserPopupOpen && <UserPopup onClose={() => setIsUserPopupOpen(false)} />}
    </>
  );
};

export default Header;
