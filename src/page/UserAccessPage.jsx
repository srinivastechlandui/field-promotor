/* eslint-disable no-unused-vars */
// src/pages/UserAccessPage.js
import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import job from "../Assets/jonoprtunity.png";
import { useNavigate } from "react-router-dom";

const UserAccessPage = ({onBack}) => {
  const navigate = useNavigate();
  const [expandedField, setExpandedField] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    phoneNumber: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const toggleField = (index) => {
    setExpandedField(expandedField === index ? null : index);
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center px-4 py-10"
      style={{ backgroundImage: `url(${job})` }}
    >
      <div className="w-full max-w-md text-white space-y-6">
        {/* Back button and header */}
        <div className="flex items-center">
          <button 
            onClick={() => onBack()}
            className="text-white p-2 rounded-full hover:bg-white/20"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold ml-4">User ID Access</h2>
        </div>

        {/* Input fields styled like JobOpportunity items */}
        <div className="space-y-4">
          {/* User ID Field */}
          <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
            <label className="text-white font-semibold text-sm block">User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
              placeholder="Enter your user ID"
            />
          </div>

          {/* Phone Number Field */}
          <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
            <label className="text-white font-semibold text-sm block">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Email Field */}
          <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
            <label className="text-white font-semibold text-sm block">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Verify button */}
        <button 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          onClick={() => console.log(formData)}
        >
          Verify Information
        </button>
      </div>
    </div>
  );
};

export default UserAccessPage;