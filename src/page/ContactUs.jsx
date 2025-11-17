import { useState } from "react";
import {useNavigate} from "react-router-dom";

export default function ContactUsForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with real API call
    console.log("Form Submitted:", formData);
    // simple UX feedback (reset form)
    setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    alert("✅ Thanks — your message has been submitted.");
     navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-5xl mx-auto">
       <header className="flex items-center justify-center gap-4 mb-8">
          <img
            src="../logo.png"
            alt="Logo"
            className="w-16 h-16 object-contain hover:scale-110 transition-transform duration-300"
          />
          <div className="text-center">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
              Field Crestdeep
            </h1>
            <p className="text-gray-700 mt-2 font-medium">
              Contact Us — we're here to help
            </p>
          </div>
        </header>

        <div className="flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-xl w-full max-w-2xl p-8 rounded-2xl shadow-2xl border border-white/40"
          >
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
              Contact Us
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="firstName" className="font-medium text-gray-600 mb-1">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                  className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="lastName" className="font-medium text-gray-600 mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                  className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="font-medium text-gray-600 mb-1">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="phone" className="font-medium text-gray-600 mb-1">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="font-medium text-gray-600 mb-1">How can we help you?</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message..."
                required
                className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-400 outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium p-3 rounded-xl transition duration-300 shadow-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
