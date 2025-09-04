/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import job from "../Assets/jonoprtunity.png";
import { FaAngleUp, FaCaretDown, FaCheck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { PiFlagPennantFill, PiWarningCircleFill } from "react-icons/pi";
import activeimg from '../Assets/active-img.png';
import camera from '../Assets/camera.png'
import selfi from '../Assets/selfi.png';
import { FaCamera } from "react-icons/fa6";
import BASE_URL from '../utils/Urls';

export default function ProcessingPopup({onClose, user = {}})  {
    console.log("user", user);
    const [currentPage, setCurrentPage] = useState("main");
    const [activeStep, setActiveStep] = useState(null);
    const [isClose,setIsClose]=useState(true)
      const steps = [
    { label: "User iD Access", status: "complete" },
    { label: "Profile photo upload", status: "complete" },
    { label: "Details fillup", status: "in-progress" },
    { label: "Documents upload", status: "in-progress" },
    { label: "Onboarding/baground verification fee", status: "pending" },
  ];
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);

  // ✅ Fetch coupon on mount
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchCoupon = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/coupon/${user.user_id}`
        //   `http://localhost:8080/api/v1/admin/coupon/${user.user_id}`
        );

        if (response.data?.result?.length > 0) {
          setCouponData(response.data.result[0]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch coupon:", err.message);
      }
    };

    fetchCoupon();
  }, [user?.user_id]);
//   const fetchCoupon = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/admin/coupon/${user.user_id}`
//         //   `http://localhost:8080/api/v1/admin/coupon/${user.user_id}`
//         );

//         if (response.data?.result?.length > 0) {
//           setCouponData(response.data.result[0]);
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch coupon:", err.message);
//       }
//     };

   
  // Format date & time
const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const dateObj = new Date(isoString);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString();
  return `${date} - ${time}`;
};

