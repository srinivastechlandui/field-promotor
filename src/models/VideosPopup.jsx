import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import KeypadModal from "./KeypadModal";
import ConfirmModal from "./ConfirmModal";
import UserSelectModal from "./UserSelectModal";
import { FaPaperPlane, FaEdit, FaTrash, FaPlus, FaUsers, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import BASE_URL from "../utils/Urls";

export default function VideosPopup({ onClose, user }) {
  
  const [videos, setVideos] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [newVideoLink, setNewVideoLink] = useState("");

  const [showMain, setShowMain] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [enteredCode, setEnteredCode] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [targetVideo, setTargetVideo] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");

  const [collapsedGroups, setCollapsedGroups] = useState({}); // New state for collapsed groups
  // const PRIMARY_LOCK = process.env.PRIMARY_LOCK || "0852";
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

  // ---- FETCH ALL USERS & VIDEOS ----
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/`);
      const usersData = res.data?.users || [];
      setAllUsers(usersData);
    } catch (err) {
      console.error("Error fetching all users:", err);
    }
  };

  const fetchVideos = () => {
    const filteredUsers = allUsers.filter(user => {
      const groupMatch = selectedGroup === "All" || user.group === selectedGroup;
      const links = JSON.parse(user.link || "[]");
      const linkMatch = links.some(link => link.toLowerCase().includes(searchQuery.toLowerCase()));
      const userMatch = user.user_id.toLowerCase().includes(searchQuery.toLowerCase());
      const groupNameMatch = (user.group || "").toLowerCase().includes(searchQuery.toLowerCase());

      return groupMatch && (linkMatch || userMatch || groupNameMatch);
    });

    const groupedByGroup = filteredUsers.reduce((acc, currentUser) => {
      const groupName = currentUser.group || "Unknown Group";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(currentUser);
      return acc;
    }, {});

    const finalData = Object.keys(groupedByGroup).map((groupName) => ({
      groupName,
      users: groupedByGroup[groupName]
        .map((user) => {
          try {
            const links = JSON.parse(user.link || "[]");
            return {
              user_id: user.user_id,
              video_links: links.map((link, idx) => ({
                id: `${user.user_id}-${idx}`,
                user_id: user.user_id,
                index: idx,
                video_link: link,
              })),
            };
          } catch (e) {
            console.error(`Error parsing links for user ${user.user_id}:`, e);
            return null;
          }
        })
        .filter(Boolean),
    }));

    setVideos(finalData);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [allUsers, selectedGroup, searchQuery]);

  const groupNames = useMemo(() => {
    const groups = new Set(allUsers.map(user => user.group).filter(Boolean));
    return ["All", ...Array.from(groups)];
  }, [allUsers]);

  // ---- TOGGLE COLLAPSE ----
  const toggleCollapse = (groupName) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // ---- CLOSE ----
  const handleCloseAll = () => {
    setShowMain(false);
    setShowKeypad(false);
    setShowConfirm(false);
    setShowUserSelectModal(false);
    setShowAddForm(false);
    onClose?.();
  };

  // ---- ADD/EDIT Link (start flow) ----
  const handleAddLinkClick = () => {
    setNewVideoLink("");
    setEditingVideo(null);
    setShowAddForm(true);
  };

  const handleSaveClick = () => {
    if (!newVideoLink.trim()) {
      alert("Please enter a valid link!");
      return;
    }
    setPendingAction("save");
    if (editingVideo) {
      setShowKeypad(true);
    } else {
      setShowUserSelectModal(true);
    }
  };

  const handleUserSelection = (selectedUsers) => {
    if (selectedUsers.length > 0) {
      setTargetUser(selectedUsers[0]);
      setShowUserSelectModal(false);
      setShowKeypad(true);
    } else {
      alert("Please select a user to add the link.");
    }
  };

  // ---- DELETE (start flow) ----
  const handleDeleteClick = (video) => {
    setPendingAction("delete");
    setTargetVideo(video);
    setShowKeypad(true);
  };

  // ---- EDIT (start flow) ----
  const handleEditClick = (video) => {
    setEditingVideo(video);
    setNewVideoLink(video.video_link);
    setShowAddForm(true);
  };

  // ---- Confirm Yes (execute action) ----
  const handleConfirmYes = async () => {
    try {
      if (pendingAction === "save") {
        if (editingVideo) {
          await axios.put(
            `${BASE_URL}/links/${editingVideo.user_id}/${editingVideo.index}`,
            { link: newVideoLink }
          );
        } else if (targetUser) {
          await axios.post(`${BASE_URL}/links/${targetUser}`, {
            link: newVideoLink,
          });
        }
        await fetchVideos();
        setEditingVideo(null);
        setNewVideoLink("");
        setTargetUser(null);
        setShowAddForm(false);
        alert("✅ Video link saved successfully!");
      }

      if (pendingAction === "delete" && targetVideo) {
        await axios.delete(
          `${BASE_URL}/links/${targetVideo.user_id}/${targetVideo.index}`
        );
        await fetchVideos();
        alert("🗑️ Video link deleted successfully!");
      }

      setPendingAction(null);
      setTargetVideo(null);
      handleCloseAll();
    } catch (error) {
      console.error("Action failed:", error);
      alert("❌ Failed to perform action");
    }
  };

  return (
    <>
      {showMain && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-start bg-black bg-opacity-40 z-50 animate-bottom-up">
          <div
            className="rounded-lg p-6 shadow-lg relative"
            style={{
              width: "600px",
              minHeight: "350px",
              background: "linear-gradient(to right, #0052cc, #007bff)",
              borderRadius: "0.75rem 3rem 0.75rem 0.75rem",
            }}
          >
            <button
              onClick={handleCloseAll}
              // className=" text-2xl font-bold hover:text-red-500 hover:rotate-90 transition-transform duration-200"
                className="absolute top-6 right-3 hover:text-black-500 p-2 rounded-full bg-red-600 hover:bg-red-700 transition transform hover:scale-110"
            >
              <IoClose className="text-white text-2xl" />
            </button>

            {/* Header and Controls */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-extrabold text-2xl drop-shadow-lg flex items-center gap-2">
                📺 Videos for you
              </h2>
             <button
                  onClick={handleAddLinkClick}
                  disabled={showAddForm} // ✅ Disable when form is open
                  className={`flex items-center gap-2 text-white font-bold py-2 px-4 rounded-full mr-9 ${
                    showAddForm ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{
                    background: "linear-gradient(to right, #5b0e2d, #a83279)",
                    border: "2px solid gold",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  ADD LINK <FaPlus className="w-3 h-3" />
                </button>

            </div>

            {/* Filter and Search */}
            <div className="flex gap-2 mb-4">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="p-2 rounded text-black bg-white"
              >
                {groupNames.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 rounded text-black"
                placeholder="Search user, link, or group..."
              />
            </div>

            {/* Add/Edit Form (visible only when needed) */}
            {showAddForm && (
              <div className="mt-6 mb-4 border border-gray rounded p-3">
                <input
                  type="text"
                  value={newVideoLink}
                  onChange={(e) => setNewVideoLink(e.target.value)}
                  className="w-full p-2 rounded text-black"
                  placeholder="Enter video link"
                />
                <button
                  onClick={handleSaveClick}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-white font-bold py-2 px-6 rounded-full"
                  style={{
                    background: editingVideo
                      ? "linear-gradient(to right, #0e5b2d, #32a87a)"
                      : "linear-gradient(to right, #5b0e2d, #a83279)",
                    border: "2px solid gold",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  {editingVideo ? "SAVE CHANGES" : "ADD VIDEO"}
                  <FaPaperPlane className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingVideo(null);
                    setNewVideoLink("");
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-2 text-gray-800 font-bold py-2 px-6 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
            
            {/* Video List */}
            <div className="space-y-6 max-h-[200px] overflow-y-auto">
              {videos.length > 0 ? (
                videos.map((group) => (
                  <div key={group.groupName} className="bg-white/10 p-4 rounded-lg">
                    {/* Collapsible Group Header */}
                    <div 
                      onClick={() => toggleCollapse(group.groupName)}
                      className="flex items-center gap-2 cursor-pointer mb-2"
                    >
                      {collapsedGroups[group.groupName] ? (
                        <FaChevronRight size={16} className="text-white" />
                      ) : (
                        <FaChevronDown size={16} className="text-white" />
                      )}
                      <h3 className="text-white font-bold text-lg drop-shadow">
                        Group: {group.groupName}
                      </h3>
                    </div>

                    {/* Collapsible Content */}
                    {!collapsedGroups[group.groupName] && (
                      <div className="space-y-4">
                        {group.users.map((userGroup) => (
                          <div key={userGroup.user_id} className="border-l-4 border-white/30 pl-4">
                            <h4 className="text-white font-semibold text-md mb-2">
                              User: {userGroup.user_id}
                            </h4>
                            <div className="space-y-3">
                              {userGroup.video_links.map((video) => (
                                <div
                                  key={video.id}
                                  className="flex items-center justify-between bg-white/20 p-3 rounded-lg"
                                >
                                  <a
                                    href={video.video_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white underline hover:text-yellow-300 break-all flex-1"
                                  >
                                    {video.video_link}
                                  </a>
                                  <div className="flex items-center gap-3 ml-3">
                                    <button
                                      onClick={() => handleEditClick(video)}
                                      className="text-yellow-300 hover:text-yellow-500"
                                      title="Edit"
                                    >
                                      <FaEdit size={18} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(video)}
                                      className="text-red-400 hover:text-red-600"
                                      title="Delete"
                                    >
                                      <FaTrash size={18} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-white italic">No videos found matching your criteria.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Selection Modal (for adding a new link) */}
      {showUserSelectModal && (
        <UserSelectModal
          onClose={() => setShowUserSelectModal(false)}
          onSubmit={handleUserSelection}
        />
      )}

      {/* Keypad Modal */}
      {showKeypad && (
        <KeypadModal
          type="secondary" 
          onGoClick={() => {
            setShowKeypad(false);
            setShowConfirm(true);
          }}
          onClose={() => setShowKeypad(false)}
        />
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          code={enteredCode}
          setCode={setEnteredCode}
          onYes={handleConfirmYes}
          onNo={() => {
            setShowConfirm(false);
            setPendingAction(null);
            setTargetVideo(null);
            setTargetUser(null);
          }}
        />
      )}
    </>
  );
}