import React from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={`w-full h-[34px] border-2 border-[#000000] ${
            searchText ? "bg-white" : "bg-[#D9D9D9]"
          } rounded-full focus:outline-none pl-4 transition-colors duration-200`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <FiSearch className="text-[#E56C6C] w-[22px] h-[22px]" />
        </div>
      </div>
      <div className="h-[32px] bg-[#6efc9e] relative rounded-lg border border-[#000000]">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-[25px] h-[25px] bg-[#52f600] flex items-center justify-center rounded-full">
          <FiPlus className="text-white w-[22px] h-[22px]" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
