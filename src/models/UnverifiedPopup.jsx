
import { IoClose } from "react-icons/io5";
import job from "../Assets/jonoprtunity.png";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaAngleUp, FaCheck, FaCamera, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import activeimg from '../Assets/active-img.png';
import camera from '../Assets/camera.png'
import selfi from '../Assets/selfi.png';
import BASE_URL from "../utils/Urls";
import ImageModal from "./ImageModal";
export default function UnverifiedPopup({ user = {}, onClose, image }) {
    // console.log("data-UnverifiedPopup", user)

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
    const [currentPage, setCurrentPage] = useState("main");
    const [activeStep, setActiveStep] = useState(null);
    //   const [user, setUser] = useState(null);
    const [statusCodes, setStatusCodes] = useState([]);
    const [approvedCodes, setApprovedCodes] = useState([]);
    const [rejectedCodes, setRejectedCodes] = useState([]);
    const [previewImg, setPreviewImg] = useState(null);
    const steps = [
        // { label: "User iD Access", status: "complete" },
        { label: "Profile photo upload", status: "complete" },
        { label: "Details fillup", status: "in-progress" },
        { label: "Documents upload", status: "in-progress" },
        { label: "Onboarding/background verification fee", status: "pending" },
    ];

    useEffect(() => {
        if (user?.approved) {
            setApprovedCodes(user.approved);
        }
        if (user?.rejected) {
            setRejectedCodes(user.rejected);
        }
    }, [user]);
    useEffect(() => {
        const required = [1, 2, 3, 4];
        if (required.every(code => approvedCodes.includes(code))) {
            onClose && onClose();
        }
    }, [approvedCodes, onClose]);
    // ✅ Approve step
    const handleApprove = async (stepCode) => {
        try {
            // Block if already rejected
            if (rejectedCodes.includes(stepCode)) return;

            const updated = [...approvedCodes, stepCode];
            setApprovedCodes(updated);

            await axios.post(
                `${BASE_URL}/users/admin/approve/${user.user_id}`,
                { approved: updated }
            );
            alert("Approved Successfully");
        } catch (err) {
            console.error("Error approving:", err);
        }
    };

    // ✅ Reject step
    const handleReject = async (stepCode) => {
        try {
            // Block if already approved
            if (approvedCodes.includes(stepCode)) return;

            const updated = [...rejectedCodes, stepCode];
            setRejectedCodes(updated);

            await axios.post(
                `${BASE_URL}/users/admin/reject/${user.user_id}`,
                { status_codes: updated }
            );
            alert("Rejected Successfully")
        } catch (err) {
            console.error("Error rejecting:", err);
        }
    };

    const handleStepClick = (stepIndex) => {
        if (steps[stepIndex].status !== "pending") {
            setActiveStep(stepIndex);
            if (stepIndex === 0) setCurrentPage("userAccess");
            else if (stepIndex === 1) setCurrentPage("photoUpload");
            else if (stepIndex === 2) setCurrentPage("details");
            else if (stepIndex === 3) setCurrentPage("documents");
        }
    };


    return (
        <div className="fixed inset-0 flex flex-col items-center w-full top-0 bottom-0 overflow-y-auto bg-black bg-opacity-50 animate-[slideDown_0.3s_ease-in-out] origin-top" style={{
            maxWidth: '940px',
            boxSizing: "border-box",
            margin: "0 auto",
            padding: "20px 0 50px 0",
            backgroundColor: '#A44143',
        }}>
            <div className=" flex items-center justify-end gap-20 mt-5">
                <div className="flex items-center justify-center w-[644px] h-[106px] bg-white rounded-lg">
                    <span className="text-[#A44143] text-[98px] ">UN VERIFIED</span>
                </div>
                <div onClick={() => { onClose() }
                }
                    className="w-20 h-20 bg-[#FF0505] rounded-lg flex items-center justify-center">
                    <IoClose className="text-white w-14 h-14" />
                </div>
            </div>
            <div className="flex items-center justify-center mt-10">
                {/* card 1 */}
                <div
                    className="w-[200px] h-[357px] bg-cover bg-center flex justify-center items-center px-4 py-10 mt-10
                border-4 border-white rounded-lg"
                    style={{ backgroundImage: `url(${job})` }}
                >
                    <div className="flex flex-col">
                        <div className="w-[140px] h-[97px] bg-white rounded-lg">
                            <div className="w-[136px] h-[92px] border border-gray-300 rounded-md mt-[2px] ml-[2px] flex items-center flex-col">
                                <p className="text-[3px] font-semibold mt-1 flex items-center">Start Earning Now-Limited position jobs Only!</p>
                                <p className="text-red-500 text-[3px]">(Jobs are limited and given on a first-come, first-served basis.)</p>
                                <div className="flex items-start space-x-2 mt-3">
                                    <span className="text-[8px]">👉</span>
                                    <p className="text-[6px] font-bold">
                                        Be among the first to secure your job spot and start getting job
                                        details!
                                    </p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <span className="text-[8px]">👎</span>
                                    <p className="text-[6px] font-bold">Once the limit is reached, onboarding access will be closed.</p>
                                </div>
                                <p className="flex items-center space-x-2 mt-4">
                                    <PiWarningCircleFill className="w-2 h-2 text-red-500" />
                                    <span className="text-[3px] font-semibold">Don't miss out act fast before it's too late!</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            {/* Steps with connecting vertical line */}
                            <div className="relative">
                                {steps.length > 1 && (
                                    <div className="absolute left-3 top-5 bottom-5 w-[2px] bg-gray-300 z-10">
                                        <div className="h-full w-full flex flex-col">
                                            {steps.slice(0, -1).map((step, index) => {
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
                                                        <div className={`w-[2px] h-full mx-auto ${lineColor}`} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {/* Step Items */}
                                <div className="relative flex flex-col space-y-5 z-0">
                                    {steps.map((step, index) => (
                                        <div key={index} onClick={() => handleStepClick(index)}>
                                            <StepItem label={step.label} status={step.status} isLast={index === steps.length - 1} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Card 2*/}
                <div className="flex flex-col items-center">
                    <div className="w-[331px] h-[56px] flex items-center justify-center">
                        <span className="text-[#FFFFFF] text-[37px] font-extrabold">Account FILLED</span>
                    </div>
                    <div className="w-[183px] h-[149px] bg-cover bg-center rounded-lg flex items-center justify-center my-6"
                        style={{ backgroundImage: `url(${job})` }}>
                        <div className="space-y-2 mb-2">
                            <div>
                                <label className="block text-white text-[7px] font-bold mb-1">USER ID</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="text"
                                        value={user?.user_id || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white text-[7px] font-bold mb-1">Ph number</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="tel"
                                        value={user?.phone_number || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white text-[7px] font-bold mb-1">EMAIL</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-3xl text-[#FFFFFF] font-extrabold">
                        <span>Date({user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString("en-GB") : "N/A"})</span>
                        <span>Time[{user?.joinedDate ? new Date(user.joinedDate).toLocaleTimeString("en-GB") : "N/A"}]</span>
                    </div>
                </div>
                {/*Card 3*/}
                <div className="flex flex-col items-center">
                    <div className="w-28 h-5 bg-white text-[#581717] rounded-full text-xs flex items-center justify-center">USER ID ACCESS</div>
                    <div className="w-[183px] h-[327px] bg-cover bg-center rounded-lg flex items-center flex-col mt-5"
                        style={{ backgroundImage: `url(${job})` }}>
                        <div className="space-y-2 mt-10">
                            <div>
                                <label className="block text-white text-[7px] font-bold mb-1">USER ID</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="text"
                                        value={user?.user_id || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white text-[7px] font-bold mb-1">Ph number</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="tel"
                                        value={user?.phone_number || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white text-[7px] font-bold mb-1">EMAIL</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col mt-20 items-center">
                            <span><FaAngleUp className="w-6 h-6 text-white" /></span>
                            <button className="w-[136px] h-[26px] bg-[#78FF47] rounded-lg border-2 border-white text-white">
                                Matched
                            </button>
                        </div>
                    </div>
                    {/* <div className="w-40 h-5 bg-[#FC0A0A] text-[#FFFFFF] font-bold rounded-lg text-xs flex items-center justify-center mt-5">USER ID ACCESS</div> */}
                </div>
            </div>
            <div className="flex items-center justify-start mt-10 gap-10">
                {/* CARD 1 */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-5 bg-white text-[#581717] rounded-full text-xs flex items-center justify-center">Profile photo upload</div>
                    <div
                        className="w-[168px] h-[300px] bg-cover bg-center flex flex-col items-center px-4 py-10 rounded-lg mt-5"
                        style={{ backgroundImage: `url(${selfi})` }}>
                        <div className="flex flex-col items-center">
                            <img
                                src={user?.profile_img || activeimg}
                                onClick={() => handleImageClick(user?.profile_img)}
                                alt="Profile"
                                className="w-[80px] h-[80px] rounded-full object-cover cursor-pointer"
                            />
                            <img src={camera} alt="Camera" className="mt-6" />
                           <div
                                onClick={() => handleApprove(1)}
                                className={`w-[128px] h-[24px] font-bold flex items-center justify-center rounded-lg mt-10 cursor-pointer 
                            ${approvedCodes.includes(1)
                                        ? "bg-[#78FF47] text-white" // ✅ Approved
                                        : rejectedCodes.includes(1)
                                            ? "bg-gray-500 text-white cursor-not-allowed" // ❌ Blocked because rejected
                                            : "bg-[#78FF47] text-white" // Default
                                    }`}
                            >
                                {approvedCodes.includes(1) ? "ACCEPTED" : "ACCEPT"}
                            </div>
                        </div>
                    </div>
                    {/* <div className="w-40 h-5 bg-[#FC0A0A] text-[#FFFFFF] font-bold rounded-lg text-xs flex items-center justify-center mt-5">REJECT</div> */}
                    <div
                        onClick={() => {
                            if (!rejectedCodes.includes(1) && !approvedCodes.includes(1)) {
                                handleReject(1);
                            }
                        }}
                        className={`w-40 h-5 rounded-lg text-xs flex items-center justify-center mt-5
                            ${rejectedCodes.includes(1)
                                ? "bg-[#FC0A0A] text-white font-bold opacity-50 cursor-not-allowed pointer-events-none" // Disabled
                                : approvedCodes.includes(1)
                                    ? "bg-gray-500 text-white cursor-not-allowed pointer-events-none opacity-50" // Disabled
                                    : "bg-[#FC0A0A] text-white font-bold cursor-pointer" // Active
                            }`}
                    >
                        {rejectedCodes.includes(1) ? "REJECTED" : "REJECT"}
                    </div>

                </div>
                {/* CARD 2 */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-5 bg-white text-[#581717] rounded-full text-xs flex items-center justify-center">Details fillup</div>
                    <div className="w-[183px] h-[327px] bg-cover bg-center rounded-lg flex items-center flex-col mt-3"
                        style={{ backgroundImage: `url(${job})` }}>
                        <div className="space-y-1 mt-5">
                            <div>
                                <label className="block text-white text-[7px] font-bold">AADHAR NO.</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="text"
                                        value={user?.aadhar_no || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300 "
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white text-[7px] font-bold">EMPLOYER NAME</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="tel"
                                        value={user?.employer_name || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white text-[7px] font-bold">PAN CARD details</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="email"
                                        value={user?.pan_card_number || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white text-[7px] font-bold">IFSC CODE</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="email"
                                        value={user?.ifsc_code || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white text-[7px] font-bold">BANK ACCOUNT NO.</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="email"
                                        value={user?.bank_account_no || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white text-[7px] font-bold">NOMINEE NAME</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="email"
                                        value={user?.nominee_name || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white text-[7px] font-bold">NOMINEE Ph NO.</label>
                                <div className="border border-white rounded-sm w-[139px] h-[22px] bg-white/10 backdrop-blur-md">
                                    <input
                                        type="email"
                                        value={user?.nominee_phone_no || ""}
                                        className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-300"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mt-3">
                            <div className="flex items-center justify-center space-x-2 ml-1 mb-3">
                                <input
                                    type="checkbox"
                                    id="terms-checkbox"
                                    className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-0 bg-transparent checked:bg-blue-500"
                                />
                                <label htmlFor="terms-checkbox" className="text-[5px] text-white">
                                    By signing up you agree to our <a href="#" className="text-[#F61616]">Terms & Conditions</a> and Company Privacy Policy
                                </label>
                            </div>
                            {/* <button 
                        onClick={() => handleApprove(3)}
                        className="w-[136px] h-[26px] bg-[#78FF47] text-white font-bold rounded-lg border-2 border-white">
                           DETAILS VALID
                        </button> */}
                            <div
                                onClick={() => handleApprove(2)}
                                className={`w-[128px] h-[24px] font-bold flex items-center justify-center rounded-lg cursor-pointer 
                                ${approvedCodes.includes(2)
                                        ? "bg-[#78FF47] text-white" // ✅ Approved
                                        : (rejectedCodes.includes(2) || user.status_code === 2)
                                            ? "bg-gray-500 text-white cursor-not-allowed pointer-events-none opacity-50" // ❌ Disabled (already rejected)
                                            : "bg-[#78FF47] text-white" // Default
                                    }`}
                            >
                                {approvedCodes.includes(2) ? "DETAILS VALID" : "DETAILS ACCEPT"}
                            </div>
                        </div>
                    </div>
                    {/* <div className="w-40 h-5 bg-[#FC0A0A] text-[#FFFFFF] font-bold rounded-lg text-xs flex items-center justify-center mt-5">DETAILS REJECT</div> */}
                    {/* <div
                    onClick={() => handleReject(3)}
                    className={`w-40 h-5 rounded-lg text-xs flex items-center justify-center mt-5 cursor-pointer 
                    ${statusCodes.includes(3) ? "bg-gray-500 text-white" : "bg-[#FC0A0A] text-[#FFFFFF] font-bold"}`}>
                    {statusCodes.includes(3) ? "REJECTED" : "DETAILS REJECT"}
                </div> */}
                    <div
                        onClick={() => {
                            if (!rejectedCodes.includes(2) && !approvedCodes.includes(2)) {
                                handleReject(2);
                            }
                        }}
                        className={`w-40 h-5 rounded-lg text-xs flex items-center justify-center mt-7
                    ${rejectedCodes.includes(2)
                                ? "bg-[#FC0A0A] text-white font-bold opacity-50 cursor-not-allowed pointer-events-none" // ✅ Rejected (disabled)
                                : (approvedCodes.includes(2) || user.status_code === 2)
                                    ? "bg-gray-500 text-white cursor-not-allowed pointer-events-none opacity-50" // ❌ Disabled (already approved)
                                    : "bg-[#FC0A0A] text-white font-bold cursor-pointer" // Default
                            }`}
                    >
                        {rejectedCodes.includes(2) ? "REJECTED" : "DETAILS REJECT"}
                    </div>
                </div>
                {/* CARD 3 */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-5 bg-white text-[#581717] rounded-full text-xs flex items-center justify-center">Documents upload</div>
                    <div
                        className="w-[176px] h-[315px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-lg mt-5"
                        style={{ backgroundImage: `url(${job})` }}>
                        <div className="flex items-center flex-col mt-5">
                            <h3 className="font-semibold mb-2 text-white text-xs">Upload Aadhar Card</h3>
                            <div className="flex items-center gap-10">
                                {/* Front Camera */}
                                <div className="flex flex-col items-center">
                                    <span className="text-white font-medium text-[7px] tracking-wider">FRONT</span>
                                    <div className="relative">
                                        {/* Camera background circle */}
                                        <div className="w-[46px] h-[46px] rounded-lg bg-white/20 flex items-center justify-center">
                                            <div className="relative">
                                                {(user.aadhar_front_img) ? (
                                                    <img src={user.aadhar_front_img}  onClick={() => handleImageClick(user?.aadhar_front_img)} alt="Aadhar Front" className="w-[46px] h-[46px] rounded-lg object-cover border-2 border-white" />
                                                ) : (
                                                    <div className="w-[46px] h-[46px] rounded-lg bg-white/20 flex items-center justify-center">
                                                        <FaCamera className="text-white text-lg" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Back Camera */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-white font-medium text-[7px] tracking-wider">BACK</span>
                                    <div className="relative">
                                        <div className="w-[46px] h-[46px] rounded-lg bg-white/20 flex items-center justify-center">
                                            <div className="relative">
                                                
                                                {(user.aadhar_back_img) ? (
                                                    <img src={user.aadhar_back_img}  onClick={() => handleImageClick(user?.aadhar_back_img)} alt="Aadhar Back" className="w-[46px] h-[46px] rounded-lg object-cover border-2 border-white" />
                                                ) : (
                                                    <div className="w-[46px] h-[46px] rounded-lg bg-white/20 flex items-center justify-center">
                                                        <FaCamera className="text-white text-lg" />
                                                    </div>
                                                )}
                                               
                                            </div>
                                        </div>
                                        {/* <div className="absolute inset-0 rounded-full bg-black/30"></div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center flex-col mt-5">
                            <h3 className="font-semibold mb-2 text-white text-xs">Upload PAN Card PHOTO</h3>
                            <div className="flex items-center gap-10">
                                {/* Front Camera */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-white font-medium text-[7px] tracking-wider">FRONT</span>
                                    <div className="relative">
                                        {/* Camera background circle */}
                                        <div className="w-[46px] h-[46px] rounded-lg bg-white/20 flex items-center justify-center">
                                            <div className="relative">
                                                {(user?.pan_front_img) ? (
                                                    <img src={user?.pan_front_img} alt="Aadhar Front"  onClick={() => handleImageClick(user?.pan_front_img)} className="w-[46px] h-[46px] rounded-lg object-cover border-2 border-white" />
                                                ) : (
                                                    <div className="w-[46px] h-[46px] rounded-lg bg-white/20 flex items-center justify-center">
                                                        <FaCamera className="text-white text-lg" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <p className="text-red-500 text-[6px] font-bold text-center max-w-full mt-2">
                                The details on the document should be clearly visible while uploading the picture
                            </p>
                            {/* <div 
                            onClick={() => handleApprove(3)}
                            className="w-[128px] h-[24px] text-white font-bold flex items-center justify-center bg-[#78FF47] border-2 border-white rounded-lg mt-2">
                                CLARITY
                            </div> */}
                            <div
                                onClick={() => handleApprove(3)}
                                className={`w-[128px] h-[24px] font-bold flex items-center justify-center rounded-lg mt-10 cursor-pointer 
                                    ${approvedCodes.includes(3)
                                        ? "bg-[#78FF47] text-white" // ✅ Approved
                                        : (rejectedCodes.includes(3) ||  user.status_code === 3)
                                            ? "bg-gray-500 text-white cursor-not-allowed pointer-events-none opacity-50" // ❌ Disabled (already rejected)
                                            : "bg-[#78FF47] text-white" // Default
                                    }`}
                            >
                                {approvedCodes.includes(3) ? "ACCEPTED" : "CLARITY"}
                            </div>

                        </div>
                    </div>
                    {/* <div className="w-40 h-5 bg-[#FC0A0A] text-[#FFFFFF] font-bold rounded-lg text-xs flex items-center justify-center mt-5">REJECT</div> */}
                    <div
                        onClick={() => {
                            if (!rejectedCodes.includes(3) && !approvedCodes.includes(3)) {
                                handleReject(3);
                            }
                        }}
                        className={`w-40 h-5 rounded-lg text-xs flex items-center justify-center mt-5
                                ${rejectedCodes.includes(3)
                                ? "bg-[#FC0A0A] text-white font-bold opacity-50 cursor-not-allowed pointer-events-none" // ✅ Rejected (disabled)
                                : (approvedCodes.includes(3) || user.status_code === 3)
                                    ? "bg-gray-500 text-white cursor-not-allowed pointer-events-none opacity-50" // ❌ Disabled (already approved)
                                    : "bg-[#FC0A0A] text-white font-bold cursor-pointer cursor-not-allowed" // Active
                            }`}
                    >
                        {rejectedCodes.includes(3) ? "REJECTED" : "REJECT"}
                    </div>
                </div>
                {/* CARD 4 */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-5 bg-white text-[#581717] rounded-full text-[6px] flex items-center justify-center">Onboarding/baground verification fee</div>
                    <div className="w-[171px] h-[192px] flex flex-col items-center justify-center rounded-lg mt-5 bg-[#FFFAFA] border-2 border-[#2FFC0A]">
                        <div className="w-38 h-10 flex items-center justify-center mt-1">
                            <span className="font-bold text-sm m-1">PAYMENT DETAILS</span>
                        </div>
                        <div className="flex justify-center items-center">
                            {/* <FaCamera className="text-white text-lg" /> */}
                            <div className="relative">
                                {(user?.transaction_img) ? (
                                    <img src={user?.transaction_img} alt={user?.transaction_img} onClick={() => handleImageClick(user?.transaction_img)} className="w-[76px] h-[66px] rounded-lg object-cover border-2 border-white" />
                                ) : (
                                    <div className="w-[56px] h-[56px] rounded-lg bg-white/20 flex items-center justify-center">
                                        <FaCamera className="text-white text-lg bg-gray w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-32 h-8 bg-[#D9D9D9] rounded-lg flex items-center justify-center mt-1">
                            <span className="font-bold text-2xl">PAID</span>
                        </div>

                    </div>
                    <div className="w-40 h-8 bg-[#D9D9D9] rounded-lg flex items-center justify-center mt-1">
                        <span className="font-bold text-1xl">{user?.transaction_id}</span>
                    </div>
                    <div
                        onClick={() => handleApprove(4)}
                        className={`w-48 h-[75px] rounded-lg text-1xl text-white font-bold flex items-center justify-center mt-4 border-2 border-gray-100 bg-[#78FF47]
                        ${approvedCodes.includes(4) ? "rounded-full" : 
                        (rejectedCodes.includes(4) ||  user.status_code === 4) ? 
                        "text-white cursor-not-allowed pointer-events-none opacity-50 bg-[#78FF47] " 
                        : "bg-gray-500 text-white"
                            }`}
                        style={{
                            borderRadius: approvedCodes.includes(4) ? "50%" : "50%",
                        }}
                    >
                        {approvedCodes.includes(4) ? "ACCEPTED" : " PAYMENT ACCEPT"}
                    </div>
                    {/* <div className="w-40 h-5 bg-[#000000] text-[#FFFFFF] font-bold rounded-lg text-xs flex items-center justify-center mt-5">Payment Reject</div> */}
                    {/* <div onClick={() => handleReject(5)}
                            className={`w-40 h-5 rounded-lg text-xs flex items-center justify-center mt-5 cursor-pointer 
                              ${statusCodes.includes(4) ? "bg-gray-500 text-white" : "bg-[#000000] text-[#FFFFFF] font-bold"}`}>
                            {statusCodes.includes(4) ? "REJECTED" : "Payment Reject"}
                        </div> */}
                    <div
                        onClick={() => {
                            if (!rejectedCodes.includes(4) && !approvedCodes.includes(4)) {
                                handleReject(4);
                            }
                        }}
                        className={`w-40 h-5 rounded-lg text-xs flex items-center justify-center mt-5
                                ${rejectedCodes.includes(4)
                                ? "bg-[#FC0A0A] text-white font-bold opacity-50 cursor-not-allowed pointer-events-none" // ✅ Rejected (disabled)
                                : approvedCodes.includes(4)
                                    ? "bg-gray-500 text-white cursor-not-allowed pointer-events-none opacity-50" // ❌ Disabled (already approved)
                                    : "bg-[#000000] text-white font-bold cursor-not-allowed pointer-events-none " // Active
                            }`}
                    >
                        {rejectedCodes.includes(4) ? "REJECTED" : "Payment REJECTED"}
                    </div>
                </div>
            </div>
             <ImageModal
                imageUrl={selectedImage}
                isOpen={isModalOpen}
                onClose={handleClose}
            />
        </div>
    );
};
const StepItem = ({ label, status, isLast }) => {
    const icon = {
        complete: <FaCheckCircle className="text-green-400 w-5 h-5" />,
        "in-progress": (
            <div className="w-[9px] h-[9px] rounded-full bg-green-400 border-2 border-white" />
        ),
        pending: <FaTimesCircle className="text-red-400 w-5 h-5" />,
    }[status];

    return (
        <div className="relative flex items-center w-[152px] h-[19px] space-y-1">
            {/* Status Icon */}
            <div className="absolute left-1 top-1/2 transform -translate-y-1/2 z-20 bg-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                {icon}
            </div>

            {/* Step Label Box — THIS IS THE PART TO UPDATE */}
            <div className="relative flex justify-center items-center border-3 border-red rounded-xl w-[152px] h-[19px]
         bg-white/10 backdrop-blur-md hover:bg-white/20 transition">
                <span className={`text-white font-semibold ${isLast ? 'text-[6px]' : 'text-[8px] mr-2'}`}>
                    {label}
                </span>
                <span className="text-white w-3 h-3 flex items-center absolute right-1">{">"}</span>
            </div>
        </div>
    );
};
