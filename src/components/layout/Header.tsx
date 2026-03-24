// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useModal } from "../../features/auth/context/AuthContext";
// import { useAuth } from "../../app/providers/AuthProvider";
// import { LogoutConfirmationModal } from "../../features/auth/modal/LogoutConfirmationModal";
// import ApiServices from "../../services/ApiServices";
// import { useToast } from "../../app/providers/ToastProvider";
// import { UserCircle } from "lucide-react";
// import { RoleSwitchModal } from "../../features/auth/modal/RoleSwitchModal";

// interface HeaderProps {
//   isSidebarOpen: boolean;
// }

// export const Header: React.FC<HeaderProps> = ({ isSidebarOpen }) => {
//   const { openSignIn, clearMenu } = useModal();
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
//   const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
//   const { showToast } = useToast();

//   const handleLogout = () => {
//     setIsLogoutModalOpen(true);
//   };

//   // const confirmLogout = () => {
//   //     localStorage.removeItem("auth_token");
//   //     logout();
//   //     navigate("/");
//   //     setIsLogoutModalOpen(false);
//   // };

//   const confirmLogout = async () => {
//     try {
//       // Call backend signout API
//       await ApiServices.signOut();
//     } catch (error) {
//       console.error("Header signout API failed", error);
//       //  Still continue logout even if API fails
//     } finally {
//       clearMenu();
//       //  Clear frontend session
//       localStorage.removeItem("auth_token");
//       logout();
//       showToast("Signed out successfully", "success");
//       navigate("/");
//       setIsLogoutModalOpen(false);
//     }
//   };

//   return (
//     <>
//       <header className="sticky top-0 z-40 h-16 bg-white dark:bg-secondary-900 border-secondary-200 dark:border-secondary-700 shadow-sm">
//         <div className="h-full px-4 lg:px-6 flex items-center justify-between">
//           {/* Logo & App Name - Only show when sidebar is CLOSED (mini) */}
//           <div className="flex items-center gap-4">
//             {!isSidebarOpen && (
//               <div className="flex items-center animate-fade-in">
//                 <img src="/Logo.svg" alt="App Logo" className="h-25, w-25" />
//               </div>
//             )}
//           </div>
//           <div className="flex-1 flex justify-center">
// <div className="flex items-center absolute left-80 z-10 bg-yellow-400 rounded-b-full px-6  gap-6">
//               <button className="text-sm font-semibold text-black">
//                 Request a Demo
//               </button>
//               <button className="text-sm font-semibold text-black">FAQs</button>
//               <button className="text-sm font-semibold text-black">
//                 Help Center
//               </button>
//             </div>
//         <div className="flex items-center relative top-0 bg-[#E9E9E9] rounded-b-full  pt-5 pb-6 pl-72 pr-6 gap-6">
//               {/* Yellow Highlight Section */}

//               {/* Other Menu Items */}
//               <button className="text-sm font-semibold text-gray-700">
//                 About us
//               </button>
//               <button className="text-sm font-semibold text-gray-700">
//                 Vidya Kosh
//               </button>
//               <button className="text-sm font-semibold text-gray-700">
//                 Success Stories
//               </button>
//               <button className="text-sm font-semibold text-gray-700">
//                 Institutional Access
//               </button>
//               {/* <button
//                 onClick={openSignIn}
//                 className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-lime-600 transition-colors shadow-md hover:shadow-lg"
//               >
//                 Sign In
//               </button> */}
//               <button
//                 onClick={isAuthenticated ? handleLogout : openSignIn}
//                 className={`text-sm font-semibold text-gray-700 hover:text-gray-900 ${isAuthenticated ? "bg-red-500 hover:bg-red-600 rounded-full px-4" : ""}`}
//               >
//                 {isAuthenticated ? "Sign Out" : "Sign In"}
//               </button>
//             </div>
//             <div className="flex items-center gap-4">
//               {isAuthenticated && (
//                 <button
//                   onClick={() => setIsRoleModalOpen(true)}
//                   className="p-2 rounded-full hover:bg-gray-100 transition"
//                   title="Switch Role"
//                 >
//                   <UserCircle size={28} className="text-gray-700" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <LogoutConfirmationModal
//         isOpen={isLogoutModalOpen}
//         onClose={() => setIsLogoutModalOpen(false)}
//         onConfirm={confirmLogout}
//       />

//       <RoleSwitchModal
//         isOpen={isRoleModalOpen}
//         onClose={() => setIsRoleModalOpen(false)}
//       />
//     </>
//   );
// };

// export default Header;
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../../features/auth/context/AuthContext";
import { useAuth } from "../../app/providers/AuthProvider";
import { LogoutConfirmationModal } from "../../features/auth/modal/LogoutConfirmationModal";
import ApiServices from "../../services/ApiServices";
import { useToast } from "../../app/providers/ToastProvider";
import { UserCircle } from "lucide-react";
import { ProfileDropdown } from "../../features/auth/modal/ProfileDropdown";

