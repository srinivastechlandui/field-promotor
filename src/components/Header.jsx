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
  // State to hold todayTotals from MainTable
  const [todayTotals, setTodayTotals] = useState({ bankedEarnings: 0, paidEarnings: 0, paymentDue: 0 });

  // Callback to receive todayTotals from MainTable
  const handleTodayTotals = (totals) => {
    setTodayTotals(totals);
  };

  return (
    <>
     <section className='w-full flex justify-between items-start px-5 gap-4'>
      {/* ...existing code... */}
    </section>
    <MainTable
      searchText={searchText}
      filterOption={selectedOption}
      userIdFilters={userIdFilters}
      onTodayTotals={handleTodayTotals}
    />
    <BottomEyeIcon
      todayBankedEarningsCount={todayTotals.bankedEarnings}
      todayPaidEarningsCount={todayTotals.paidEarnings}
      todayPaymentDueCount={todayTotals.paymentDue}
    />
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
