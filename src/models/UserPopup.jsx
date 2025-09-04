import React, { useState } from 'react';
import { FaChevronUp, FaTimes } from 'react-icons/fa';
import job from '../Assets/jonoprtunity.png';
import ConfirmModal from './ConfirmModal';
import axios from 'axios'; 
// import BASE_URL from '../utils/Urls';

const UserPopup = ({ onClose }) => {
const BASE_URL= "http://localhost:8080/api/v1";
  const [showMain, setShowMain] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [onboardingFee, setOnboardingFee] = useState('');
  const [group, setGroup] = useState(''); 

  const handleCreateAccount = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/users/admin`, {
        user_id: userId,
        phone_number: phoneNumber,
        email,
        onboarding_fee: Number(onboardingFee),
        group, 
      });

      console.log("✅ User created:", response.data);
      alert("User Created Successfully, thank you");
      setShowConfirm(true);
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "❌ Failed to create user");
      } else {
        alert("❌ Error: " + err.message);
      }
    }
  };

  const handleCloseAll = () => {
    setShowMain(false);
    setShowConfirm(false);
    onClose?.();
  };

  return (
    <>
      {showMain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="relative rounded-3xl shadow-xl w-full max-w-md overflow-hidden  mt-5"
            style={{ backgroundImage: `url(${job})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-sm z-10 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            
            <div className="relative p-6 my-5">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-1">USER ID</label>
                  <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
                    <input 
                      type="text" 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                      placeholder="Enter user ID"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-semibold mb-1">Ph number</label>
                  <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                      placeholder="Enter Phone  number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-semibold mb-1">EMAIL</label>
                  <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-1">GROUP</label>
                  {/* <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
                    <input 
                      type="text" 
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                      placeholder="Enter group name"
                    />
                  </div> */}
                    <div>
                      <div className="border border-white rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md">
                        <select
                          value={group}
                          onChange={(e) => setGroup(e.target.value)}
                          className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                        >
                          <option value="" disabled className="text-black">Select a group</option>
                          <option value="Hyderabad" className="text-black">Hyderabad</option>
                          <option value="Goa" className="text-black">Goa</option>
                          <option value="Mumbai" className="text-black">Mumbai</option>
                          <option value="Delhi" className="text-black">Delhi</option>
                          <option value="Chennai" className="text-black">Chennai</option>
                          <option value="Bangalore" className="text-black">Bangalore</option>
                        </select>
                      </div>
                    </div>

                </div>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <p className="text-white text-lg font-bold text-center">
                  Onboarding/Diagrama verification fee
                </p>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="w-44 h-20">
                  <input
                    type="number"
                    value={onboardingFee}
                    onChange={(e) => setOnboardingFee(e.target.value)}
                    className="w-full h-full px-3 py-2 text-sm border-2 border-dashed border-red-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500
                      bg-gray-400 placeholder:text-center placeholder:text-slate-50 text-white text-center"
                    placeholder="Amount"
                  />
                </div>
              </div>
              
              <div className='flex items-center justify-center mb-6 text-white text-lg font-bold'>
                <FaChevronUp />
              </div>

              <button 
                onClick={handleCreateAccount}
                className="w-full bg-green-500 border-2 border-white text-white font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          onYes={handleCloseAll}
          onNo={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default UserPopup;