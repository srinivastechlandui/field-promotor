import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state variable

  const navigate = useNavigate();

  const DUMMY_USERNAME = "Admin";
  const DUMMY_PASSWORD = "Admin123";

  useEffect(() => {
    const sessionActive = localStorage.getItem("sessionActive");

    if (!sessionActive) {
      localStorage.removeItem("jwtToken");
    }

    const handleBeforeUnload = () => {
      localStorage.removeItem("sessionActive");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === DUMMY_USERNAME && password === DUMMY_PASSWORD) {
      const dummyToken = "dummy-jwt-token-1234567890";
      localStorage.setItem("jwtToken", dummyToken);
      localStorage.setItem("sessionActive", "true");
      alert("Login Successful!");
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center fixed inset-0 overflow-hidden">
      <div className="card">
        <a className="login">Log in</a>
        <form onSubmit={handleLogin} className="flex flex-col items-center gap-6">
          <div className="inputBox">
            <input
              type="text"
              required="required"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="user">Username</span>
          </div>

          <div className="inputBox relative"> {/* Add relative positioning */}
            <input
              type={showPassword ? "text" : "password"} // Conditional type
              required="required"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <button
              type="button" // Use type="button" to prevent form submission
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"} {/* Conditional emoji */}
            </button>
          </div>

          {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

          <button type="submit" className="enter">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../App.css";

// const BASE_URL = "http://localhost:8080/api/v1"; // adjust to your server

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const sessionActive = localStorage.getItem("sessionActive");
//     if (!sessionActive) {
//       localStorage.removeItem("jwtToken");
//     }
//     const handleBeforeUnload = () => {
//       localStorage.removeItem("sessionActive");
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await axios.post(`${BASE_URL}/login`, {
//         username,
//         password,
//       });

//       const { token, user } = res.data;

//       localStorage.setItem("jwtToken", token);
//       localStorage.setItem("sessionActive", "true");
//       localStorage.setItem("loggedInUser", JSON.stringify(user));

//       alert("✅ Login Successful!");
//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(
//         err.response?.data?.message || "❌ Something went wrong. Try again."
//       );
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center fixed inset-0 overflow-hidden">
//       <div className="card">
//         <a className="login">Log in</a>

//         <form onSubmit={handleLogin} className="flex flex-col items-center gap-6">
//           <div className="inputBox">
//             <input
//               type="text"
//               required="required"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <span className="user">Username</span>
//           </div>

//           <div className="inputBox">
//             <input
//               type="password"
//               required="required"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <span>Password</span>
//           </div>

//           {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

//           <button type="submit" className="enter">
//             Enter
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
