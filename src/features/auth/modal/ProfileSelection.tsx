import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/AuthContext";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useToast } from "../../../app/providers/ToastProvider";
import ApiServices from "../../../services/ApiServices";

const GRADIENTS = [
  "bg-gradient-to-tr from-[#00A8FF] to-[#8C52FF]", // Blue-Purple
  "bg-gradient-to-tr from-[#FF0076] to-[#590FB7]", // Pink-Purple
  "bg-gradient-to-tr from-[#00E5FF] to-[#1200FF]", // Cyan-Blue
  "bg-gradient-to-tr from-[#FF9100] to-[#FF0076]", // Orange-Pink
  "bg-gradient-to-tr from-[#00FF87] to-[#60EFFF]", // Green-Cyan
];

const resolveRole = (roleName?: string) => {
  if (!roleName) return "student" as any;
  const normalized = roleName.toLowerCase();
  switch (normalized) {
    case "student":
    case "teacher":
    case "principal":
    case "admin":
    case "parent":
      return normalized as any;
    case "institute_admin":
    case "institute admin":
      return "institute-admin" as any;
    case "private_tutor":
    case "private tutor":
      return "private-tutor" as any;
    default:
      return "student" as any;
  }
};

export const ProfileSelectionModal: React.FC = () => {
  const {
    isProfileSelectionOpen,
    closeProfileSelection,
    profilesList,
    openSelectRole,
    openSignIn,
    fetchMenu,
  } = useModal();

  // console.log("profilelist", profilesList);
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loadingProfileId, setLoadingProfileId] = useState<string | null>(null);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [forceLoginModal, setForceLoginModal] = useState<{
    isOpen: boolean;
    profile: any;
    message: string;
  }>({ isOpen: false, profile: null, message: "" });

  // Prevent background scroll
  useEffect(() => {
    if (isProfileSelectionOpen) {
      document.body.style.setProperty("overflow", "hidden", "important");
    } else {
      document.body.style.removeProperty("overflow");
    }
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isProfileSelectionOpen]);

  if (!isProfileSelectionOpen) return null;

  const handleProfileSelect = async (
    profile: any,
    forceLogin: boolean = false,
  ) => {
    const profileIdStr =
      profile.sub || String(profile.user_id) || profile.profile_id;
    try {
      setLoadingProfileId(profileIdStr);
      setProfileErrors((prev) => {
        const next = { ...prev };
        delete next[profileIdStr];
        return next;
      });
      const payload: any = {
        user_id: profileIdStr,
        subscription_id: profile.subscription_id || null,
      };

      if (forceLogin) {
        payload.force_login = true;
      }

      const res = await ApiServices.selectProfileV4(payload);

      if (res.data?.status === "success") {
        // Handle Force Login Required
        if (res.data.data?.requires_force_login) {
          setForceLoginModal({
            isOpen: true,
            profile,
            message:
              res.data.message ||
              "This profile is currently active on another device. Do you want to logout from there and login here?",
          });
          return;
        }

        // Intercept case where user is already actively logged in somewhere else
        // Backend returns success, but data is null with an error message
        if (!res.data.data) {
          const errMsg =
            res.data.message || "User already logged in. Please logout first.";
          setProfileErrors((prev) => ({ ...prev, [profileIdStr]: errMsg }));
          return; // Stop login execution
        }

        // The backend might return a new token on switch.
        // If it does, store it:
        if (res.data.data?.auth_token) {
          localStorage.setItem("auth_token", res.data.data.auth_token);
        }
        if (res.data.data?.refresh_token) {
          localStorage.setItem("refresh_token", res.data.data.refresh_token);
        }
        if (res.data.data?.subscription_token) {
          localStorage.setItem("subscription_token", res.data.data.subscription_token);
        }
        const activeRole = resolveRole(
          profile.role_name || profile.roles?.[0]?.role_name || "student",
        );

        login({
          id: profileIdStr,
          name: profile.name || profile.username,
          email: profile.email || "",
          role: activeRole,
        });

        localStorage.setItem("active_profile", JSON.stringify(profile));

        // Always fetch menu - it will handle no menu gracefully
        const menuItems = await fetchMenu();

        showToast(`Welcome back, ${profile.name}!`, "success");
        closeProfileSelection();
        setForceLoginModal({ isOpen: false, profile: null, message: "" });

        const subscriptionId =
          res.data.data?.subscription_id ?? profile.subscription_id ?? null;

        const studentDashboard = menuItems?.find(
          (item: any) => item.page_name?.toLowerCase().includes("learning planner")
        )?.route || "/learning-planner";

        const teacherDashboard = menuItems?.find(
          (item: any) => item.page_name?.toLowerCase().includes("syllabus planner")
        )?.route || "/teacher/teacherlearning-planner";

        const dashboardRoute = activeRole.toLowerCase() === "teacher" ? teacherDashboard : studentDashboard;

        if (!subscriptionId) {
          let profileRoute = "/profile";
          if (activeRole.toLowerCase().includes("institute")) {
            profileRoute = "/institute-admin/profile";
          } else if (activeRole.toLowerCase().includes("tutor")) {
            profileRoute = "/private-tutor/profile";
          }

          navigate(profileRoute, {
            replace: true,
            state: {
              preselectedAcademicDetails: {
                board_id: profile.board_id || "",
                class_id: profile.class_id || "",
                institute_id: profile.institute_id || "",
              },
            },
          });
        } else {
          navigate(dashboardRoute, { replace: true });
        }
      } else {
        showToast(res.data?.message || "Failed to switch profile", "error");
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setLoadingProfileId(null);
    }
  };

  const handleAddProfile = () => {
    closeProfileSelection();
    openSelectRole(); // Open profile completion to register a new one
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overscroll-contain">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm touch-none" />

      {/* Modal Container */}
      {/* <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full md:min-h-[26rem] max-h-[95vh] flex flex-col md:flex-row overflow-hidden"> */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full md:min-h-[26rem] max-h-[95vh] flex flex-col md:flex-row overflow-hidden">
        {/* Left Side Illustration */}
        <div className="hidden md:flex md:w-[40%] bg-[#f8fafc] items-center justify-center p-8">
          <div className="relative w-full max-w-sm">
            <img
              src="/image84.svg"
              alt="Students Illustration"
              className="w-full h-auto drop-shadow-sm"
            />
          </div>
        </div>

        {/* Right Side Form Content */}
        <div className="w-full md:w-[60%] flex flex-col h-full bg-white relative py-4">
          <button
            onClick={() => {
              closeProfileSelection();
              if (!isAuthenticated) {
                openSignIn();
              }
            }}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
          >
            <svg
              className="w-5 h-5"
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

          <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              Who's logging in?
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Select your profile to continue.
            </p>
          </div>

          <div className="flex-1 px-6 sm:px-10 pb-8 overflow-y-auto overflow-x-visible pt-4 custom-scrollbar max-h-[45vh]">
            {" "}
            <div className="flex flex-wrap gap-x-6 gap-y-8 justify-start pt-2">
              {profilesList.map((profile, index) => {
                const profileIdStr =
                  profile.sub || String(profile.user_id) || profile.profile_id;
                const gradient = GRADIENTS[index % GRADIENTS.length];
                const isLoading = loadingProfileId === profileIdStr;
                const firstLetter = profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : "U";
                const hasError = !!profileErrors[profileIdStr];
                const isSessionActive = profile.session_active;

                return (
                  <div
                    key={profileIdStr}
                    className="flex flex-col items-center group cursor-pointer w-[80px] sm:w-[90px] relative"
                    onClick={() => !isLoading && handleProfileSelect(profile)}
                  >
                    <div className="relative">
                      <div
                        className={`
                          w-[75px] h-[75px] sm:w-[85px] sm:h-[85px] rounded-full 
                          ${gradient} 
                          flex items-center justify-center 
                          transition-all duration-300 ease-out
                          group-hover:scale-105 group-hover:shadow-lg
                          shadow-md opacity-90 group-hover:opacity-100
                          relative overflow-hidden
                          ${isLoading ? "animate-pulse" : ""}
                          ${hasError ? "ring-2 ring-red-500 ring-offset-2" : isSessionActive ? "ring-2 ring-green-500 ring-offset-2" : ""}
                        `}
                      >
                        {isLoading ? (
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <div className="text-white font-bold text-3xl">
                            {firstLetter}
                          </div>
                        )}
                      </div>

                      {hasError ? (
                        <div className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          <div className="hidden group-hover:block absolute bottom-full mb-2 w-max max-w-[150px] bg-gray-800 text-white text-[10px] rounded px-2 py-1 z-50 text-center leading-relaxed whitespace-pre-wrap shadow-xl">
                            {profileErrors[profileIdStr]}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      ) : isSessionActive ? (
                        <div className="absolute top-0 right-0 bg-green-500 text-white p-0.5 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-3 text-center w-full">
                      <p
                        className={`font-medium text-sm transition-colors truncate ${hasError ? "text-red-500" : isSessionActive ? "text-green-600" : "text-gray-800 group-hover:text-primary"}`}
                      >
                        {profile.name}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        @{profile.username}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {profile.role_name}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Add Profile Button */}
              {localStorage.getItem("profile_modal_mode") !== "switch" && (profilesList.length === 0 || profilesList.some(p => p.role_id === 2 || p.role_name?.toLowerCase() === 'parent')) && (
              <div
                className="flex flex-col items-center group cursor-pointer w-[80px] sm:w-[90px]"
                onClick={handleAddProfile}
              >
                <div className="w-[75px] h-[75px] sm:w-[85px] sm:h-[85px] rounded-full bg-gray-50 flex items-center justify-center transition-all duration-300 ease-out group-hover:bg-gray-100 group-hover:scale-105 border-2 border-dashed border-gray-300 group-hover:border-gray-400 shadow-sm">
                  <span className="text-gray-400 text-3xl font-light group-hover:text-gray-600 transition-colors">
                    +
                  </span>
                </div>
                <div className="mt-3 text-center w-full">
                  <p className="text-gray-600 font-medium text-sm group-hover:text-gray-800 transition-colors">
                    Add Profile
                  </p>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Force Login Confirmation Modal */}
      {forceLoginModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Active Session Found
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {forceLoginModal.message}
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() =>
                    setForceLoginModal({
                      isOpen: false,
                      profile: null,
                      message: "",
                    })
                  }
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {/* <button
                  onClick={() => handleProfileSelect(forceLoginModal.profile, true)}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 shadow-md transition-colors"
                >
                  Okay
                </button> */}
                <button
                  onClick={() =>
                    handleProfileSelect(forceLoginModal.profile, true)
                  }
                  disabled={!!loadingProfileId}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold shadow-md transition-colors flex items-center justify-center gap-2 ${
                    loadingProfileId
                      ? "bg-button-primary opacity-70 text-primary cursor-not-allowed" // Fixed here
                      : "bg-button-primary text-primary hover:opacity-90"
                  }`}
                >
                  {loadingProfileId ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Okay...
                    </>
                  ) : (
                    "Okay"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProfileSelection: React.FC = () => {
  // const { openProfileSelection } = useModal();
  // React.useEffect(() => {
  //   openProfileSelection();
  // }, [openProfileSelection]);
  return <ProfileSelectionModal />;
};

export default ProfileSelection;
