import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import BASE_URL from "../utils/Urls";

export default function AccessModal({ onClose }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    user_id: "",
    name: "",
    username: "",
    password: "",
    oldPassword: "",
    newPassword: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    oldPassword: false,
    newPassword: false,
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/access`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("❌ Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setEditingUser(null);
    setForm({
      user_id: "",
      name: "",
      username: "",
      password: "",
      oldPassword: "",
      newPassword: "",
    });
    setShowForm(false);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        if (!form.oldPassword || !form.newPassword) {
          alert("⚠️ Old and new password required");
          return;
        }
        if (form.oldPassword === form.newPassword) {
          alert("⚠️ New password must be different");
          return;
        }
        await axios.put(`${BASE_URL}/access/${editingUser.id}`, {
          ...form,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        });
      } else {
        if (!form.password) {
          alert("⚠️ Password required");
          return;
        }
        await axios.post(`${BASE_URL}/access`, form);
      }

      await fetchUsers();
      resetForm();
      alert("✅ Saved successfully");
    } catch (err) {
      alert("❌ Failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${BASE_URL}/access/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (loggedInUser && loggedInUser.id === id) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("sessionActive");
        localStorage.removeItem("loggedInUser");
        alert("⚠️ Your account was deleted. You have been logged out.");
        window.location.href = "/";
      }
      alert("✅ User deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("❌ Failed to delete user");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[650px] p-6 relative transition-all duration-300 hover:shadow-3xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-2xl font-bold hover:text-red-500 hover:rotate-90 transition-transform duration-200"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          🔑 Access Management
        </h2>

        {/* User List */}
        {/* User List */}
    {!showForm && (
      <>
        <div className="max-h-[320px] overflow-y-auto mb-4 border rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 shadow-inner">
          <table className="w-full text-left">
            <thead className="bg-blue-100 text-blue-700 uppercase text-xs font-bold sticky top-0">
              <tr>
                <th className="py-2 px-3">User ID</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Username</th>
                <th className="py-2 px-3 text-center">Password</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-blue-50 transition-all duration-200"
                >
                  <td className="py-2 px-3 font-semibold text-gray-700">{u.user_id}</td>
                  <td className="py-2 px-3 text-gray-700">{u.name}</td>
                  <td className="py-2 px-3 text-gray-600 italic">{u.username}</td>
                  <td className="py-2 px-3 text-center text-gray-500 font-mono">
                    {"•".repeat(8)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setForm({ ...u, oldPassword: "", newPassword: "" });
                        setShowForm(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-700 mx-2"
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-500 hover:text-red-700 mx-2"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Button */}
        <div className="flex justify-end mt-3">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-150"
          >
            <FaPlus /> Add New Access
          </button>
        </div>
      </>
    )}


        {/* Form Section */}
        {showForm && (
          <div className="border-t pt-4 mt-3">
            <h3 className="font-semibold mb-3 text-lg text-blue-600">
              {editingUser ? "Edit User" : "Add User"}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* User ID */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  User ID
                </label>
                <input
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  placeholder="Enter User ID"
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                />
              </div>

              {/* Username */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter Username"
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                />
              </div>

              {/* Password Fields */}
              {editingUser ? (
                <>
                  {/* Old Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Old Password
                    </label>
                    <input
                      type={showPassword.oldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={form.oldPassword}
                      onChange={handleChange}
                      placeholder="Enter Old Password"
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("oldPassword")}
                      className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      New Password
                    </label>
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="Enter New Password"
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword.password ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                  >
                    {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-150 shadow hover:shadow-md"
              >
                {editingUser ? "Update" : "Add"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
