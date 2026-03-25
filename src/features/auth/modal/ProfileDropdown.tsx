import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/AuthContext";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useToast } from "../../../app/providers/ToastProvider";
import ApiServices from "../../../services/ApiServices";
import { RoleSwitchModal } from "./RoleSwitchModal";
import { LogoutConfirmationModal } from "./LogoutConfirmationModal";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { clearMenu, openProfileSelection, setProfilesList } = useModal();
  const { logout, user } = useAuth();
  const { showToast } = useToast();

  const [isRoleSwitchOpen, setIsRoleSwitchOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isManageLoading, setIsManageLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleManageAccount = () => {
    navigate("/profile");
    onClose();
  };

  const handleSwitchRole = async () => {
    setIsManageLoading(true);
    try {
      const response = await ApiServices.getUsersByTokenContact();
      if (response.data?.status === 'success') {
        localStorage.setItem("profile_modal_mode", "switch");
        setProfilesList(response.data.data);
        openProfileSelection();
        onClose();
      }
    } catch (error) {
      // console.error("Failed to fetch profiles", error);
    } finally {
      setIsManageLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
    onClose();
  };

  const confirmLogout = async () => {
    try {
      await ApiServices.signOut();
    } catch (error) {
      // console.error("Signout API failed", error);
    } finally {
      clearMenu();
      localStorage.removeItem("auth_token");
      logout();
      showToast("Signed out successfully", "success");
      navigate("/");
      setIsLogoutModalOpen(false);
    }
  };

  if (!isOpen && !isRoleSwitchOpen && !isLogoutModalOpen && !isManageLoading) return null;

  return (
    <>
      {/* Full Screen Overlay Loader for Manage Account */}
      {isManageLoading && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-xl">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          ref={dropdownRef}
          // The main card matches your exact height and width
          className="absolute -top-0  w-[273px] bg-white rounded-b-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-[9999] animate-in fade-in slide-in-from-top-5 duration-200 font-['Montserrat'] flex flex-col"
        >
          {/* Light Gray Profile Header - EXACT 273x75 with 24px bottom radius */}
          <div className="w-full h-[75px] bg-[#f0f2f5] rounded-b-[24px] px-5 flex items-center gap-3 shrink-0">
            <div className="w-[46px] h-[46px] rounded-full overflow-hidden flex-shrink-0 bg-white shadow-sm border border-gray-100">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[17px] font-bold text-gray-900 leading-tight tracking-wide truncate">{user?.name || 'User'}</span>
              <span className="text-[13px] font-medium text-gray-500 mt-0.5 tracking-wide truncate">{user?.email || ''}</span>
            </div>
          </div>

          {/* Menu Items List - 28px exactly from the left */}
          <div className="flex flex-col pl-[28px] py-4">
            <button
              onClick={handleManageAccount}
              disabled={isManageLoading}
              // EXACT Dimensions: width 205px, height 35px (~34.8px)
              className="w-full h-[35px] flex items-center text-left text-[15px] font-semibold text-gray-700 border-b-[1.5px] border-[#F2C94C] hover:text-black transition-colors disabled:opacity-50"
            >
              Manage Account
            </button>
            <button
            onClick={handleSwitchRole}
              // EXACT Dimensions: width 205px, height 35px (~34.8px)
              className="w-full h-[35px] flex items-center text-left text-[15px] font-semibold text-gray-700 border-b-[1.5px] border-[#F2C94C] hover:text-black transition-colors"
            >
              Switch Profile
            </button>
            {/* <button
              onClick={() => { navigate("/subscription-details"); onClose(); }}
              className="w-full h-[35px] flex items-center text-left text-[15px] font-semibold text-gray-700 border-b-[1.5px] border-[#F2C94C] hover:text-black transition-colors"
            >
              My Subscription Details
            </button>
            <button
              onClick={() => { navigate("/transaction-history"); onClose(); }}
              className="w-full h-[35px] flex items-center text-left text-[15px] font-semibold text-gray-700 border-b-[1.5px] border-[#F2C94C] hover:text-black transition-colors"
            >
              Transaction History
            </button> */}
            <button
              onClick={handleLogout}
              className="w-full h-[35px] flex items-center text-left text-[15px] font-semibold text-gray-700 hover:text-black transition-colors mt-0.5"
            >
              Sign-out
            </button>
          </div>

        </div>
      )}

      <RoleSwitchModal
        isOpen={isRoleSwitchOpen}
        onClose={() => setIsRoleSwitchOpen(false)}
      />

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default ProfileDropdown;