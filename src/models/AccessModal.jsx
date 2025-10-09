import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import BASE_URL from "../utils/Urls";

export default function AccessModal({ onClose }) {
    // const BASE_URL = "http://localhost:8080/api/v1"
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ user_id: "", name: "", username: "", password: "", oldPassword: "", newPassword: "" });
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
    setForm({ user_id: "", name: "", username: "", password: "", oldPassword: "", newPassword: "" });
    setShowForm(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

    // ✅ Clear JWT/session if logged-in user is deleted
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
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[650px] p-6 relative">
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3  text-gray-500 text-2xl font-bold hover:text-red-500 hover:rotate-90 transition-transform duration-200">✕</button>

        <h2 className="text-xl font-bold mb-4">🔑 Access Management</h2>

        {/* User List */}
        {!showForm && (
          <>
            <div className="max-h-[250px] overflow-y-auto mb-4 border p-2 rounded">
              {users.map((u) => (
                <div key={u.id} className="flex justify-between items-center border-b py-2">
                  <span>{u.user_id} - {u.name} ({u.username})</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setForm({ ...u, oldPassword: "", newPassword: "" });
                        setShowForm(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && <p className="text-gray-500">No users found</p>}
            </div>

            {/* Add Button */}
            <div className="flex justify-end">
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FaPlus /> Add User
              </button>
            </div>
          </>
        )}

        {/* Form */}
        {showForm && (
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">{editingUser ? "Edit User" : "Add User"}</h3>
            <div className="grid grid-cols-2 gap-2">
              <input name="user_id" value={form.user_id} onChange={handleChange} placeholder="User ID" className="border p-2 rounded" />
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
              <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="border p-2 rounded" />

              {editingUser ? (
                <>
                  <div className="relative">
                    <input
                      type={showPassword.oldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={form.oldPassword}
                      onChange={handleChange}
                      placeholder="Old Password"
                      className="border p-2 rounded w-full"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("oldPassword")}
                      className="absolute right-3 top-3 text-gray-500"
                    >
                      {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="New Password"
                      className="border p-2 rounded w-full"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-3 text-gray-500"
                    >
                      {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative col-span-2">
                  <input
                    type={showPassword.password ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="border p-2 rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword.password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                {editingUser ? "Update" : "Add"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
