import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaUserAlt,
  FaUsers,
  FaCheckSquare,
  FaRegSquare,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../utils/Urls";

export default function UserSelectModal({ onClose, onSubmit }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [globalCheckAll, setGlobalCheckAll] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/users/`);
        setUsers(res.data?.users || []);
      } catch (err) {
        console.error("❌ Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Filter by search
  const filtered = users.filter((u) =>
    (u.user_id || "").toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Group users by group name
  const groupedUsers = filtered.reduce((acc, user) => {
    const groupName = user.group || "Others";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(user);
    return acc;
  }, {});

  // ✅ Toggle select one
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // ✅ Toggle select all in one group
  const toggleGroup = (groupName) => {
    const groupIds = groupedUsers[groupName].map((u) => u.user_id);
    const allSelected = groupIds.every((id) => selected.includes(id));

    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !groupIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...groupIds])]);
    }
  };

  // ✅ Toggle select all globally
  const toggleGlobal = () => {
    if (globalCheckAll) {
      setSelected([]);
      setGlobalCheckAll(false);
    } else {
      setSelected(filtered.map((u) => u.user_id));
      setGlobalCheckAll(true);
    }
  };

  // ✅ Toggle collapse/expand group
  const toggleCollapse = (groupName) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg shadow">
            <FaUsers /> Select Users
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition transform hover:scale-110"
          >
            <IoClose className="text-white text-2xl" />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search user_id..."
          className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Global Check all */}
        <button
          onClick={toggleGlobal}
          className="flex items-center gap-2 px-4 py-2 rounded mb-4 bg-gradient-to-r from-gray-100 to-blue-100 hover:from-blue-200 hover:to-blue-300 text-gray-700 font-semibold transition w-full shadow"
        >
          {globalCheckAll ? (
            <FaCheckSquare className="text-blue-600" />
          ) : (
            <FaRegSquare className="text-gray-500" />
          )}
          <span>Check All (All Groups)</span>
        </button>

        {/* Users grouped by group name */}
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : Object.keys(groupedUsers).length === 0 ? (
          <div className="text-gray-500">No users found.</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedUsers).map(([groupName, groupUsers]) => {
              const allSelected = groupUsers.every((u) =>
                selected.includes(u.user_id)
              );
              const isCollapsed = collapsedGroups[groupName];
              return (
                <div
                  key={groupName}
                  className="border rounded-lg shadow hover:shadow-md transition"
                >
                  {/* Group Header */}
                  <div
                    onClick={() => toggleCollapse(groupName)}
                    className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-pointer rounded-t-lg"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {isCollapsed ? (
                        <FaChevronRight />
                      ) : (
                        <FaChevronDown />
                      )}
                      <FaUsers />
                      {groupName}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroup(groupName);
                      }}
                      className="flex items-center gap-2 text-sm px-3 py-1 rounded bg-white text-green-700 hover:bg-green-100 transition shadow"
                    >
                      {allSelected ? (
                        <FaCheckSquare className="text-green-600" />
                      ) : (
                        <FaRegSquare className="text-gray-500" />
                      )}
                      {allSelected ? "Uncheck" : "Check"}
                    </button>
                  </div>

                  {/* Grouped Users */}
                  {!isCollapsed && (
                    <ul className="space-y-2 px-3 py-2 bg-gray-50">
                      {groupUsers.map((u) => (
                        <li
                          key={u.user_id}
                          className="flex items-center justify-between border-b pb-2 hover:bg-white rounded px-2 transition"
                        >
                          <label className="flex items-center gap-3 cursor-pointer w-full">
                            <input
                              type="checkbox"
                              checked={selected.includes(u.user_id)}
                              onChange={() => toggleSelect(u.user_id)}
                              className="accent-blue-600"
                            />
                            <FaUserAlt className="text-blue-500" />
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800">
                                {u.user_id}
                              </span>
                              <span className="text-sm text-gray-500">
                                {u.employer_name}
                              </span>
                            </div>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition shadow"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(selected)}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded transition shadow flex items-center gap-2"
          >
            <FaUsers /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
