import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import ApiServices from "../../../services/ApiServices";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  profile_id: number;
  role_name: string;
  username: string;
  plan_name: string | null;
  subscription_status: string | null;
  subscription_name: string | null;
  is_default: number;
}

export const RoleSwitchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const res = await ApiServices.getUserProfiles();

        if (res.data.status === "success") {
          setProfiles(res.data.data);
        }
      } catch (err) {
        // console.error("Role fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [isOpen]);

  // Prevent background scroll when modal is open (Bulletproof Mobile Fix)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleRoleSwitch = async (profile: UserProfile) => {
    try {
      setLoading(true);

      const payload = {
        profile_id: profile.profile_id,
      };

      const res = await ApiServices.switchUserProfile(payload);

      //  Console full response
      // console.log("Switch role full response:", res);
      // console.log("Switch role response data:", res.data);

      if (res.data.status === "success") {
        // optional: store selected profile locally
        localStorage.setItem("active_profile", JSON.stringify(profile));

        // Navigate based on role
        const role = res.data.data?.active_profile?.role?.toLowerCase();
        // console.log("Role after switch:", role);

        if (role === "student") {
          navigate("/dashboard");
        } else if (role === "parent") {
          navigate("/parent/dashboard");
        } else if (role === "teacher") {
          navigate("/teacher/dashboard");
        } else {
          // Default navigation for other roles
          navigate("/dashboard");
        }

        onClose();
      }
    } catch (error) {
      // console.error("Switch role failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity touch-none" 
        onClick={onClose}
      />
      
      {/* Modal - Bottom Sheet on Mobile, Centered on Desktop */}
      <div className="relative bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-lg shadow-2xl animate-[slideUp_0.3s_ease-out] sm:animate-[fadeIn_0.2s_ease-out] flex flex-col max-h-[90vh]">
        
        {/* Mobile Drag Indicator */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b flex justify-between items-center shrink-0">
          <h2 className="text-lg sm:text-base font-semibold text-gray-800">
            Switch Role
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl sm:text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:py-3 overflow-y-auto flex-1 custom-scrollbar">
          {loading && (
            <p className="text-sm text-gray-500 text-center py-6">
              Loading profiles...
            </p>
          )}

          {!loading &&
            profiles.map((profile) => (
              <div
                key={profile.profile_id}
                onClick={() => handleRoleSwitch(profile)}
                className={`
                  flex items-center justify-between px-4 py-4 sm:py-3 mb-3 rounded-xl sm:rounded-lg border-2 cursor-pointer transition-all duration-300 group
                  ${
                    profile.is_default === 1
                      ? "bg-gradient-to-r from-[#BADA55]/10 to-lime-50 border-[#BADA55] shadow-md shadow-[#BADA55]/20 hover:shadow-lg hover:shadow-[#BADA55]/30"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-0">
                    <p
                      className={`text-base sm:text-sm font-semibold transition-colors ${
                        profile.is_default === 1
                          ? "text-gray-800"
                          : "text-gray-700 group-hover:text-gray-800"
                      }`}
                    >
                      {profile.username}
                    </p>
                    {profile.is_default === 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#BADA55] text-gray-800 text-[10px] sm:text-xs font-bold">
                        <span
                          style={{ fontVariationSettings: "'wght' 600, 'opsz' 18" }}
                          className="material-symbols-outlined text-[12px] sm:text-sm"
                        >
                          check_circle
                        </span>
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm sm:text-xs transition-colors ${
                      profile.is_default === 1
                        ? "text-gray-600"
                        : "text-gray-500"
                    }`}
                  >
                    {profile.role_name}
                  </p>
                </div>

                <div className="text-right ml-3">
                  {profile.subscription_name && (
                    <p
                      className={`text-[11px] sm:text-xs font-medium mb-1 ${
                        profile.is_default === 1
                          ? "text-[#8a9f3b] sm:text-[#BADA55]"
                          : "text-gray-500"
                      }`}
                    >
                      {profile.subscription_name}
                    </p>
                  )}
                  {profile.is_default === 1 && (
                    <span
                      style={{ fontVariationSettings: "'wght' 600, 'opsz' 24" }}
                      className="material-symbols-outlined text-[#BADA55] text-xl sm:text-lg"
                    >
                      arrow_forward
                    </span>
                  )}
                </div>
              </div>
            ))}

          {!loading && profiles.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              No linked profiles found
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 sm:py-3 border-t flex justify-center sm:justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 sm:py-1.5 text-base sm:text-sm font-medium text-gray-700 bg-gray-100 sm:bg-transparent rounded-xl sm:rounded-none hover:bg-gray-200 sm:hover:bg-transparent sm:hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    , document.body
  );
};

export default RoleSwitchModal;