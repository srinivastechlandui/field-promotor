import React, { useState, useRef, useEffect } from 'react';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import UserIdPopup from '../models/UserIdPopup';

const FilterBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");
  const [userIdPopup, setUserIdPopup] = useState(false);
  const dropdownRef = useRef(null);

  // Static filter options
  const filterOptions = ['All', 'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai'];

  
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
    <div className="relative mt-2">
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
          <button 
              onClick={() => setIsOpen(!isOpen)}
              className="hover:opacity-80 transition-opacity"
              aria-label="Toggle location dropdown"
            >
              <FiChevronDown className={`text-lg font-bold transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
        >
          <ul className="py-1">
            {filterOptions.map((option) => (
              <li key={option}>
                <button
                  onClick={() => handleOptionClick(option)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    option === selectedOption 
                      ? 'bg-gray-100 text-[#2c9688] font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    { userIdPopup && <UserIdPopup onClose={() => setUserIdPopup(false)} />}
    </>
  );
};

export default FilterBar;