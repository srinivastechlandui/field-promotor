import React, { useState, useRef, useEffect } from 'react';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import UserIdPopup from '../models/UserIdPopup';

const FilterBar = ({ selectedOption, setSelectedOption, setUserIdFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userIdPopup, setUserIdPopup] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <div className="mt-2">
      {/* Main Filter Bar */}
      <div className="flex items-center h-8 bg-[#2c9688] px-3 text-white font-sans rounded-lg border-2 border-[#000000]">
        <div className="w-full flex justify-between items-center">
          <span className="font-medium">{selectedOption}</span>
          <div className="flex items-center justify-center gap-5">
          <button 
            onClick={()=> setUserIdPopup(true)}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            aria-label="Filter options"
            aria-expanded={isOpen}
          >
            <FiFilter className="text-sm" />
            <span>Filter</span>
          </button>
        
          </div>
        </div>
      </div>
    </div>
  { userIdPopup && <UserIdPopup onClose={() => setUserIdPopup(false)} setFilters={setUserIdFilters} />}
    </>
  );
};

export default FilterBar;