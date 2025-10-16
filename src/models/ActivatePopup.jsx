import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBars, FaCamera, FaCaretDown, FaCaretUp, FaCheck, FaComments, FaEdit, FaSave, FaTimes, FaTrash, FaPhoneAlt, FaPlusCircle, FaToggleOff, FaToggleOn, FaLock, FaLockOpen } from "react-icons/fa";
import selfi from '../Assets/selfi.png';
import activeimg from '../Assets/active-img.png';
import camera from '../Assets/camera.png'
import job from '../Assets/jonoprtunity.png'
import green from '../Assets/green.png'
import viewAccount from '../Assets/view-account.png'
import Accountstmt from '../Assets/Account-stmt.png'
import blue from '../Assets/purple-blue.png'
import BASE_URL from '../utils/Urls';
import ImageModal from "./ImageModal";
import KeypadModal from "./KeypadModal";

 

const ActivatePopup = ({ user, onClose, image }) => {
    // const BASE_URL = "http://localhost:8080/api/v1"
    // Status dropdown state
    const [status, setStatus] = useState(user?.status === "DEACTIVATED" ? "DEACTIVATED" : "ACTIVE");
    const [statusLoading, setStatusLoading] = useState(false);
    const [isToggled, setIsToggled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingNotificationId, setEditingNotificationId] = useState(null);
    const [editingMessage, setEditingMessage] = useState("");
    const email = user?.email || "";
    const aadhar = user?.aadhar_no || "";
    const employerName = user?.name || user?.employer_name || "";
    const pan = user?.pan_card_number || "";
    const ifsc = user?.ifsc_code || "";
    const bank_account_no = user?.bank_account_no || "";
    const nomineeName = user?.nominee_name || "";
    const nomineePhone = user?.nominee_phone_no || "";
    const profile_img = user?.profile_img || user?.profile_img || "";
    const login_image = user?.login_image ;
    const aadhar_front_img = user?.aadhar_front_img || "";
    const aadhar_back_img = user?.aadhar_back_img || activeimg;
    const pan_front_img = user?.pan_front_img || "";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [approvedCodes, setApprovedCodes] = useState([]);
    const [rejectedCodes, setRejectedCodes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [deactivated, setDeactivated] = useState(false);
    const [steps, setSteps] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        email: user?.email || "",
        employer_name: user?.employer_name || user?.name || "",
        phone_number: user?.phone_number || "",
        aadhar_no: user?.aadhar_no || "",
        pan_card_number: user?.pan_card_number || "",
        ifsc_code: user?.ifsc_code || "",
        bank_account_no: user?.bank_account_no || "",
        nominee_name: user?.nominee_name || "",
        nominee_phone_no: user?.nominee_phone_no || "",
    });

    const [localUser, setLocalUser] = useState(user);
    const [couponCode, setCouponCode] = useState(user.coupon_code || "");
    const [validDate, setValidDate] = useState(user.valid_date ? user.valid_date.split("T")[0] : "");
    const [expiredDate, setExpiredDate] = useState(user.expired_date ? user.expired_date.split("T")[0] : "");
    const [showActionDropdown, setShowActionDropdown] = useState(false);
    const [showDeactivateReasonModal, setShowDeactivateReasonModal] = useState(false);
    const [deactivateReason, setDeactivateReason] = useState("");
    const [lockLoaded, setLockLoaded] = useState(false);
    // ✅ Fetch lock info from backend (just to confirm backend has it)
    useEffect(() => {
      const fetchLock = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/locks/`);
          if (res.data?.lock) {
            console.log("🔐 Primary lock found:", res.data.lock);
            setLockLoaded(true);
          }
        } catch (err) {
          console.error("❌ Failed to fetch primary lock:", err);
        }
      };
      fetchLock();
    }, []);

    useEffect(() => {
        setLocalUser(user);
        setCouponCode(user.coupon_code || "");
        setValidDate(user.valid_date ? user.valid_date.split("T")[0] : "");
        setExpiredDate(user.expired_date ? user.expired_date.split("T")[0] : "");
        setStatus(user?.status === "DEACTIVATED" ? "DEACTIVATED" : "ACTIVE");
    }, [user]);


    useEffect(() => {
        setLocalUser(user);
    }, [user]);

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await axios.put(
                `${BASE_URL}/users/admin/update/${user.user_id}`,
                editData
            );
            alert(res.data.message);
            setIsEditing(false);
        } catch (err) {
            alert("❌ Failed: " + (err.response?.data?.message || err.message));
        }
    };



    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/progress/${user.user_id}`);

                // Adjust here based on actual API shape
                const data = res.data?.targets || res.data;

                const amounts = data?.amounts || [];
                const accounts = data?.accounts || [];

                const combined = amounts.map((top, i) => ({
                    top,
                    bottom: accounts[i] || "",
                }));

                setSteps(combined);
            } catch (err) {
                console.error("❌ Failed to fetch progress", err);
            } finally {
                setLoading(false);
            }
        };
        if (user.user_id) fetchProgress();
    }, [user.user_id]);

    useEffect(() => {
        if (!user.user_id) return;

        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const url = `${BASE_URL}/notifications/${user.user_id}`;
                const res = await axios.get(url);
                if (res.data?.notifications) {
                    setNotifications(res.data.notifications);
                }
            } catch (err) {
                console.error("❌ Failed to fetch notifications", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user.user_id, BASE_URL]);


    // ✅ Filter notifications
    const filtered = notifications.filter((n) => {
        if (filter === "unread") return n.is_read === 0;
        if (filter === "read") return n.is_read === 1;
        return true;
    });

    const deleteNotification = async (notification_id) => {
        try {
            await axios.delete(`${BASE_URL}/notifications/${user.user_id}/${notification_id}`);
            setNotifications((prev) =>
                prev.filter((n) => n.notification_id !== notification_id)
            );
        } catch (err) {
            console.error("❌ Failed to delete notification", err);
        }
    };

    // Edit notification message
    const handleEditNotification = (notification) => {
        setEditingNotificationId(notification.notification_id);
        setEditingMessage(notification.message);
    };

    const handleEditMessageChange = (e) => {
        setEditingMessage(e.target.value);
    };

    const handleEditMessageSave = async (notification_id) => {
        if (!editingMessage.trim()) {
            alert("⚠️ Message cannot be empty");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.put(`${BASE_URL}/notifications/${notification_id}`, { message: editingMessage });
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === notification_id ? { ...n, message: editingMessage } : n
                )
            );
            setEditingNotificationId(null);
            setEditingMessage("");
            alert(res.data.message || "Notification updated");
        } catch (err) {
            alert("❌ Failed to update notification");
        } finally {
            setLoading(false);
        }
    };

    const handleEditMessageCancel = () => {
        setEditingNotificationId(null);
        setEditingMessage("");
    };

    const handleUpdateCoupon = async () => {
        if (!couponCode.trim()) {
            alert("⚠️ Coupon code is required");
            return;
        }

        setLoading(true);
        try {
            const payload = { coupon_code: couponCode };
            if (validDate) payload.valid_date = validDate;
            if (expiredDate) payload.expired_date = expiredDate;

            const response = await axios.put(
                `${BASE_URL}/admin/coupon/${localUser.user_id}`,
                payload
            );

            const result = response.data.result;

            // ✅ Update UI instantly without reload
            setLocalUser((prev) => ({
                ...prev,
                coupon_code: result.coupon_code,
                valid_date: new Date(result.validDate).toLocaleDateString(),
                expired_date: new Date(result.expiredDate).toLocaleDateString(),
            }));

            alert(response.data.message);
            setShowModal(false);
        } catch (err) {
            alert(err.response?.data?.message || `❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

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
            if (rejectedCodes.includes(code)) return;

            const updated = [...approvedCodes, code];
            setApprovedCodes(updated);
            await axios.post(`${BASE_URL}/users/admin/approve/${user.user_id}`, {
                approved: updated
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
            if (approvedCodes.includes(code)) return;
            const updated = [...rejectedCodes, code];
            setRejectedCodes(updated);
            await axios.post(
                `${BASE_URL}/users/admin/reject/${user.user_id}`,
                { status_codes: updated }
            );
            alert("Reject Successfully");
        } catch (err) {
            setError("Failed to reject. Try again.");
            alert("Failed to reject. Try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleToggleStatus = async (status, reason = "") => {
  try {
    let payload = { status };
    if (status === "DEACTIVATED" && reason) {
      payload.reason = reason;
    }

    const response = await axios.put(
      `${BASE_URL}/users/admin/status/${localUser.user_id}`,
      payload
    );

    alert(response.data.message || `✅ User ${status.toLowerCase()} successfully`);

    // Update and refetch to ensure DB reason persists
    await setLocalUser(localUser.user_id);
  } catch (err) {
    alert(err.response?.data?.message || "❌ Failed to update status");
  }
};



    // Add missing state and handlers for bank account lock
    const [isBankAccountLocked, setIsBankAccountLocked] = useState(true);
    const [showBankLockModal, setShowBankLockModal] = useState(false);
    const [isEditingBankAccount, setIsEditingBankAccount] = useState(false);

    const handleUnlockBankAccount = () => {
        setShowBankLockModal(true);
    };

    const handleBankAccountUnlockSuccess = () => {
        setIsBankAccountLocked(false);
        setShowBankLockModal(false);
    };

    const handleBankLockModalClose = () => {
        setShowBankLockModal(false);
    };

    const handleBankAccountEditToggle = () => {
        if (isBankAccountLocked) {
            handleUnlockBankAccount();
        } else {
            setIsEditingBankAccount((prev) => !prev);
        }
    };

    const handleBankAccountSave = async () => {
        try {
            const res = await axios.put(
                `${BASE_URL}/users/admin/update/${user.user_id}`,
                { bank_account_no: editData.bank_account_no }
            );
            alert(res.data.message || "Bank account updated successfully!");
            setIsEditingBankAccount(false);
        } catch (err) {
            alert("❌ Failed to update bank account: " + (err.response?.data?.message || err.message));
        }
    };


    return (
        <div
            className="flex flex-col items-center w-full fixed top-0 bottom-0 overflow-y-auto animate-slideInLeft"
            style={{
                maxWidth: "931px",
                boxSizing: "border-box",
                margin: "0 auto",
                padding: "20px 0",
                background: "linear-gradient(to top right, #002E64, #FFFFFF)",
            }}
        >
           
            {/* Top Section */}
            <div className="flex justify-between items-center w-full mb-6 scale-90 h-100">
                <div className="flex flex-col items-start">
                    <div
                        className="group flex items-center justify-between gap-3 px-3 py-2 border border-green-300 
                        bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-sm 
                        hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer"
                        style={{ minWidth: "180px", maxWidth: "220px" }} // Increased width
                    >
                        {/* Label */}
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors duration-300 w-50">
                            Login Image
                        </span>

                        {/* Image */}
                        <div className="relative">
                            <img
                                src={login_image || "https://avatar.iran.liara.run/public/1"}
                                onClick={() => handleImageClick(user?.login_image || "https://avatar.iran.liara.run/public/1")}
                                alt="Login Icon"
                                className="w-16 h-16 rounded-full border-2 border-green-400 object-cover 
                                transform group-hover:scale-110 group-hover:border-green-600 
                                transition-all duration-300 ease-in-out"
                                // Increased size from w-10 h-10 to w-16 h-16
                            />
                        </div>
                    </div>
                </div>
                {/* Right Side - Unactivate */}
                <div className="relative flex flex-col items-center scale-90 ml-3">
                    {/* <div className="w-0 h-0 border-l-[42.5px] border-r-[42.5px] border-b-[136px] border-l-transparent border-r-transparent border-b-[#C86E6E]"></div> */}
                    <div
                        className={`mt-[-16px] rounded-full border-2 bg-white flex items-center justify-center px-4 py-2 
                        transition-all duration-300 ease-in-out shadow-sm hover:shadow-md cursor-default 
                        ${(user.status === "ACTIVE" && user.login_image === null)
                        ? (user.login_image === null) ? "border-red-500 hover:border-red-600" : "border-green-500 hover:border-green-600"
                        : "border-red-500 hover:border-red-600"
                         }`}
                    >
                        <span
                            className={`font-bold text-xl transition-colors duration-300 ${(user.status === "ACTIVE") ? (user.login_image  ||  user.status === "ACTIVE" ? "text-green-600" : "text-red-600") : "text-red-600"
                                }`}
                        >
                            {/* {user.login_image ? "ACTIVE" : "UNACTIVE"} */}
                            {user.status === "ACTIVE" ? (user.login_image === null ? "UNACTIVE" : user.status) : user.status }
                        </span>
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
                        <div className="flex gap-2 mt-10 items-center">
                            {/* <div
                                disabled={loading}
                                onClick={() => handleApprove(1)}
                                className={`w-[64px] h-[24px] flex items-center justify-center bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition
                           ${approvedCodes.includes(1)
                                        ? "bg-[#78FF47] text-white" // ✅ Approved
                                        : rejectedCodes.includes(1)
                                            ? "bg-gray-500 text-white cursor-not-allowed" // ❌ Blocked because rejected
                                            : "bg-[#78FF47] text-white" // Default
                                    }`}
                            >
                                {approvedCodes.includes(1) ? "ACCEPTED" : "ACCEPT"}
                            </div> */}

                            <div
                                onClick={() => {
                                    if (!rejectedCodes.includes(1) && !approvedCodes.includes(1)) {
                                        handleReject(1);
                                    }
                                }}
                                className={`w-[64px] h-5 rounded-lg text-xs flex items-center justify-center 
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
                        <p className="text-red-500 text-[9px] font-bold text-center max-w-full mt-2">
                            The details on the document should be clearly visible while uploading the picture
                        </p>
                        <div className="flex gap-2 mt-2 items-center">
                            {/* <button
                                disabled={loading}
                                onClick={() => handleApprove(3)}
                                className={`w-[64px] h-[24px] flex items-center justify-center bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition
                            ${approvedCodes.includes(3) ? "bg-[#78FF47] text-white" // ✅ Approved
                                        : (rejectedCodes.includes(3) || user.status_code === 3)
                                            ? "bg-gray-500 text-white cursor-not-allowed pointer-events-none opacity-50" // ❌ Disabled (already rejected)
                                            : "bg-[#78FF47] text-white" // Default
                                    }`}
                            >
                                {approvedCodes.includes(3) ? "APPROVED" : "APPROVE"}
                            </button> */}

                            <button
                                disabled={loading}
                                onClick={() => handleReject(3)}
                                className={`w-[64px] h-[24px] flex items-center justify-center bg-[#FF0E12] text-white rounded-lg text-xs font-bold hover:bg-red-700 transition
                                     ${rejectedCodes.includes(3) ? "bg-[#FC0A0A] text-white font-bold opacity-50 cursor-not-allowed pointer-events-none" // ✅ Rejected (disabled)
                                        : (approvedCodes.includes(3) || user.status_code === 3)
                                            ? "bg-gray-500 text-white cursor-not-allowed pointer-events-none opacity-50" // ❌ Disabled (already approved)
                                            : "bg-[#FC0A0A] text-white font-bold cursor-pointer" // Active
                                    }`}
                            >
                                {rejectedCodes.includes(3) ? "REJECTED" : "REJECT"}
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
                        <div className="text-xs font-bold tracking-wider mb-2">Code</div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="relative text-white hover:opacity-80 transition-opacity flex items-center justify-center rounded-lg m-2 px-3 py-2 text-sm "
                            style={{
                                background: "linear-gradient(to bottom, #464399, #E52CB6)",
                            }}
                        >
                            {localUser.coupon_code || "N/A"}
                            <FaEdit className="ml-2 text-yellow-300" />
                        </button>

                        {/* Modal */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                                    <h2 className="text-lg font-bold text-black ">Edit Coupon</h2>

                                    <label className="block text-sm font-semibold mb-1 text-black">Coupon Code</label>
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="w-full border rounded px-3 py-2 mb-4 text-black"
                                        placeholder="Enter coupon code"
                                    />

                                    <label className="block text-sm font-semibold mb-1 text-black ">Valid From</label>
                                    <input
                                        type="date"
                                        value={validDate}
                                        onChange={(e) => setValidDate(e.target.value)}
                                        className="w-full border rounded px-3 py-2 mb-4 text-black"
                                    />

                                    <label className="block text-sm font-semibold mb-1 text-black ">Expires On</label>
                                    <input
                                        type="date"
                                        value={expiredDate}
                                        onChange={(e) => setExpiredDate(e.target.value)}
                                        className="w-full border rounded px-3 py-2 mb-4 text-black"
                                    />

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateCoupon}
                                            disabled={loading}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {loading ? "Updating..." : "Update"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="w-full text-[1xl] mb-1 tracking-tight text-black mt-2 text-center">
                            Valid between
                        </div>
                        <div className="w-[180px] text-[1xl] mb-1 tracking-tight text-black mt-2 text-center">
                            {localUser.valid_date} to {localUser.expired_date}
                        </div>

                        <div className="w-full mt-1">

                            <div className="flex items-center bg-white rounded-lg border border-red-200 px-3 py-2 shadow-md w-[156px] h-[110px] relative my-2">
                                {/* Labels */}
                                <div className="absolute text-xs text-gray-600 font-medium mb-20">
                                    Amount
                                </div>


                                {/* Tracker line */}
                                <div className="flex items-center w-full relative justify-between mt-3">
                                    <div
                                        className="absolute h-[2px] bg-green-500 top-1/2 -translate-y-1/2"
                                        style={{ left: "16px", right: "24px" }}
                                    ></div>

                                    {/* Steps */}
                                    {steps.map((step, index) => (
                                        <div key={index} className="flex flex-col items-center z-10">
                                            {/* Top value */}
                                            <span className="text-xs font-bold text-black">{step.top}</span>

                                            {/* Circle */}
                                            <div
                                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${index < 2
                                                    ? "bg-green-500 text-white"
                                                    : "border-2 border-gray-300 bg-white"
                                                    }`}
                                            >
                                                {index < 2 && <FaCheck />}
                                            </div>

                                            {/* Bottom value */}
                                            <span className="text-xs text-gray-600">{step.bottom}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute bottom-2 left-3 text-xs text-gray-600 font-medium">
                                    Accounts
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                {/* card 4 */}
                <div className="w-[181px] h-[241px] bg-cover bg-center flex flex-col items-center px-4 py-4 rounded-lg"
                    style={{ backgroundImage: `url(${green})` }}>
                    <FaCaretUp className="text-amber-900 self-start ml-5" />
                    <div className="w-[144px] h-[30px] rounded-full bg-amber-900 flex items-center gap-4 px-2">
                        <div className="w-[44px] h-[16px] bg-white rounded-3xl flex items-center justify-center">21</div>
                        <div className="w-[44px] h-[16px] bg-white rounded-3xl flex items-center justify-center">03</div>
                        <div className="w-[44px] h-[16px] bg-white rounded-3xl flex items-center justify-center">1995</div>

                    </div>
                    <FaCaretDown className="text-amber-900 self-start ml-5" />
                    <div className=" h-[20px] flex items-center justify-center bg-[linear-gradient(to_bottom,#464399,#E52CB6)] rounded-lg m-2 px-3 py-2 text-sm">
                        <span className="text-sm text-white flex items-center justify-center ">{user.coupon_code}</span>
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
                                <FaPlusCircle className="text-[10px]" />
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
                {/* card1 - View Account */}
                <div
                    className="w-[218px] h-[468px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-lg"
                    style={{ backgroundImage: `url(${viewAccount})` }}
                >
                    {/* Header with Edit / Save / Cancel */}
                    <div className="flex justify-between items-center w-full mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#3a1e0b] font-bold">
                                👤
                            </div>
                            <h2 className="text-xs font-bold text-white">View Account</h2>
                        </div>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        <FaSave />
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-400 hover:text-blue-600"
                                >
                                    <FaEdit />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Input fields */}
                    <div className="space-y-2 w-full">
                        {/* All fields except BANK ACCOUNT */}
                        {[
                            { label: "EMAIL", name: "email", value: email },
                            { label: "AADHAR NO.", name: "aadhar_no", value: aadhar },
                            { label: "EMPLOYER NAME", name: "employer_name", value: employerName },
                            { label: "PHONE", name: "phone_number", value: user?.phone_number || "" },
                            { label: "PAN CARD", name: "pan_card_number", value: pan },
                            { label: "IFSC CODE", name: "ifsc_code", value: ifsc },
                            { label: "NOMINEE NAME", name: "nominee_name", value: nomineeName },
                            { label: "NOMINEE PH NO.", name: "nominee_phone_no", value: nomineePhone },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-white text-[7px]">{field.label}</label>
                                <input
                                    type="text"
                                    name={field.name}
                                    value={editData[field.name]}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-1 text-xs border rounded-lg outline-none
                                        ${isEditing
                                            ? "border-yellow-400 bg-white text-black"
                                            : "border-white bg-transparent text-white"
                                        }`}
                                    readOnly={!isEditing}
                                />
                            </div>
                        ))}
                        {/* BANK ACCOUNT field (separate with edit/save icon) */}
                        <div className="relative">
                            <label className="text-white text-[7px] flex items-center">
                                BANK ACCOUNT NUMBER
                                {isBankAccountLocked ? (
                                    <FaLock
                                        className="ml-2 text-yellow-400 cursor-pointer"
                                        title="Unlock to edit"
                                        onClick={handleUnlockBankAccount}
                                    />
                                ) : (
                                    <FaLockOpen className="ml-2 text-green-500" title="Unlocked" />
                                )}
                            </label>
                            <input
                                type="text"
                                name="bank_account_no"
                                value={editData["bank_account_no"]}
                                onChange={handleChange}
                                className={`w-full px-4 py-1 text-xs border rounded-lg outline-none pr-10
                                      ${isEditingBankAccount
                                        ? "border-yellow-400 bg-white text-black"
                                        : "border-white bg-transparent text-white"
                                    }`}
                                readOnly={!isEditingBankAccount}
                            />
                            <button
                                className="absolute top-3/4 right-2 transform -translate-y-3/4 text-blue-500"
                                onClick={isEditingBankAccount ? handleBankAccountSave : handleBankAccountEditToggle}
                            >
                                {isEditingBankAccount ? <FaSave /> : <FaEdit />}
                            </button>
                        </div>
                    </div>
                    {/* Keypad Modal for Bank Account Lock */}
                    {showBankLockModal && (
                        <KeypadModal
                           type="secondary"
                            onGoClick={handleBankAccountUnlockSuccess}
                            onClose={handleBankLockModalClose}
                        />
                    )}
                </div>


                {/* card2 */}
                <div
                    className="w-[179px] h-[340px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-lg"
                    style={{ backgroundImage: `url(${Accountstmt})` }}>
                    <div className="flex items-center gap-5 mb-2 shadow-[ rgb(107 114 128)]">
                        <FaBars className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#3a1e0b] font-bold" />
                        <h2 className="text-xs font-bold text-black">Account Statement</h2>
                    </div>
                    <div className="flex items-center justify-center gap-2 border-b-2 border-gray-600 w-[112px] mb-3">
                        <span className="text-semibold text-[8px]">All</span>
                        <span className="text-semibold text-[8px]">Paid</span>
                        <span className="text-semibold text-[8px]">Pending</span>
                        <span className="text-semibold text-[8px]">Live Run</span>
                    </div>
                    {/* Transaction Payment Row */}
                    <div className="flex flex-col w-[141px] space-y-2 mb-2">
                        <div className="flex flex-col bg-red-50 border border-red-300 rounded px-2 py-1 text-[10px] font-semibold">
                            <div className="flex items-center justify-between">
                                <span className="text-red-700">Transaction Payment</span>
                                <span className="text-red-900">₹-{user.onboarding_fee || 0}</span>
                            </div>
                            {user.transaction_id && (
                                <div className="flex items-center justify-end mt-1">
                                    <span className="text-[9px] text-gray-700 font-normal">Txn ID: {user.transaction_id}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col w-[139px] h-[1.5px] space-y-6">
                        {[...Array(7)].map((_, i) => (
                            <div
                                key={i}
                                className="border border-[#D399D2] rounded-sm"
                            />
                        ))}
                    </div>
                </div>

                {/* card 3  */}
                <div
                    className="w-[179px] h-[340px] bg-cover bg-center flex flex-col items-center px-4 py-2 rounded-lg"
                    style={{ backgroundImage: `url(${blue})` }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-5 mb-2">
                        <FaComments className="w-5 h-5 bg-white rounded-full text-[#3a1e0b] font-bold" />
                        <h2 className="text-xs font-bold text-black">Notification</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center justify-center gap-2 border-b-2 border-[#988686] w-[112px] mb-3 text-[8px]">
                        <span
                            onClick={() => setFilter("all")}
                            className={`cursor-pointer ${filter === "all" ? "text-[#4D4D4D] font-bold" : "text-[#988686]"
                                }`}
                        >
                            ALL
                        </span>
                        <span
                            onClick={() => setFilter("unread")}
                            className={`cursor-pointer ${filter === "unread" ? "text-[#4D4D4D] font-bold" : "text-[#988686]"
                                }`}
                        >
                            UNREAD
                        </span>
                        <span
                            onClick={() => setFilter("read")}
                            className={`cursor-pointer ${filter === "read" ? "text-[#4D4D4D] font-bold" : "text-[#988686]"
                                }`}
                        >
                            READ
                        </span>
                    </div>

                    {/* Notification List */}
                    <div className="flex flex-col w-[139px] flex-grow overflow-y-auto">
                        {loading ? (
                            <p className="text-[10px] text-gray-500">Loading...</p>
                        ) : filtered.length === 0 ? (
                            <p className="text-[10px] text-gray-500">No notifications</p>
                        ) : (
                            filtered.map((n) => (
                                <div
                                    key={n.notification_id}
                                    className={`flex items-start justify-between p-1 mb-2 rounded text-[9px] ${n.is_read ? "bg-gray-200" : "bg-yellow-100"
                                        }`}
                                >
                                    <div className="flex-1 mr-1">
                                        {editingNotificationId === n.notification_id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editingMessage}
                                                    onChange={handleEditMessageChange}
                                                    className="text-xs border rounded px-1 py-0.5 w-full mb-1"
                                                    disabled={loading}
                                                />
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleEditMessageSave(n.notification_id)}
                                                        className="text-green-600 text-[8px] border border-green-600 rounded px-1"
                                                        disabled={loading}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleEditMessageCancel}
                                                        className="text-gray-500 text-[8px] border border-gray-400 rounded px-1"
                                                        disabled={loading}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p>{n.message}</p>
                                                <span className="text-[7px] text-gray-500">
                                                    {new Date(n.created_at).toLocaleString()}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center gap-1 ml-1">
                                        <button
                                            onClick={() => handleEditNotification(n)}
                                            className="text-blue-500 mb-1"
                                            title="Edit notification"
                                            disabled={editingNotificationId !== null && editingNotificationId !== n.notification_id}
                                        >
                                            <FaEdit size={10} />
                                        </button>
                                        <button
                                            onClick={() => deleteNotification(n.notification_id)}
                                            className="text-red-500"
                                            title="Delete notification"
                                            disabled={editingNotificationId === n.notification_id}
                                        >
                                            <FaTrash size={10} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
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
                            ><FaPhoneAlt className="w-4 h-4 rounded-full text-white bg-green-700 text-[8px]" /></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-[611px] h-[70px] bg-[#FF0E12] rounded-lg flex items-center justify-center">
                {/* <button
                    onClick={handleDeactivate}
                    disabled={loading || deactivated || status === "DEACTIVATED"}
                    className="disabled:opacity-50"
                    autoFocus
                >
                    <span className="text-white font-bold flex items-center">
                        {loading
                            ? "Deactivating..."
                            : deactivated || status === "DEACTIVATED"
                                ? "DEACTIVATED ACCOUNT"
                                : "DEACTIVATE ACCOUNT"}
                    </span>
                </button> */}
            </div>
           
            {/* Dropdown Action Button */}
            <div className="relative mt-4 flex flex-col items-center text-center">
                <div className="text-sm font-semibold mb-1 text-gray-700">
                    {localUser.employer_name || "User"} - Account Status
                    {/* {localUser.status === "DEACTIVATED" && ( */}
                        <span className="ml-2 text-red-600">({localUser.status_code === -1 ? "DEACTIVATED" : user.login_image === null ? "UNACTIVE" : "ACTIVE" })</span>
                    {/* )} */}
                 </div>
                <div className="inline-block text-center w-[611px]">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowActionDropdown((prev) => !prev);
                        }}
                        className="inline-flex justify-between items-center text-center w-full px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-pink-600 rounded-md shadow-md hover:opacity-90 focus:outline-none"
                    >
                        {localUser.status === "ACTIVE" ? "Active Account" : "Deactivated Account"}
                        <svg
                            className="w-5 h-5 ml-2 -mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showActionDropdown && (
                        <div
                            className="origin-top-right absolute  right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="py-1 text-center">
                                <button
                                    onClick={async () => {
                                        if (localUser.status !== "ACTIVE") {
                                            await handleToggleStatus("ACTIVE");
                                        }
                                        setShowActionDropdown(false);
                                    }}
                                    disabled={localUser.status === "ACTIVE"}
                                    className={`w-full text-left px-4 py-2 text-sm ${localUser.status === "ACTIVE"
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-green-600 hover:bg-green-50 hover:text-green-800"
                                        }`}
                                >
                                    ✅ Activate
                                </button>

                                <button
                                  
                                     onClick={(e) => {
                                        e.stopPropagation(); // prevent dropdown from re-triggering
                                        if (!showDeactivateReasonModal && localUser.status !== "DEACTIVATED") {
                                        setShowDeactivateReasonModal(true);
                                        }
                                        // setShowActionDropdown(false);
                                    }}
                                    disabled={localUser.status === "DEACTIVATED"}
                                    className={`w-full text-left px-4 py-2 text-sm ${localUser.status === "DEACTIVATED"
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-red-600 hover:bg-red-50 hover:text-red-800"
                                        }`}
                                >
                                    ❌ Deactivate
                                </button>

                    {/* Deactivate Reason Modal */}
                    {showDeactivateReasonModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-full">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                                <h2 className="text-lg font-bold text-black ">Deactivate User</h2>
                                <label className="block text-sm font-semibold mb-1 text-black">Reason for deactivation</label>
                                <textarea
                                    value={deactivateReason}
                                    onChange={e => setDeactivateReason(e.target.value)}
                                    className="w-full border rounded px-3 py-2 mb-4 text-black"
                                    placeholder="Enter reason"
                                    rows={3}
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowDeactivateReasonModal(false)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (deactivateReason.trim()) {
                                                await handleToggleStatus("DEACTIVATED", deactivateReason);
                                                setShowDeactivateReasonModal(false);
                                                setDeactivateReason("");
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                        disabled={!deactivateReason.trim()}
                                    >
                                        Deactivate
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                            </div>
                        </div>
                    )}
                </div>
            </div>

            {(error || success) && (
                <div
                    className={`mt-4 text-center text-sm font-bold ${error ? "text-red-600" : "text-green-600"}`}
                >
                    {error || success}
                </div>
            )}

            {/* Show deactivate reason if user is deactivated */}
            {localUser.status === "DEACTIVATED" && localUser.deactivate_reason && (
                <div className="mt-2 mb-3 text-center text-sm text-white-700">
                    <span className="font-bold text-white">Deactivation Reason:</span> {localUser.deactivate_reason}
                </div>
            )}
            <ImageModal
                imageUrl={selectedImage}
                isOpen={isModalOpen}
                onClose={handleClose}
            />

        </div>
    );
};

export default ActivatePopup;