// Calculate expiry = created_at + 10 days
const getExpiryDate = (isoString) => {
  if (!isoString) return "";
  const dateObj = new Date(isoString);
  dateObj.setDate(dateObj.getDate() + 10); // add 10 days
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString();
  return `${date} - ${time}`;
};

   const handleCouponSubmit = async () => {
        if (!couponCode.trim()) {
            alert("⚠️ Please enter a coupon code");
            return;
        }

        // ✅ Validation: only a-e (case insensitive) and numbers 0-9
        const validPattern = /^[a-eA-E0-9]+$/;
        if (!validPattern.test(couponCode)) {
            alert("⚠️ Coupon code must contain only letters (a-e) and numbers (0-9)");
            return;
        }

        try {
            const response = await axios.post(
            `${BASE_URL}/admin/coupon/${user.user_id}`,
            { coupon_code: couponCode }
            );

            alert(`✅ ${response.data.message}`);
            setCouponCode(""); // clear input after success
        } catch (err) {
            if (err.response) {
            // Backend responded with an error
            alert(`❌ ${err.response.data.message}`);
            } else {
            // Network or unexpected error
            alert("❌ Error submitting coupon: " + err.message);
            }
        }
   };
  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
      if (stepIndex === 0) {
        setCurrentPage("userAccess");
      }else if (stepIndex === 1) {
       if (steps[stepIndex].status !== "pending") {
        setCurrentPage("photoUpload");
      }else if (stepIndex === 2) {
        setCurrentPage("details");
      }else if (stepIndex === 3) {
        setCurrentPage("documents");
      }
    }
  };
  const progress = 80;

  const handleStartDuty = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/users/admin/approve/${user.user_id}`,
      { approved: [5, 6] }
    );

    if (response.status === 200 || response.status === 201) {
      alert("✅ Duty started successfully!");
      onClose(); // close popup
    } else {
      alert("⚠️ Failed to start duty, please try again.");
    }
  } catch (err) {
    if (err.response) {
      alert(`❌ ${err.response.data.message}`);
    } else {
      alert("❌ Error starting duty: " + err.message);
    }
  }
};


  return (
    <div className="fixed inset-0 flex flex-col items-center rounded-lg w-full top-0 bottom-0 overflow-y-auto bg-black bg-opacity-50 animate-[slideDown_0.3s_ease-in-out] origin-top"       
     style={{
        maxWidth: '940px',
        boxSizing:"border-box",
        margin: "0 auto",
        padding:"20px 0 50px 0",
        backgroundColor: '#B100AE',
        }}>
        <div className="flex items-center justify-center">
            <div className="flex items-center">
                <div className="w-[624px] h-[106px] rounded-lg bg-white flex items-center justify-center">
                    <span className="text-[#B100AE] font-bold text-[80px]">Training....</span>
                </div>
                <button  onClick={() =>{onClose()}}
                  className="w-[105px] h-[108px] bg-[#FF0E12] border-black flex items-center justify-center rounded-lg ml-20 mb-20">
                    <IoClose className="text-white w-[54px] h-[55px]" />
                </button>
            </div>
        </div>
        <div className="flex items-center justify-center gap-10">
            <div className="w-[300px] h-[378px] bg-[#A44143]">
                <div className="flex items-center justify-center mt-2 mb-5 gap-5">
                    <div className="flex items-center justify-center w-[206px] h-[34px] bg-white rounded-lg">
                        <span className="text-[#A44143] text-[31px] ">UN VERIFIED</span>
                    </div>
                    <div
                        className="w-7 h-7 bg-[#FF0505] rounded-lg flex items-center justify-center">
                        <IoClose  className="text-white w-6 h-6"/>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-5">
                    {/*Card 1*/}
                    <div
                        className="w-[64px] h-[114px] bg-cover bg-center flex justify-center items-center px-1 py-2 mt-4 border-2 border-white rounded-lg"
                        style={{ backgroundImage: `url(${job})` }}
                    >
                    <div className="flex flex-col">
                        <div className="w-[44px] h-[30px] bg-white rounded-lg">
                            <div className="w-[42px] h-[28px] border border-gray-300 rounded-md mt-[1px] ml-[1px] flex items-center flex-col">
                                    <p className="text-[1.2px] font-semibold mt-[0.5px] flex items-center">Start Earning Now-Limited position jobs Only!</p>
                                    <p className="text-red-500 text-[1.2px]">(Jobs are limited and given on a first-come, first-served basis.)</p>
                                    <div className="flex items-start space-x-1 mt-[1px]">
                                        <span className="text-[4px]">👉</span>
                                        <p className="text-[2px] font-bold">
                                        Be among the first to secure your job spot and start getting job
                                        details!
                                        </p>
                                    </div>
                                    <div className="flex items-start space-x-1">
                                        <span className="text-[4px]">👎</span>
                                        <p className="text-[2px] font-bold">Once the limit is reached, onboarding access will be closed.</p>
                                    </div>
                                    <p className="flex items-center space-x-1 mt-[1px]">
                                        <PiWarningCircleFill className="w-[4px] h-[4px] text-red-500 ml-[2px]" />
                                        <span className="text-[2px] font-semibold">Don't miss out act fast before it's too late!</span>
                                    </p>
                                </div>
                            </div>
                        
                            {/* Steps with connecting vertical line */}
                            <div className="relative">
                                {steps.length > 1 &&(
                                    <div className="absolute left-[6px] top-[5px] bottom-[5px] w-[0.5px] bg-gray-300 z-10">
                                        <div className="h-full w-full flex flex-col">
                                            {steps.slice(0,-1).map((step, index) => {
                                                const nextStep = steps[index + 1];
                                                if (!nextStep) return null;
                                                const lineColor =
                                                step.status === "complete" &&
                                                (nextStep.status === "complete" ||
                                                    nextStep.status === "in-progress")
                                                    ? "bg-green-400"
                                                    : "bg-pink-400";

                                                return (
                                                <div key={index} className="flex-1 w-full">
                                                    <div className={`w-[0.1px] h-full mx-auto ${lineColor}`} />
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {/* Step Items */}
                                <div className="relative flex flex-col space-y-1 z-0">
                                    {steps.map((step, index) => (
                                    <div key={index} onClick={() => handleStepClick(index)}>
                                    <StepItem label={step.label} status={step.status} isLast={index === steps.length - 1}/>
                                    </div>    
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Card 2*/}
                    <div className="flex flex-col items-center">
                        <div className="w-[52px] h-[18px] flex items-center justify-center">
                            <span className="text-[#5E4040] text-[12px] font-extrabold">Account FILLED</span>
                        </div>
                        <div className="w-[58.5px] h-[47.5px] bg-cover bg-center rounded-lg flex items-center justify-center my-2"
                        style={{ backgroundImage: `url(${job})` }}>
                            <div className="space-y-[2px] my-2">
                                <div>
                                <label className="block text-white text-[2.5px] font-bold mb-[1px]">USER ID</label>
                                    <div className="border border-white rounded-sm w-[44.5px] h-[5.5px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="text" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"                
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                <label className="block text-white text-[2.5px] font-bold mb-[1px]">Ph number</label>
                                <div className="border border-white rounded-sm w-[44.5px] h-[5.5px] bg-white/10 backdrop-blur-md">
                                <input 
                                    type="tel" 
                                    className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                    placeholder=""
                                />
                                </div>
                                </div>
                                
                                <div>
                                <label className="block text-white text-[2.5px] font-bold mb-[1px]">EMAIL</label>
                                    <div className="border border-white rounded-sm w-[44.5px] h-[5.5px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="email" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-[10px] text-[#0000FF] font-extrabold">
                            <span>Date(12/01/2025)</span>
                            <span>Time[21:33:17]</span>
                        </div>
                    </div>
                     {/*Card 3*/}
                    <div className="flex flex-col items-center">
                        <div className="w-11 h-2 bg-white text-[#581717] rounded-lg text-[4px] flex items-center justify-center">USER ID ACCESS</div>
                        <div className="w-[58px] h-[104px] bg-cover bg-center rounded-lg flex items-center flex-col mt-2"
                            style={{ backgroundImage: `url(${job})` }}>
                            <div className="space-y-[2px] mt-5">
                                <div>
                                <label className="block text-white text-[2.5px] font-bold mb-1">USER ID</label>
                                    <div className="border border-white rounded-sm w-[44.5px] h-[5.5px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="text" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"                
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                <label className="block text-white text-[2.5px] font-bold mb-1">Ph number</label>
                                <div className="border border-white rounded-sm w-[44.5px] h-[5.5px] bg-white/10 backdrop-blur-md">
                                <input 
                                    type="tel" 
                                    className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                    placeholder=""
                                />
                                </div>
                                </div>
                                
                                <div>
                                <label className="block text-white text-[2.5px] font-bold mb-1">EMAIL</label>
                                    <div className="border border-white rounded-sm w-[44.5px] h-[5.5px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="email" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col mt-5 items-center">
                                {/* <span><FaAngleUp className="w-6 h-6 text-white" /></span> */}
                            <button className="w-[43.5px] h-[8.5px] bg-[#78FF47] text-[5px] rounded-lg 
                                flex items-center justify-center border border-white text-white">
                                Matched
                            </button>
                            </div>
                        </div>
                        <div className="w-14 h-2 bg-[#FC0A0A] text-[#FFFFFF] font-bold rounded-lg text-[4px] flex items-center justify-center mt-2">USER ID ACCESS</div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-5">
                   {/*Card 1*/}
                    <div className="flex flex-col items-center mt-5">
                        <div className="w-11 h-2 bg-white text-[#581717] rounded-full text-[4px] flex items-center justify-center">Profile photo upload</div>
                        <div 
                        className="w-[56px] h-[100px] bg-cover bg-center flex flex-col items-center rounded-lg mt-2"
                        style={{ backgroundImage: `url(${selfi})` }}>
                        <div className="flex flex-col items-center mt-3">
                            <img src={activeimg} alt="" className="w-[34px] h-[34px]" />
                            <img src={camera} alt="" className="mt-3 w-[13px] h-[13px]" />
                            <div className="w-10 h-2 text-[5px] font-bold flex items-center justify-center bg-[#78FF47] text-white rounded-lg mt-3">
                                ACCEPT
                            </div> 
                        </div>
                    </div>
                    <div className="w-12 h-2 text-[4px] bg-[#FC0A0A] text-[#FFFFFF] font-bold rounded-lg flex items-center justify-center mt-2">REJECT</div>
                </div>
                    {/*Card 2*/}
                    <div className="flex flex-col items-center mt-5">
                        <div className="w-11 h-2 bg-white text-[#581717] rounded-full text-[4px] flex items-center justify-center">Details fillup</div>
                        <div className="w-[59px] h-[105px] bg-cover bg-center rounded-lg flex items-center flex-col mt-[2px]"
                            style={{ backgroundImage: `url(${job})` }}>
                            <div className="space-y-[2px] mt-1">
                                <div>
                                <label className="block text-white text-[2.5px] font-bold">AADHAR NO.</label>
                                    <div className="border border-white rounded-sm w-11 h-[6px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="text" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"                
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                <label className="block text-white text-[2.5px] font-bold">EMPLOYER NAME</label>
                                <div className="border border-white rounded-sm w-11 h-[6px] bg-white/10 backdrop-blur-md">
                                <input 
                                    type="tel" 
                                    className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                    placeholder=""
                                />
                                </div>
                                </div>
                                
                                <div>
                                    <label className="block text-white text-[2.5px] font-bold">PAN CARD details</label>
                                    <div className="border border-white rounded-sm w-11 h-[6px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="email" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-white text-[2.4px] font-bold">IFSC CODE</label>
                                    <div className="border border-white rounded-sm w-11 h-[6px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="email" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-white text-[2.5px] font-bold">BANK ACCOUNT NO.</label>
                                    <div className="border border-white rounded-sm w-11 h-[6px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="email" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-white text-[2.5px] font-bold">NOMINEE NAME</label>
                                    <div className="border border-white rounded-sm w-11 h-[6px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="email" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-white text-[2.5px] font-bold">NOMINEE Ph NO.</label>
                                    <div className="border border-white rounded-sm w-11 h-[6px] bg-white/10 backdrop-blur-md">
                                        <input 
                                            type="email" 
                                            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center mt-[2px]">
                                <div className="flex items-center justify-center space-x-2 ml-1 mb-[2px]">
                                    <input 
                                        type="checkbox" 
                                        id="terms-checkbox"
                                    className="w-1 h-1 border-2 border-gray-300 rounded focus:ring-0 bg-transparent checked:bg-blue-500"
                                    />
                                    <label htmlFor="terms-checkbox" className="text-[1.5px] text-white">
                                        By signing up you agree to our <a href="#" className="text-[#F61616]">Terms & Conditions</a> and Company Privacy Policy
                                    </label>
                                    </div>
                                <button className="w-11 h-2 text-[5px] bg-[#78FF47] text-white font-bold rounded-lg border border-white">
                                DETAILS VALID
                                </button>
                            </div>
                        </div>
                        <div className="w-10 h-[6px] bg-[#FC0A0A] text-[#FFFFFF] font-bold rounded-lg text-[4px] flex items-center justify-center mt-2">DETAILS REJECT</div>
                    </div>
                    {/*Card 3*/} 
                    <div className="flex flex-col items-center mt-5">
                        <div className="w-11 h-2 bg-white text-[#581717] rounded-full text-[4px] flex items-center justify-center">Documents upload</div>
                        <div 
                            className="w-[58px] h-[103px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-lg mt-[2px]"
                            style={{ backgroundImage: `url(${job})` }}>
                                <div className="flex items-center flex-col mt-1">
                                    <h3 className="font-bold mb-1 text-white text-[3px]">Upload Aadhar Card</h3>
                                    <div className="flex items-center gap-2">
                                    {/* Front Camera */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-medium text-[2.5px] tracking-wider mb-[2px]">Front</span>
                                        <div className="relative">
                                        {/* Camera background circle */}
                                        <div className="w-4 h-4 rounded-lg bg-white/20 flex items-center justify-center border border-white">
                                            {/* Camera icon - properly centered */}
                                            <FaCamera className="text-white text-xs"/>
                                        </div>
                                        </div>
                                    </div>

                                    {/* Back Camera */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-medium text-[2.5px] tracking-wider mb-[2px]">Back</span>
                                        <div className="relative">
                                        <div className="w-4 h-4 rounded-lg bg-white/20 flex items-center justify-center border border-white">
                                            <FaCamera className="text-white text-xs" />
                                        </div>
                                        {/* Optional: Inactive state */}
                                        <div className="absolute inset-0 rounded-full bg-black/30"></div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="flex items-center flex-col mt-1">
                                    <h3 className="font-semibold mb-1 text-white text-[3px]">Upload PAN Card PHOTO</h3>
                                    <div className="flex items-center gap-2">
                                    {/* Front Camera */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-medium text-[2.5px] tracking-wider mb-[2px]">FRONT</span>
                                        <div className="relative">
                                        {/* Camera background circle */}
                                        <div className="w-4 h-4 rounded-lg bg-white/20 flex items-center justify-center border border-white">
                                            {/* Camera icon - properly centered */}
                                            <FaCamera className="text-white text-xs" />
                                        </div>
                                        </div>
                                    </div>

                                    {/* Back Camera */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-medium text-[2.5px] tracking-wider mb-[2px]">BACK</span>
                                        <div className="relative">
                                        <div className="w-4 h-4 rounded-lg bg-white/20 flex items-center justify-center border border-white">
                                            <FaCamera className="text-white text-xs" />
                                        </div>
                                        {/* Optional: Inactive state */}
                                        <div className="absolute inset-0 rounded-full bg-black/30"></div>
                                        </div>
                                    </div>
                                    </div>
                                    <p className="text-red-500 text-[2px] font-bold text-center max-w-full mt-1">
                                        The details on the document should be clearly visible while uploading the picture
                                    </p>
                                    <div className="w-11 h-2 text-[5px] text-white font-bold flex items-center justify-center bg-[#78FF47] border border-white rounded-lg mt-1">
                                        CLARITY
                                    </div>
                                </div>
                        </div>
                        <div className="w-14 h-2 bg-[#FC0A0A] text-[#FFFFFF] font-bold rounded-lg text-[4px] flex items-center justify-center mt-2">REJECT</div>
                    </div>
                    {/*Card 4*/}
                    <div className="flex flex-col items-center mt-5">
                        <div className="w-11 h-2 bg-white text-[#581717] rounded-full text-[2px] flex items-center justify-center">Onboarding/baground verification fee</div>
                        <div className="w-14 h-[60px] flex flex-col items-center justify-center rounded-lg mt-2 bg-[#FFFAFA] border border-[#2FFC0A]">
                            <div className="w-8 h-3 flex items-center justify-center mt-2">
                                <span className="font-bold text-[4.5px] ml-2">PAYMENT DETAILS</span>
                            </div>
                            <div className="flex justify-center items-center">
                                <FaCheck className="text-[20px] text-[#00FF00]" />
                            </div>
                            <div className="w-10 h-3 bg-[#D9D9D9] rounded-lg flex items-center justify-center mt-">
                                <span className="font-bold text-[9px]">PAID</span>
                            </div>
                        </div>
                        <div className="w-9 h-3 bg-[#F90D0D] text-[3px] text-white font-bold
                          flex items-center justify-center mt-5 border-1 border-gray-100"
                          style={{borderRadius:"50%"}}>
                            PAYMENT REFLECTED
                        </div>
                        <div className="w-12 h-2 bg-[#000000] text-[#FFFFFF] font-bold rounded-lg text-[4px] flex items-center justify-center mt-3">NOT PAID</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="text-[1rem] w-[394px] h-[122px] bg-[#AF7070] border-4 border-black rounded-[1em] 
                    text-white font-bold transition-all duration-400 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] shadow-[-5px_5px_0px_0px_#000] 
                    hover:shadow-[-7px_7px_0px_0px_#000] active:shadow-[-3px_3px_0px_0px_#000]
                    active:translate-y-1 active:translate-x-1 my-10">
                    <span className="flex items-center justify-center text-[62px] font-bold">view details</span>
                </div>
                <div className=" w-60 h-10 text-3xl flex flex-col items-center justify-center text-white font-bold mb-10">
                    <span>Date(12/01/2025)</span>
                    <span>Time[21:32:17]</span>
                </div>
                <div className="w-52 h-14 bg-[#D9D9D9] text-black font-extrabold text-5xl
                  flex items-center justify-center rounded-lg mb-10">
                    DAYS
                </div>
                <div className="w-32 h-32 rounded-full border-2 border-black bg-white">
                  8                      
                </div>
            </div>
        </div>
        <div className="relative w-[594px] max-w-xl mx-auto my-20">
            <div className="flex items-start justify-start gap-2 my-5">
                    <input
                        type="text"
                         value={couponCode}
                         onChange={(e) => setCouponCode(e.target.value)}
                         placeholder="Enter Coupon Code"
                         className="w-60 h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    />
                    <button onClick={handleCouponSubmit}
                        className="px-5 h-10 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition"
                    >
                        Submit
                    </button>
            </div>
            {/* Progress Bar Background */}
            <div className="h-[59px] bg-green-600 rounded-full relative border-4 border-white">
                {/* Golf Ball */}
                <div
                className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-gray-300"
                style={{ left: `${progress}%` }}
                />
                {/* Hole with Flag */}
                <div className="absolute right-7  w-6 h-6">
                <div className="w-[50px] h-[50px] bg-black rounded-full mx-auto mb-1" />
                <div className="-mt-28">
                    <PiFlagPennantFill className="text-6xl text-red-500"/>
                    </div>
                </div>
            </div>
            {/* Progress Indicator */}
            <div
                className="absolute -top-4 font-bold text-red-600 text-4xl"
                style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            >
                <span className="text-xl">{progress}%</span> <FaCaretDown /> 
            </div>
        </div>

        {couponData && (
            <div className="flex flex-col items-center mb-5">
                <p className="text-white text-xl font-bold">
                Coupon: <span className="text-yellow-300">{couponData.coupon_code}</span>
                </p>
                <p className="text-white text-md">
                Created At: {formatDateTime(couponData.created_at)}
                </p>
                <p className="text-green-300 text-md font-semibold">
                Coupon valid up to: {getExpiryDate(couponData.created_at)}
                </p>
            </div>
            )}


        <button 
         onClick={handleStartDuty}
        className="w-[400px] h-[200px] rounded-full border-2 border-yellow-500 bg-gradient-to-b from-green-500 to-green-700 shadow-md hover:from-green-400 hover:to-green-600 transition-all">
            <span className="text-6xl text-white font-bold">START DUTY</span>
        </button>

    </div>
  );
};
const StepItem = ({ label, status, isLast }) => {
  const icon = {
    complete: <FaCheckCircle className="text-green-400 w-[2px] h-[2px]" />,
    "in-progress": (
      <div className="w-[1.5px] h-[1.5px] rounded-full bg-green-400 border-2 border-white" />
    ),
    pending: <FaTimesCircle className="text-red-400 w-[1.5px] h-[1.5px]" />,
  }[status];

  return (
    <div className="relative flex items-center w-[48px] h-[7px] space-y-1">
      {/* Status Icon */}
      {/* <div className="absolute left-[-5px] w-[4px] h-[4px] border border-white">
        {icon}
       </div> */}
        <div className="absolute left-1 mt-1 z-20 bg-black rounded-full w-[4px] h-[4px] flex items-center justify-center border border-white">
        {icon}
      </div>

      {/* Step Label Box — THIS IS THE PART TO UPDATE */}
      <div className="relative flex items-center border border-white rounded-[2px] w-[48px] h-[6px]
         bg-white/10 backdrop-blur-md px-[2px]">
        {/* <span className={`text-white font-semibold ${isLast ? 'text-[6px]' : 'text-[8px] mr-2'}`}>
          {label}
        </span>
        <span className="text-white w-3 h-3 flex items-center absolute right-1">{">"}</span> */}
      </div>
    </div>
  );
};

