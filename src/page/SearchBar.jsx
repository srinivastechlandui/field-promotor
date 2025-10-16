import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiX, FiEdit } from "react-icons/fi";
import axios from "axios";
import BASE_URL from "../utils/Urls"

const SearchBar = ({ searchText, setSearchText }) => {
 
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  // ✅ Fetch all groups
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/groups/`);
      setGroups(res.data.result);
    } catch (err) {
      console.error("❌ Failed to fetch groups:", err.message);
    }
  };

  // ✅ Create group
  const createGroup = async () => {
    if (!newGroup.trim()) return alert("⚠️ Group name required");
    try {
      await axios.post(`${BASE_URL}/groups/`, { group: newGroup });
      alert("✅ Group created successfully");
      setNewGroup("");
      fetchGroups();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to create group");
    }
  };

  // ✅ Update group
  const updateGroup = async (id) => {
    if (!editingGroup?.group.trim()) return alert("⚠️ Group name required");
    try {
      await axios.put(`${BASE_URL}/groups/${id}`, { group: editingGroup.group });
      alert("✅ Group updated successfully");
      setEditingGroup(null);
      fetchGroups();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to update group");
    }
  };

  // ✅ Delete group
  // const deleteGroup = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this group?")) return;
  //   try {
  //     await axios.delete(`${BASE_URL}/groups/${id}`);
  //     alert("✅ Group Name deleted successfully, But not the Related Users!");
  //     fetchGroups();
  //   } catch (err) {
  //     alert(err.response?.data?.message || "❌ Failed to delete group");
  //   }
  // };

  useEffect(() => {
    if (showModal) fetchGroups();
  }, [showModal]);

  return (
    <div className="flex flex-col gap-4">
      {/* 🔍 Search */}
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

      {/* ➕ Plus Button */}
      <div
        className="h-[32px] bg-[#6efc9e] relative rounded-lg border border-[#000000] cursor-pointer hover:bg-[#59df6b] transition duration-200"
        onClick={() => setShowModal(true)}
      >
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-[25px] h-[25px] bg-[#52f600] flex items-center justify-center rounded-full hover:scale-110 transition">
          <FiPlus className="text-white w-[22px] h-[22px]" />
        </div>
      </div>

      {/* 🟢 Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[420px] rounded-xl p-6 shadow-2xl relative border-2 border-gray-200">
            
            {/* ❌ Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 hover:rotate-90 transition-transform duration-200"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Manage Groups
            </h2>

            {/* ➕ Create group */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Enter new group"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="flex-1 border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 transition duration-200"
              />
              <button
                onClick={createGroup}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md 
                           hover:bg-green-700 active:scale-95 
                           transition-all duration-200"
              >
                Add
              </button>
            </div>

            {/* 📋 Groups List */}
            <ul className="max-h-[220px] overflow-y-auto">
              {groups.map((g) => (
                <li
                  key={g.group_id}
                  className="flex justify-between items-center mb-2 p-2 rounded-md border hover:bg-gray-100 transition"
                >
                  {editingGroup?.group_id === g.group_id ? (
                    <>
                      <input
                        type="text"
                        value={editingGroup.group}
                        onChange={(e) =>
                          setEditingGroup({ ...editingGroup, group: e.target.value })
                        }
                        className="border-2 border-gray-300 p-1 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200 flex-1"
                      />
                      <button
                        onClick={() => updateGroup(g.group_id)}
                        className="ml-2 text-green-600 hover:text-green-800 active:scale-95 transition duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingGroup(null)}
                        className="ml-2 text-gray-500 hover:text-gray-700 active:scale-95 transition duration-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-800">{g.group}</span>
                      <div className="flex gap-3">
                        <button
                        onClick={() => setEditingGroup(g)}
                        className="text-blue-600 hover:text-blue-800 active:scale-90 transition"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>

                      {/* <button
                        onClick={() => deleteGroup(g.group_id)}
                        className="text-red-600 hover:text-red-800 active:scale-90 transition"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button> */}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
