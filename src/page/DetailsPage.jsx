import React, { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import job from '../Assets/jonoprtunity.png';

const DetailsFillUpPage = ({onBack}) => {
  const [formData, setFormData] = useState({
    aadharNumber: '',
    employerName: '',
    panCardDetails: '',
    ifscCode: '',
    bankAccountNo: '',
    nomineeName: '',
    nomineePhoneNo: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center px-4 py-10"
      style={{ backgroundImage: `url(${job})` }}
    >
      <div className="w-full max-w-md text-white space-y-6">
        {/* Header with back button */}
        <div className="flex items-center">
          <button 
            onClick={() => onBack()}
            className="text-white p-2 rounded-full hover:bg-white/20"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold ml-4">Details Fill Up</h2>
        </div>

        {/* Form fields with labels above inputs */}
        <div className="space-y-4">
          {/* Aadhar Number */}
          <div className="space-y-1">
            <label className="text-white font-semibold text-sm">Aadhar Number</label>
            <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                placeholder="Enter 12-digit Aadhar number"
              />
            </div>
          </div>

          {/* Employer Name */}
          <div className="space-y-1">
            <label className="text-white font-semibold text-sm">Employer Name</label>
            <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
              <input
                type="text"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                placeholder="Enter employer name"
              />
            </div>
          </div>

          {/* PAN Card Details */}
          <div className="space-y-1">
            <label className="text-white font-semibold text-sm">PAN Card Details</label>
            <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
              <input
                type="text"
                name="panCardDetails"
                value={formData.panCardDetails}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                placeholder="Enter PAN number"
              />
            </div>
          </div>

          {/* IFSC Code */}
          <div className="space-y-1">
            <label className="text-white font-semibold text-sm">IFSC Code</label>
            <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                placeholder="Enter bank IFSC code"
              />
            </div>
          </div>

          {/* Bank Account Number */}
          <div className="space-y-1">
            <label className="text-white font-semibold text-sm">Bank Account No</label>
            <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
              <input
                type="text"
                name="bankAccountNo"
                value={formData.bankAccountNo}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                placeholder="Enter account number"
              />
            </div>
          </div>

          {/* Nominee Name */}
          <div className="space-y-1">
            <label className="text-white font-semibold text-sm">Nominee Name</label>
            <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
              <input
                type="text"
                name="nomineeName"
                value={formData.nomineeName}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                placeholder="Enter nominee name"
              />
            </div>
          </div>

          {/* Nominee Phone No */}
          <div className="space-y-1">
            <label className="text-white font-semibold text-sm">Nominee Phone No</label>
            <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
              <input
                type="tel"
                name="nomineePhoneNo"
                value={formData.nomineePhoneNo}
                onChange={handleChange}
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                placeholder="Enter nominee phone number"
              />
            </div>
          </div>

          {/* Checkbox - positioned below all fields */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="agreeTerms" className="ml-2 text-sm text-white">
              I confirm all the details provided are correct
            </label>
          </div>
        </div>

        {/* Verify button */}
        <button 
          className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-colors ${
            formData.agreeTerms ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400/80 cursor-not-allowed'
          }`}
          disabled={!formData.agreeTerms}
          onClick={handleSubmit}
        >
          VERIFY
        </button>
      </div>
    </div>
  );
};

export default DetailsFillUpPage;