interface HeaderProps {
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ }) => {
  const { openSignIn, clearMenu } = useModal();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { showToast } = useToast();

  const confirmLogout = async () => {
    try {
      await ApiServices.signOut();
    } catch (error) {
      // console.error("Header signout API failed", error);
    } finally {
      clearMenu();
      localStorage.removeItem("auth_token");
      logout();
      showToast("Signed out successfully", "success");
      navigate("/");
      setIsLogoutModalOpen(false);
    }
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      const role = user?.role?.toLowerCase();
      if (role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (role === "parent") {
        navigate("/parent/dashboard");
      } else {
        // Default for student and other roles
        navigate("/dashboard");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {/* Changed lg: to xl: for structural height so iPad uses the flexible auto-height */}
      <header className="sticky top-0 z-40 bg-gray-100 dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 shadow-sm h-auto min-h-[3.5rem] xl:h-14 py-2 xl:py-0 overflow-hidden xl:overflow-visible">
        {/* Changed lg:flex-nowrap to xl:flex-nowrap so iPad wraps properly */}
        <div className="w-full px-2 lg:px-6 flex flex-wrap xl:flex-nowrap items-center justify-between relative h-full">
          
          {/* LOGO - Order 1 */}
          <div className="flex items-center gap-4 flex-shrink-0 z-20 bg-gray-100 dark:bg-secondary-900 pr-2 order-1 xl:h-full">
            <div className="flex items-center gap-2 font-bold text-lg cursor-pointer" onClick={handleLogoClick}>
              <img src="/logogod.svg" alt="logo" className="w-8 h-8 lg:w-10 lg:h-10" />
              <div className="block">
                <h3>
                  Moksh<span className="text-xl text-[#E7842E]">Path</span>
                </h3>
                <p className="text-[10px] lg:text-xs leading-none font-normal">
                  Guided Path to True Learning
                </p>
              </div>
            </div>
          </div>

          {/* PROFILE - Order 2 on Mobile/iPad, Order 3 on Desktop */}
          <div className="flex items-center justify-end flex-shrink-0 z-20 bg-gray-100 dark:bg-secondary-900 pl-2 order-2 xl:order-3 ml-auto xl:ml-0 xl:h-full">
            {isAuthenticated && user?.role !== 'admin' && (
              <div className="relative flex items-center justify-center">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="p-1 lg:p-2 rounded-full hover:bg-gray-100 transition"
                  title="Profile Menu"
                >
                  <UserCircle size={28} className="text-gray-700 w-6 h-6 lg:w-7 lg:h-7" />
                </button>

                <ProfileDropdown
                  isOpen={isProfileDropdownOpen}
                  onClose={() => setIsProfileDropdownOpen(false)}
                />
              </div>
            )}
          </div>

          {/* MIDDLE NAV - Order 3 on Mobile/iPad (Drops to next line), Order 2 on Desktop */}
          <div className="w-full xl:w-auto xl:flex-1 flex justify-center items-center mt-3 xl:mt-0 order-3 xl:order-2 xl:h-full">
            <div className="flex flex-wrap xl:flex-nowrap items-center justify-center w-full xl:w-auto xl:h-auto gap-2 xl:gap-0">
              
              {/* YELLOW PILL - Uses xl: for absolute positioning so iPad stays safe */}
              <div className="flex flex-wrap xl:flex-nowrap items-center justify-center relative xl:absolute xl:left-1/2 xl:-translate-x-full z-20 xl:z-10 bg-yellow-500 rounded-b-[1.5rem] xl:rounded-b-full px-2 xl:px-0 xl:pl-10 xl:pr-12 py-2 xl:py-0 gap-2 xl:gap-3 xl:top-0 w-full md:w-auto xl:w-auto">
                <button className="text-[11px] lg:text-sm font-semibold text-black whitespace-nowrap">
                  Request a Demo
                </button>
                <button className="text-[11px] lg:text-sm font-semibold text-black whitespace-nowrap">FAQs</button>
                <button className="text-[11px] lg:text-sm font-semibold text-black whitespace-nowrap">
                  Help Center
                </button>
              </div>

              {/* GRAY PILL - Uses xl: for massive padding so iPad stays safe */}
              <div className="flex flex-wrap xl:flex-nowrap items-center justify-center relative bg-[#E9E9E9] rounded-b-[1.5rem] xl:rounded-b-full px-2 xl:px-0 xl:pl-72 xl:pr-6 py-2 xl:pt-5 xl:pb-4 gap-2 xl:gap-6 xl:ml-0 xl:top-0 z-10 xl:z-auto w-full md:w-auto xl:w-auto mt-2 md:mt-0 xl:mt-0">
                <button disabled className="text-[11px] lg:text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                  About us
                </button>
                <button disabled className="text-[11px] lg:text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                  Vidya Kosh
                </button>
                <button disabled className="text-[11px] lg:text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                  Success Stories
                </button>
                <button disabled className="text-[11px] lg:text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                  Institutional Access
                </button>
                <button
                  onClick={() => navigate("/blogs")}
                  className="text-[11px] lg:text-sm font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap"
                >
                  Blogs
                </button>
                {!isAuthenticated && !location.pathname.startsWith('/admin') && (
                  <button
                    onClick={openSignIn}
                    className="text-[11px] lg:text-sm font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </header>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default Header;