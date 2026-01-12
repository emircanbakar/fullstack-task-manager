import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import SettingsModal from "./SettingsModal";
import toast, { Toaster } from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!", {
      duration: 2000,
      position: "top-right",
    });
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleSettings = () => {
    setIsDropdownOpen(false);
    setIsSettingsOpen(true);
  };

  return (
    <div className="flex flex-row justify-between text-md text-black items-center px-4 gap-16 w-full h-16">
      <Toaster />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <div className="flex flex-row justify-between items-center gap-40">
        <div
          className="bg-black text-white shadow-md px-8 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => navigate("/home")}
        >
          home
        </div>
        <div className="flex flex-row gap-8 bg-black text-white shadow-md px-8 py-2 rounded-full ">
          <span
            className="cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => navigate("/overview")}
          >
            overview
          </span>
          <span
            className="cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => navigate("/manage")}
          >
            manage
          </span>
          <span
            className="cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => navigate("/calendar")}
          >
            calendar
          </span>
          <span
            className="cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => navigate("/projects")}
          >
            projects
          </span>
          <span
            className="cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => navigate("/activity")}
          >
            activity
          </span>
          <span
            className="cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => navigate("/backlog")}
          >
            backlog
          </span>
        </div>
      </div>

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="bg-black text-white shadow-md px-4 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors"
          id="user"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          u
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
              onClick={handleSettings}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600 flex items-center gap-2"
              onClick={handleLogout}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
