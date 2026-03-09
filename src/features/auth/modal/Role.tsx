import React, { useState, useEffect } from "react";
import { useModal } from "../context/AuthContext";

export const ProfileModal: React.FC = () => {
  const { isSignInOpen, closeSignIn } = useModal();

  const [formData, setFormData] = useState({
    yourName: "",
    profileName: "",
    role: "student",
  });

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isSignInOpen) {
      const scrollY = window.scrollY;
      document.body.style.setProperty("position", "fixed", "important");
      document.body.style.setProperty("top", `-${scrollY}px`, "important");
      document.body.style.setProperty("width", "100%", "important");
      document.body.style.setProperty("overflow", "hidden", "important");
    }

    return () => {
      if (isSignInOpen) {
        const scrollY = document.body.style.top;
        document.body.style.removeProperty("position");
        document.body.style.removeProperty("top");
        document.body.style.removeProperty("width");
        document.body.style.removeProperty("overflow");
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    };
  }, [isSignInOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isSignInOpen) {
      setFormData({
        yourName: "",
        profileName: "",
        role: "student",
      });
    }
  }, [isSignInOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setFormData({ yourName: "", profileName: "", role: "student" });
    closeSignIn();
  };

  const handleSubmit = () => {
    // console.log("Form Submitted:", formData);
    // Add your API submission logic here
    
    closeSignIn();
  };

  if (!isSignInOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overscroll-contain">
      <div className="absolute inset-0 bg-black/40 touch-none" />
      <div className="relative bg-white rounded-3xl shadow-[#000000A6] max-w-6xl w-full min-h-[32rem] overflow-hidden flex">
        
        {/* Left Side Illustration */}
        <div className="hidden md:flex md:w-[38%] bg-[#f5f7fa] items-center justify-center p-6">
          <div className="relative w-full">
            <div className="relative w-full max-w-sm">
              <img
                src="/image84.svg"
                alt="Students Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-[62%] p-8">
          <button
            onClick={closeSignIn}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          
          <h1 className="text-3xl font-bold text-primary mb-8">
            Complete Your Profile
          </h1>

          <div className="space-y-6">
            
            {/* Your Name Input */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="yourName"
                value={formData.yourName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full pb-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent"
              />
            </div>

            {/* Profile Name Input */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Profile Name
              </label>
              <input
                type="text"
                name="profileName"
                value={formData.profileName}
                onChange={handleChange}
                placeholder="Enter your profile name"
                className="w-full pb-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pb-2 border-b border-gray-300 text-primary focus:outline-none focus:border-gray-500 bg-transparent cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="super admin">Super Admin</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancel}
                className="px-7 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.yourName || !formData.profileName}
                className={`px-7 py-2.5 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                  formData.yourName && formData.profileName
                    ? "bg-button-primary text-primary hover:opacity-90"
                    : "bg-primary text-white"
                }`}
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// If you want to render it exactly like your previous file did:
const UserFormContainer: React.FC = () => {
  const { openSignIn } = useModal();
  React.useEffect(() => {
    openSignIn();
  }, [openSignIn]);
  return <ProfileModal />;
};

export default UserFormContainer;