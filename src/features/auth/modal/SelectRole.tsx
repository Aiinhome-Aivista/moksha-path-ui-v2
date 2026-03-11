import React, { useState, useEffect, useRef } from "react";
import { useModal } from "../context/AuthContext";
import { useToast } from "../../../app/providers/ToastProvider";
import { useNavigate } from "react-router-dom";
import ApiServices from "../../../services/ApiServices";
import { useAuth } from "../../../app/providers/AuthProvider";
import SearchableSelect from "../../../components/common/SearchableSelect";
import type { Role as GlobalRole } from "../../../config/roles";
import { DEFAULT_ROLE } from "../../../config/roles";

const resolveRoleFromBackend = (roleName?: string): GlobalRole => {
  if (!roleName) return DEFAULT_ROLE;

  const normalized = roleName.toLowerCase();

  switch (normalized) {
    case "student":
    case "teacher":
    case "principal":
    case "admin":
    case "parent":
      return normalized as GlobalRole;
    default:
      return DEFAULT_ROLE;
  }
};

interface Role {
  role_id: number;
  role_name: string;
}

export const SelectRoleModal: React.FC = () => {
  const [yourName, setYourName] = useState("");
  const [profileName, setProfileName] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  // Student Specific State
  const [boards, setBoards] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [dependencyMap, setDependencyMap] = useState<any[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<number | "">("");
  const [selectedClassId, setSelectedClassId] = useState<number | "">("");
  const [selectedInstituteId, setSelectedInstituteId] = useState<number | "">(
    "",
  );
  const [profileNameErrorPopup, setProfileNameErrorPopup] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    isSelectRoleOpen,
    closeSelectRole,
    openProfileSelection,
    profilesList,
    // setProfilesList,
    openLogin,
    fetchMenu,
    // decodeUserToken,
    initialAuthIdentifier,
    handleSignInSuccess,
  } = useModal();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Custom Scrollbar Styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #cbd5e1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isSelectRoleOpen) {
      document.body.style.setProperty("overflow", "hidden", "important");
      document.documentElement.style.setProperty(
        "overflow",
        "hidden",
        "important",
      );
    } else {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");

      // Reset form on close
      setYourName("");
      setProfileName("");
      setSelectedRoleId(null);
      setIsDropdownOpen(false);
    }
    return () => {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    };
  }, [isSelectRoleOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Auto-scroll to dropdown when opened
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      setTimeout(() => {
        dropdownRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [isDropdownOpen]);

  // Fetch roles and master data as soon as modal opens
  useEffect(() => {
    if (isSelectRoleOpen) {
      const fetchData = async () => {
        // Fetch dynamic roles
        try {
          const rolesRes = await ApiServices.getRoles();
          if (
            rolesRes.data?.status === "success" &&
            Array.isArray(rolesRes.data.data)
          ) {
            setRoles(rolesRes.data.data);
          }
        } catch (error) {
          // console.error("Error fetching roles:", error);
        }

        // Fetch academic master data
        try {
          const res = await ApiServices.getAcademicMasterData();
          if (res.data?.status === "success") {
            setBoards(res.data.data.boards || []);
            setClasses(res.data.data.classes || []);
            setInstitutes(res.data.data.schools || []);
            setDependencyMap(res.data.data.dependency_map || []);
          }
        } catch (error) {
          // console.error("Error fetching master data:", error);
        }
      };
      fetchData();
    }
  }, [isSelectRoleOpen]);

  // Reset student fields if role changes
  useEffect(() => {
    if (selectedRoleId !== 1) {
      setSelectedBoardId("");
      setSelectedClassId("");
      setSelectedInstituteId("");
    }
  }, [selectedRoleId]);

  const isFormValid =
    yourName.trim() !== "" &&
    profileName.trim() !== "" &&
    selectedRoleId !== null &&
    (selectedRoleId === 1
      ? selectedBoardId !== "" &&
      selectedClassId !== "" &&
      selectedInstituteId !== ""
      : true);

  const handleNext = async () => {
    if (!isFormValid) return;

    try {
      setIsLoading(true);

      // 1. Add Profile API
      const payload: any = {
        actual_name: yourName,
        profile_name: profileName,
        role_id: selectedRoleId,
      };

      if (selectedRoleId === 1) {
        payload.board_id = selectedBoardId;
        payload.class_id = selectedClassId;
        payload.institute_id = selectedInstituteId;
      }

      const addRes = await ApiServices.addProfileV4(payload);

      // Profile name already exists case
      if (addRes.data?.status === "success" && !addRes.data?.data) {
        setProfileNameErrorPopup({
          open: true,
          message: addRes.data.message,
        });
        return;
      }

      if (addRes.data?.status === "success") {
        const data = addRes.data.data;

        // If we are adding a profile from an already authenticated session, sign out the old one
        if (isAuthenticated) {
          try {
            await ApiServices.signOut();
          } catch (error) {
            // console.error("Failed to sign out previous session:", error);
          }
        }

        // Update tokens with the new profile's credentials
        // if (data?.token) {
        //   localStorage.setItem("auth_token", data.token);
        // }
        // if (data?.refresh_token) {
        //   localStorage.setItem("refresh_token", data.refresh_token);
        // }
        if (data?.subscription_token) {
          localStorage.setItem("subscription_token", data.subscription_token);
        }

        if (data?.user) {
          const user = data.user;
          const activeRole = resolveRoleFromBackend(
            user.roles?.[0]?.role_name || "student",
          );

          // Prepare the profile object for local storage consistency
          const profileForStorage = {
            ...user,
            role_name: user.roles?.[0]?.role_name || "student",
            subscription_id:
              user.sub_id || user.roles?.[0]?.subscription_id || null,
          };
          localStorage.setItem(
            "active_profile",
            JSON.stringify(profileForStorage),
          );

          login({
            id: user.sub,
            name: user.name || yourName || "User",
            email: user.email || initialAuthIdentifier,
            role: activeRole,
          });

          // 2. Refresh context data
          await fetchMenu(); // Always fetch menu

          handleSignInSuccess();
          showToast("Profile created and logged in successfully", "success");

          closeSelectRole();

          // Navigate based on subscription status of the new profile
          const subId = user.sub_id ?? user.roles?.[0]?.subscription_id;

          if (subId === null || subId === undefined) {
            navigate("/subscription", {
              replace: true,
              state: {
                preselectedAcademicDetails: {
                  board_id: selectedBoardId,
                  class_id: selectedClassId,
                  institute_id: selectedInstituteId,
                },
              },
            });
          } else {
            const role = activeRole.toLowerCase();
            if (role === "teacher") {
              navigate("/teacher/dashboard", { replace: true });
            } else if (role === "parent") {
              navigate("/parent/dashboard", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          }
        } else {
          // Fallback if user object is not in response
          // await decodeUserToken();
          await fetchMenu(); // Always fetch menu
          closeSelectRole();

          const subscriptionId = data?.subscription_id || data?.user?.sub_id;
          if (!subscriptionId) {
            navigate("/subscription", {
              replace: true,
              state: {
                preselectedAcademicDetails: {
                  board_id: selectedBoardId,
                  class_id: selectedClassId,
                  institute_id: selectedInstituteId,
                },
              },
            });
          } else {
            const userRoleName =
              roles.find((r) => r.role_id === selectedRoleId)?.role_name ||
              "student";
            const userRole = resolveRoleFromBackend(userRoleName);
            const role = userRole.toLowerCase();
            if (role === "teacher") {
              navigate("/teacher/dashboard", { replace: true });
            } else if (role === "parent") {
              navigate("/parent/dashboard", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          }
        }
      } else {
        showToast(addRes.data?.message || "Failed to add profile", "error");
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "An error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setYourName("");
    setProfileName("");
    setSelectedRoleId(null);
    setIsDropdownOpen(false);
    closeSelectRole();

    if (profilesList && profilesList.length > 0) {
      openProfileSelection();
    } else {
      openLogin();
    }
  };

  if (!isSelectRoleOpen) return null;

  return (
    // <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overscroll-contain">
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm touch-none" />

      {/* Modal Container - Smaller & Single Column */}
      {/* <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"> */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full 
                max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Compact Form Content */}
        <div className="w-full flex flex-col min-h-0 bg-white">
          {/* Header - Fixed at top */}
          <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-4 relative flex-shrink-0">
            <button
              onClick={handleCancel}
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Complete Profile
            </h1>
            <p className="text-gray-500 text-sm">
              Please provide your personal details
            </p>
          </div>

          {/* Body - Scrollable */}
          {/* <div className="px-6 sm:px-10 pb-8 overflow-y-auto custom-scrollbar flex-grow"> */}
          <div className="px-6 sm:px-10 pb-8 overflow-y-auto custom-scrollbar flex-1 min-h-0">
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 bg-gray-50/50"
                />
              </div>

              {/* Profile Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Home, Office"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 bg-gray-50/50"
                />
              </div>

              {/* Role Selection */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Select Role
                </label>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-left flex items-center justify-between hover:border-gray-300 transition-all outline-none"
                >
                  <span
                    className={
                      selectedRoleId ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {selectedRoleId
                      ? roles.find((r) => r.role_id === selectedRoleId)
                        ?.role_name
                      : "Choose your role"}
                  </span>
                  {/* <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg> */}
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {roles.map((role) => (
                      <button
                        key={role.role_id}
                        onClick={() => {
                          setSelectedRoleId(role.role_id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 ${selectedRoleId === role.role_id
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {role_name_map[role.role_name] || role.role_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Student Academic Details */}
              {selectedRoleId === 1 && (() => {
                const validDependencies = dependencyMap.filter((dep) => {
                  if (selectedBoardId && dep.board_id !== Number(selectedBoardId)) return false;
                  if (selectedInstituteId && dep.school_id !== Number(selectedInstituteId)) return false;
                  if (selectedClassId && dep.class_id !== Number(selectedClassId)) return false;
                  return true;
                });

                const useFilter = selectedBoardId !== "" || selectedInstituteId !== "" || selectedClassId !== "";

                const validBoards = useFilter ? Array.from(new Set(validDependencies.map((d) => d.board_id))) : boards.map((b) => b.id);
                const validSchools = useFilter ? Array.from(new Set(validDependencies.map((d) => d.school_id))) : institutes.map((s) => s.id);
                const validClasses = useFilter ? Array.from(new Set(validDependencies.map((d) => d.class_id))) : classes.map((c) => c.id);

                const filteredBoards = useFilter ? boards.filter((b) => validBoards.includes(b.id)) : boards;
                const filteredSchools = useFilter ? institutes.filter((s) => validSchools.includes(s.id)) : institutes;
                const filteredClasses = useFilter ? classes.filter((c) => validClasses.includes(c.id)) : classes;

                // Automatically clear selections if they are no longer in the valid options
                if (selectedBoardId !== "" && !filteredBoards.some(b => b.id === selectedBoardId)) {
                  setSelectedBoardId("");
                }
                if (selectedInstituteId !== "" && !filteredSchools.some(s => s.id === selectedInstituteId)) {
                  setSelectedInstituteId("");
                }
                if (selectedClassId !== "" && !filteredClasses.some(c => c.id === selectedClassId)) {
                  setSelectedClassId("");
                }

                return (
                  <div className="space-y-4 pt-2 animate-in fade-in zoom-in-95 duration-300">
                    {/* Select Board */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Board
                      </label>
                      <SearchableSelect
                        value={selectedBoardId}
                        onChange={(val) => {
                          if (val === "") {
                            setSelectedBoardId("");
                            setSelectedInstituteId("");
                            setSelectedClassId("");
                          } else {
                            setSelectedBoardId(Number(val));
                          }
                        }}
                        options={filteredBoards.map((b) => ({ value: b.id, label: b.name }))}
                        placeholder="Select Board"
                        className="w-full py-2.5 rounded-xl border border-gray-200 bg-blue-50/30 text-gray-900 outline-none focus:border-blue-400 transition-all text-sm appearance-none cursor-pointer px-4"
                        dropdownClassName="w-full"
                      />
                    </div>

                    {/* School/College */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        School/Institute
                      </label>
                      <SearchableSelect
                        value={selectedInstituteId}
                        onChange={(val) => {
                          if (val === "") {
                            setSelectedBoardId("");
                            setSelectedInstituteId("");
                            setSelectedClassId("");
                          } else {
                            setSelectedInstituteId(Number(val));
                          }
                        }}
                        options={filteredSchools.map((i) => ({ value: i.id, label: i.name }))}
                        placeholder="Select Institute"
                        className="w-full py-2.5 rounded-xl border border-gray-200 bg-blue-50/30 text-gray-900 outline-none focus:border-blue-400 transition-all text-sm appearance-none cursor-pointer px-4"
                        dropdownClassName="w-full"
                      />
                    </div>

                    {/* Class/Standard */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Class/Standard
                      </label>
                      <SearchableSelect
                        value={selectedClassId}
                        onChange={(val) => {
                          if (val === "") {
                            setSelectedBoardId("");
                            setSelectedInstituteId("");
                            setSelectedClassId("");
                          } else {
                            setSelectedClassId(Number(val));
                          }
                        }}
                        options={filteredClasses.map((c) => ({ value: c.id, label: c.name }))}
                        placeholder="Select Class"
                        className="w-full py-2.5 rounded-xl border border-gray-200 bg-blue-50/30 text-gray-900 outline-none focus:border-blue-400 transition-all text-sm appearance-none cursor-pointer px-4"
                        dropdownClassName="w-full"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={handleNext}
              disabled={!isFormValid || isLoading}
              className={`w-full py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] ${isFormValid && !isLoading
                ? "bg-[#aad02b] text-gray-800 hover:bg-[#c2e84a] shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-800/30 border-t-gray-800 rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </div>
      </div>

      {profileNameErrorPopup.open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Profile Name Exists
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              {profileNameErrorPopup.message}
            </p>

            <button
              onClick={() =>
                setProfileNameErrorPopup({
                  open: false,
                  message: "",
                })
              }
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const role_name_map: Record<string, string> = {
  Student: "Student",
  Teacher: "Teacher",
  Parent: "Parent",
  "Super Admin": "Super Admin",
};

// export const SelectRole: React.FC = () => {
//   const { openSelectRole } = useModal();
//   useEffect(() => {
//     openSelectRole();
//   }, [openSelectRole]);
//   return <SelectRoleModal />;
// };
export const SelectRole: React.FC = () => {
  return <SelectRoleModal />;
};
export default SelectRole;