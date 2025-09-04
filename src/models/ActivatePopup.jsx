import React, { useState } from "react";
import axios from "axios";
import { FaBars, FaCamera, FaCaretDown, FaCaretUp, FaComments, FaMapMarkerAlt, FaPhoneAlt, FaPlusCircle, FaStar, FaToggleOff, FaToggleOn} from "react-icons/fa";
import selfi from '../Assets/selfi.png';
import activeimg from '../Assets/active-img.png';
import camera from '../Assets/camera.png'
import job from '../Assets/jonoprtunity.png'
import green from '../Assets/green.png'
import bank from '../Assets/bank.png'
import man from '../Assets/confused_man.png'
import viewAccount from '../Assets/view-account.png'
import Accountstmt from '../Assets/Account-stmt.png'
import blue from '../Assets/purple-blue.png'
import BASE_URL from  '../utils/Urls';
import ImageModal from "./ImageModal";

const ActivatePopup = ({ user, onClose, image }) => {
    const [isToggled, setIsToggled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const email = user?.email || "";
    const aadhar = user?.aadhar_no || "";
    const employerName = user?.name || user?.employer_name || "";
    const pan = user?.pan_card_number || "";
    const ifsc = user?.ifsc_code || "";
    const bank_account_no = user?.bank_account_no || "";
    const nomineeName = user?.nominee_name || "";
    const nomineePhone = user?.nominee_phone_no || "";
    const profile_img = user?.profile_img || user?.profile_img || "";
    const aadhar_front_img = user?.aadhar_front_img || "";
    const aadhar_back_img = user?.aadhar_back_img || activeimg;
    const pan_front_img = user?.pan_front_img || "";
    const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedImage, setSelectedImage] = useState("");
    
        const handleImageClick = (image) => {
            setSelectedImage(image);
            setIsModalOpen(true);
        };
    
        const handleClose = () => {
            setIsModalOpen(false);
            setSelectedImage("");
        };

    // Approve/Reject handlers for profile (code 1) and uploads (code 3)
    const handleApprove = async (code) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            // Replace with your actual API endpoint
            await axios.post(`${BASE_URL}/users/admin/approve/${user.user_id}`, {
                approved: [code]
            });
            setSuccess("Approved successfully");
            alert("Approved Successfully");
        } catch (err) {
            setError("Failed to approve. Try again.");
            alert("Failed to Approve. Try Again");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (code) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            // Replace with your actual API endpoint
            await axios.post(`${BASE_URL}/users/admin/reject/${user.user_id}`, {
                status_codes: [code]
            });
            setSuccess("Rejected successfully");
            alert("Reject Successfully");
        } catch (err) {
            setError("Failed to reject. Try again.");
            alert("Failed to reject. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div 
      className="flex flex-col items-center w-full fixed top-0 bottom-0 overflow-y-auto animate-slideInLeft"
      style={{
        maxWidth: "931px",
        // transformOrigin: "left top",
        boxSizing:"border-box",
        margin: "0 auto",
        padding:"20px 0",
        background: "linear-gradient(to top right, #002E64, #FFFFFF)",
      }}
    >
  
      {/* Top Section */}
        <div className="flex justify-between items-center w-full mb-6 scale-90">
            <div className="flex flex-col items-start">
 
                {/* Star Icon */}
                <div className="relative flex items-center">
                    <FaStar className="text-[#D9D9D9]" style={{ fontSize: '80px' }}/>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaMapMarkerAlt
                            className="text-[#2DE005]" 
                            size={20}  
                        />
                    </div>
                    <div 
                        className="absolute mt-14 w-[132px] h-[72px] flex items-center justify-center">
                        <span className="text-[#43C701] font-bold text-xl">Activate</span>
                    </div>
                </div>
            </div>
            
            {/* Right Side - Triangle with Unactivate */}
           <div className="relative flex flex-col items-center scale-90">
                <div className="w-0 h-0 border-l-[42.5px] border-r-[42.5px] border-b-[136px] border-l-transparent border-r-transparent border-b-[#C86E6E]"></div>
                <div className="mt-[-16px] rounded-full border-2 border-[#FF0E12] bg-white flex items-center justify-center">
                    <span className="text-[#FF0E12] font-bold text-xl">UN Activate</span>
                </div>
            </div>
            {/* X Icon */}
            <div onClick={onClose}
                className="w-[60px] h-[60px] bg-[#FF0707] rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-2xl">X</span>
            </div>
        </div>
       {/* Second Section */}
        <div className="flex items-center justify-between gap-10 mb-5">
            <div 
                className="w-[168px] h-[300px] bg-cover bg-center flex flex-col items-center px-4 py-10 rounded-lg"
                style={{ backgroundImage: `url(${selfi})` }}>
                <div className="flex flex-col items-center">
                    <img src={profile_img} alt="Profile" 
                    onClick={() => handleImageClick(user?.profile_img)}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white" />
                    {/* <img src={activeimg} alt="activeimg" /> */}
                    <img src={camera} alt="camera" className="mt-6" />
                    <div className="flex gap-2 mt-10">
                        <button
                            className="w-[64px] h-[24px] flex items-center justify-center bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition"
                            disabled={loading}
                            onClick={() => handleApprove(1)}
                        >
                            Approve
                        </button>
                        <button
                            className="w-[64px] h-[24px] flex items-center justify-center bg-[#FF0E12] text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
                            disabled={loading}
                            onClick={() => handleReject(1)}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
            <div 
                className="w-[176px] h-[315px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-lg"
                style={{ backgroundImage: `url(${job})` }}>
                <div className="flex items-center flex-col">
                    <h3 className="font-semibold mb-2 text-white text-xs">Upload Aadhar Card</h3>
                    <div className="flex items-center gap-10">
                        {/* Front Image */}
                        <div className="flex flex-col items-center">
                            <span className="text-white font-medium text-[7px] tracking-wider">FRONT</span>
                            <div className="relative">
                                {aadhar_front_img ? (
                                    <img src={aadhar_front_img} alt="Aadhar Front"
                                    onClick={() => handleImageClick(user?.aadhar_front_img)}
                                    className="w-[46px] h-[46px] rounded-lg object-cover border-2 border-white" />
                                ) : (
                                    <div className="w-[46px] h-[46px] rounded-lg bg-white/20 flex items-center justify-center">
                                        <FaCamera className="text-white text-lg" />
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Back Image (no label, just image or camera icon) */}
                        <div className="flex flex-col items-center">
                            <span className="text-white font-medium text-[7px] tracking-wider">Back</span>
                            <div className="relative">
                                {aadhar_back_img ? (
                                    <img src={aadhar_back_img} alt="Aadhar Back" 
                                    onClick={() => handleImageClick(user?.aadhar_back_img)}
                                    className="w-[46px] h-[46px] rounded-lg object-cover border-2 border-white" />
                                ) : (
                                    <div className="w-[46px] h-[46px] rounded-lg bg-white/20 flex items-center justify-center">
                                        <FaCamera className="text-white text-lg" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* PAN Card Upload */}
                <div className="flex items-center flex-col mt-5">
                    <h3 className="font-semibold mb-2 text-white text-xs">Upload PAN Card PHOTO</h3>
                    <div className="flex items-center gap-10">
                        {/* Front Image */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-white font-medium text-[7px] tracking-wider">FRONT</span>
                            <div className="relative">
                                {pan_front_img ? (
                                    <img src={pan_front_img} alt="PAN Front" 
                                    onClick={() => handleImageClick(user?.pan_front_img)}
                                    className="w-[46px] h-[46px] rounded-lg object-cover border-2 border-white" />
                                ) : (
                                    <div className="w-[46px] h-[46px] rounded-lg bg-white/20 flex items-center justify-center">
                                        <FaCamera className="text-white text-lg" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="text-red-500 text-[6px] font-bold text-center max-w-full mt-2">
                        The details on the document should be clearly visible while uploading the picture
                    </p>
                    <div className="flex gap-2 mt-2">
                        <button
                            className="w-[64px] h-[24px] flex items-center justify-center bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition"
                            disabled={loading}
                            onClick={() => handleApprove(3)}
                        >
                            Approve
                        </button>
                        <button
                            className="w-[64px] h-[24px] flex items-center justify-center bg-[#FF0E12] text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
                            disabled={loading}
                            onClick={() => handleReject(3)}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>
                <div 
                    className="w-[192px] h-[342px] bg-cover bg-center flex flex-col px-4 py-4 rounded-lg"
                    style={{ backgroundImage: `url(${green})` }}>
                    <div className="flex justify-between items-center w-full">
                        {/* Menu icon */}
                        <button className="text-white">
                        <FaBars size={20} />
                        </button>
                        
                        {/* Toggle switch */}
                        <button 
                        onClick={() => setIsToggled(!isToggled)}
                        className="text-white"
                        >
                        {isToggled ? (
                            <FaToggleOn size={36} className="text-blue-400" />
                        ) : (
                            <FaToggleOff size={36} className="text-gray-300" />
                        )}
                        </button>
                    </div>
                    <div className="flex flex-col items-center text-white">
                        <div className="text-xs font-bold tracking-wider mb-2">code</div>
                        <button 
                        className="text-white hover:opacity-80 transition-opacity flex items-center justify-center rounded-lg"
                        style={{ width: '50px', height: '25px', background: 'linear-gradient(to bottom, #464399, #E52CB6)' }}
                        >
                        88855
                        </button>
                        <div className="text-[8px] mb-4 tracking-tight text-black mt-2">Valid between 14-04-25 to 05-05-25</div>
                        <div className="w-full">
                        <div className="text-sm font-semibold mb-1">Banked earnings</div>
                            <div 
                                className="w-[92px] h-[12px] bg-cover bg-center flex flex-row gap-2 items-center justify-center rounded-lg"
                                style={{ backgroundImage: `url(${bank})` }}>
                                    {[...Array(6)].map((_, i) => (
                                        <div 
                                        key={i}
                                        className="w-[6px] h-[7px] bg-white border border-black rounded-sm"
                                        />
                                    ))}
                            </div>
                            <div 
                        className="flex items-center bg-white rounded-lg border border-red-200 px-3 py-2 shadow-md w-[136px] h-[63px] relative my-2">
                            <div className=" absolute text-xs text-gray-600 font-medium mb-[47px]">Amount</div>
                            <div className="flex items-center w-full relative justify-between">
                            <div 
                                className="absolute h-[2px] bg-green-500 top-1/2 -translate-y-1/2"
                                style={{
                                left: '16px',  
                                right: '24px',  
                                }}
                            ></div>
                            
                            <div 
                                className="absolute h-[2px] bg-green-500 top-1/2 -translate-y-1/2"
                                style={{ 
                                left: '29px',  
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
                                <span className="text-xs font-bold text-black">550</span>
                                <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-white"></div>
                                <span className="text-xs text-gray-600">11</span>
                            </div>

                            <div className="flex flex-col items-center z-10">
                                <span className="text-xs font-bold text-black">850</span>
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white"></div>
                                <span className="text-xs text-gray-600">13</span>
                            </div>
                            </div>
                            <div className=" absolute text-xs text-gray-600 font-medium mt-[47px]">Accounts</div>
                        </div>
                        
                        </div>
                        {/* Unrooted accounts */}
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-white rounded-lg border-l-2 border-b-2 border-green-500 bg-transparent">
                                <img src={man} alt="" />
                            </div>
                            <p className="text-xs text-white text-bold">Unrooted accounts</p>
                        </div>
                    </div>
                </div>
            {/* card 4 */}
            <div className="w-[181px] h-[241px] bg-cover bg-center flex flex-col items-center px-4 py-4 rounded-lg"
                style={{ backgroundImage: `url(${green})` }}>
                <FaCaretUp className="text-amber-900 self-start ml-5"/>
                <div className="w-[144px] h-[30px] rounded-full bg-amber-900 flex items-center gap-4 px-2">
                    <div className="w-[44px] h-[16px] bg-white rounded-3xl flex items-center justify-center">21</div>
                    <div className="w-[44px] h-[16px] bg-white rounded-3xl flex items-center justify-center">03</div>
                    <div className="w-[44px] h-[16px] bg-white rounded-3xl flex items-center justify-center">1995</div>

                </div>
                <FaCaretDown className="text-amber-900 self-start ml-5"/>
                <div className="w-[84px] h-[20px] flex items-center justify-center bg-[linear-gradient(to_bottom,#464399,#E52CB6)] rounded-lg">
                    <span className="text-sm text-white flex items-center justify-center">G89HG56</span>
                </div>
                <div className="w-[153px] h-[36px] bg-[#F5E4E4] rounded-lg mt-2 px-2 flex flex-col justify-center">
                    <p className="text-green-500 text-[9px] leading-none">Completed tables</p>
                    <div className="flex items-center justify-between">
                        <p className="text-[#E134A4] text-[10px]">####</p>
                        <div className="flex items-center flex-col gap-1">
                        <p className="text-[6px] text-[#FF0E12]">(edited by)</p>
                        <p className="text-[4px] text-[#3021D7]">(12/01/2025)</p>
                        </div>
                    </div>
                </div>
             
                <div className="w-[153px] h-[36px] bg-[#F5E4E4] rounded-lg mt-2 px-2 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <p className="text-green-500 text-[9px] leading-none">Paid payment</p>
                        <div className="flex items-center flex-col">
                            <p className="text-[6px] text-[#3021D7]">(12:25:17)</p>
                            <FaPlusCircle className="text-[10px]"/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[#E134A4] text-[10px]">$$$$$</p>
                        <div className="flex items-center flex-col">
                        <p className="text-[6px] text-[#FF0E12]">(edited by)</p>
                        <p className="text-[4px] text-[#3021D7]">(12/01/2025)</p>
                        </div>
                    </div>
                </div>
                <div className="w-[153px] h-[36px] bg-[#F5E4E4] rounded-lg mt-2 px-2 flex flex-col justify-center">
                    <p className="text-green-500 text-[9px] leading-none">Banked earnings</p>
                    <div className="flex items-center justify-between">
                        <p className="text-[#E134A4] text-[10px]">$$$$$$</p>
                        <div className="flex items-center flex-col gap-1">
                        <p className="text-[6px] text-[#FF0E12]">(edited by)</p>
                        <p className="text-[4px] text-[#3021D7]">(12/01/2025)</p>
                        </div>
                    </div>
                </div>
                <div className="w-[153px] h-[36px] bg-[#F5E4E4] rounded-lg mt-2 px-2 flex flex-col justify-center">
                    <p className="text-green-500 text-[9px] leading-none">Accounts GENERATED</p>
                    <div className="flex items-center justify-between">
                        <p className="text-[#E134A4] text-[10px]">50</p>
                        <div className="flex items-center flex-col gap-1">
                        <p className="text-[6px] text-[#FF0E12]">(edited by)</p>
                        <p className="text-[4px] text-[#3021D7]">(12/01/2025)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Third Section */}
        <div className="flex items-center justify-between gap-10 mb-5">
            {/* card1 */}
            <div 
                className="w-[218px] h-[398px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-lg"
                style={{ backgroundImage: `url(${viewAccount})` }}>
                <div className="flex items-center gap-5 mb-5">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#3a1e0b] font-bold">👤</div>
                <h2 className="text-xs font-bold text-white">View Account</h2>
                </div>
                <div className="space-y-2">
                <input type="text" value={email} placeholder="EMAIL" className="w-full px-3 py-2 text-xs border border-white bg-transparent rounded-lg text-white outline-none placeholder-white/80" readOnly />
                <input type="text" value={aadhar} placeholder="AADHAR NO." className="w-full px-3 py-2 text-xs border border-white bg-transparent rounded-lg text-white outline-none placeholder-white/80" readOnly />
                <input type="text" value={employerName} placeholder="EMPLOYER NAME" className="w-full px-3 py-2 text-xs border border-white bg-transparent rounded-lg text-white outline-none placeholder-white/80" readOnly />
                <input type="text" value={pan} placeholder="PAN CARD" className="w-full px-3 py-2 text-xs border border-white bg-transparent rounded-lg text-white outline-none placeholder-white/80" readOnly />
                <input type="text" value={ifsc} placeholder="IFSC CODE" className="w-full px-3 py-2 text-xs border border-white bg-transparent rounded-lg text-white outline-none placeholder-white/80" readOnly />
                <input type="text" value={bank_account_no} placeholder="BANK ACCOUNT" className="w-full px-3 py-2 text-xs border border-white bg-transparent rounded-lg text-white outline-none placeholder-white/80" readOnly />
                <input type="text" value={nomineeName} placeholder="NOMINEE NAME" className="w-full px-3 py-2 text-xs border border-white bg-transparent rounded-lg text-white outline-none placeholder-white/80" readOnly />
                <input type="text" value={nomineePhone} placeholder="NOMINEE Ph NO." className="w-full px-3 py-2 text-xs border border-white bg-transparent rounded-lg text-white outline-none placeholder-white/80" readOnly />
                </div>
            </div>
            {/* card2 */}
            <div 
                className="w-[179px] h-[340px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-lg"
                style={{ backgroundImage: `url(${Accountstmt})` }}>
                <div className="flex items-center gap-5 mb-2 shadow-[ rgb(107 114 128)]">
                    <FaBars className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#3a1e0b] font-bold"/>
                    <h2 className="text-xs font-bold text-black">View Account</h2>
                </div>
                <div className="flex items-center justify-center gap-2 border-b-2 border-gray-600 w-[112px] mb-3">
                    <span className="text-semibold text-[8px]">All</span>
                    <span className="text-semibold text-[8px]">Paid</span>
                    <span className="text-semibold text-[8px]">Pending</span>
                    <span className="text-semibold text-[8px]">live run</span>
                </div>
                <div className="flex flex-col w-[139px] h-[1.5px] space-y-6">
                    {[...Array(10)].map((_, i) => (
                                        <div 
                                        key={i}
                                        className="border border-[#D399D2] rounded-sm"
                                        />
                                    ))}
                </div>
            </div>
            {/* card3 */}
            <div 
                className="w-[179px] h-[340px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-lg"
                style={{ backgroundImage: `url(${blue})` }}>
                <div className="flex items-center gap-5 mb-2 shadow-[ rgb(107 114 128)]">
                    <FaComments className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#3a1e0b] font-bold"/>
                    <h2 className="text-xs font-bold text-black">Notification </h2>
                </div>
                <div className="flex items-center justify-center gap-2 border-b-2 border-[#988686] w-[112px] mb-3">
                    <span className="text-[#4D4D4D] text-[8px]">ALL</span>
                    <span className="text-[#988686] text-[8px]">UN READ</span>
                    <span className="text-[#988686] text-[8px]">READ</span>
                </div>
                <div className="flex flex-col w-[139px] h-[1.5px] space-y-6">
                    {[...Array(10)].map((_, i) => (
                        <div 
                        key={i}
                        className="border border-[#FFFFFF] rounded-sm"
                        />
                    ))}
                </div>
            </div>
            {/* card4 */}
            <div 
                className="w-[152px] h-[231px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-tl-3xl rounded-tr-3xl bg-gray-200">
                    <div className="w-[85px] h-[15px] flex items-center  bg-yellow-800 rounded-full border-2 border-black justify-center gap-2">
                        <span className="text-[7px] text-black w-[20px] h-[10px] rounded-full boder-1 border-black bg-white flex items-center justify-center">21</span>
                        <span className="text-[7px] text-black w-[20px] h-[10px] rounded-full boder-1 border-black bg-white flex items-center justify-center">03</span>
                        <span className="text-[7px] text-black w-[20px] h-[10px] rounded-full boder-1 border-black bg-white flex items-center justify-center">1995</span>

                    </div>
                    <div className="flex flex-col w-[139px] h-[1.5px] space-y-3">
                    {[...Array(7)].map((_, i) => (
                        <div 
                        key={i}
                        className="border border-b-[#FFFFFF] rounded-sm flex items-center justify-end"
                        ><FaPhoneAlt className="w-4 h-4 rounded-full text-white bg-green-700 text-[8px]"/></div>
                    ))}
                </div>
            </div>
        </div>
        <div className="w-[611px] h-[64px] bg-[#FF0E12] rounded-lg flex items-center justify-center">
            <span className="text-white text-bold flex items-center">DEACTIVATE ACCOUNT</span>
        </div>
         <ImageModal
            imageUrl={selectedImage}
            isOpen={isModalOpen}
            onClose={handleClose}
          />         
        {/* Feedback messages */}
        {(error || success) && (
            <div className={`mt-4 text-center text-sm font-bold ${error ? "text-red-600" : "text-green-600"}`}>
                {error || success}
            </div>
        )}
    </div>
  );
};

export default ActivatePopup;