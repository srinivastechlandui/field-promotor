"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const DUMMY_USERNAME = "kiran";
  const DUMMY_PASSWORD = "12345";

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === DUMMY_USERNAME && password === DUMMY_PASSWORD) {
      
      const dummyToken = "dummy-jwt-token-1234567890";

      localStorage.setItem("jwtToken", dummyToken);

      alert("Login Successful!");

  
      navigate("/home", { replace: true });
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[320px]">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-yellow-400 text-white font-semibold py-2 rounded-md hover:bg-yellow-500 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
