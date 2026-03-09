import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import {
  useModal,
  type PageAccessItem,
} from "../../features/auth/context/AuthContext";
import { LogoutConfirmationModal } from "../../features/auth/modal/LogoutConfirmationModal";
import {
  X,
  LogOut,
  Home,
  User,
  CreditCard,
  Wallet,
  Calendar,
  BookOpen,
  FileText,
  NotebookPen,
  Video,
  Edit,
  Award,
  Bell,
  Mail,
  ChevronRight,
  Menu,
  type LucideIcon,
} from "lucide-react";
import ApiServices from "../../services/ApiServices";
import { useToast } from "../../app/providers/ToastProvider";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Map API icon strings (lowercase) to Lucide components
const IconMap: Record<string, LucideIcon> = {
  home: Home,
  user: User,
  "credit-card": CreditCard,
  wallet: Wallet,
  calendar: Calendar,
  book: BookOpen,
  "file-text": FileText,
  "notebook-pen": NotebookPen,
  video: Video,
  edit: Edit,
  award: Award, 
  notification: Bell,
  invitation: Mail,
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout, isAuthenticated } = useAuth();
  const { menuItems, isMenuLoaded, fetchMenu, clearMenu } = useModal();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { showToast } = useToast();

  const staticMenuItems: PageAccessItem[] = [
    // {
    //   page_id: 1,
    //   page_name: "Dashboard",
    //   icon: "home",
    //   route: "/dashboard",
    // },
    // {
    //   page_id: 2,
    //   page_name: "My Profile",
    //   icon: "user",
    //   route: "/profile",
    // },
    // {
    //   page_id: 6,
    //   page_name: "Subscription",
    //   icon: "credit-card",
    //   route: "/subscription",
    // },
    // {
    //   page_id: 7,
    //   page_name: "Payment",
    //   icon: "wallet",
    //   route: "/payment",
    // },
    // {
    //   page_id: 8,
    //   page_name: "Learning Planner",
    //   icon: "calendar",
    //   route: "/learning-planner",
    // },
    // {
    //   page_id: 9,
    //   page_name: "Study Materials",
    //   icon: "book",
    //   route: "/student-materials",
    // },
    // {
    //   page_id: 10,
    //   page_name: "Test Papers",
    //   icon: "file-text",
    //   route: "/test-papers",
    // },
    // {
    //   page_id: 11,
    //   page_name: "Courses",
    //   icon: "video",
    //   route: "/courses",
    // },
    // {
    //   page_id: 12,
    //   page_name: "Assignments",
    //   icon: "edit",
    //   route: "/assignments",
    // },
    // {
    //   page_id: 13,
    //   page_name: "Grades",
    //   icon: "award",
    //   route: "/grades",
    // },
    // {
    //   page_id: 14,
    //   page_name: "Notification",
    //   icon: "notification",
    //   route: "/notification",
    // },
    // {
    //   page_id: 15,
    //   page_name: "Invitation",
    //   icon: "invitation",
    //   route: "/invitation",
    // },
  ];

  const effectiveMenu =
    isAuthenticated && menuItems && menuItems.length > 0
      ? menuItems
      : staticMenuItems;
  // Fetch menu when user is authenticated and menu is not yet loaded
  useEffect(() => {
    if (isAuthenticated && !isMenuLoaded) {
      fetchMenu();
    }
  }, [isAuthenticated, isMenuLoaded]);

  // Helper to render icon
  const renderIcon = (iconName: string) => {
    const Icon = IconMap[iconName] || Home;
    return <Icon size={20} strokeWidth={1.5} />;
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
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

  return (
    <>
    {isAuthenticated && (
    <aside
      onMouseLeave={() => {
        if (isOpen) toggleSidebar();
      }}
      className={`
                fixed top-0 left-0 h-full z-[100]
                bg-white dark:bg-secondary-900
                shadow-xl transition-all duration-500 ease-in-out
                flex flex-col rounded-r-[30px]
                ${isOpen ? "w-[360px]" : "w-0 md:w-[88px]"}
            `}
      style={{
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Header Section */}
      <div
        className={`
                h-14 flex items-center transition-all duration-500
                ${isOpen ? "justify-start px-6 gap-4" : "justify-center"}
            `}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {isOpen ? (
          <>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-3">
              <img src="/Logo.svg" alt="App Logo" className="h-25 w-[80%]" />
            </div>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors ${!isOpen ? "fixed left-4 top-4 z-[60] md:static" : ""}`}
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 custom-scrollbar ${!isOpen ? "hidden md:block" : ""}`}
      >
        <ul className="space-y-1">
          {effectiveMenu.map((item) => (
            <li key={item.page_id}>
              <NavLink
                to={item.route}
                onClick={() => {
                  if (isOpen) toggleSidebar();
                }}
                className={({ isActive }) => `
                                    group flex items-center
                                    px-3 py-3 rounded-xl
                                    transition-all duration-300
                                    ${
                                      isActive
                                        ? "bg-orange-50 dark:bg-orange-900/10 text-orange-500"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }
                                    ${isOpen ? "justify-between" : "justify-center"}
                                `}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                title={!isOpen ? item.page_name : undefined}
              >
                <div className={`flex items-center ${isOpen ? "gap-3" : ""}`}>
                  <span>{renderIcon(item.icon)}</span>
                  {isOpen && (
                    <span
                      className="text-[15px] font-medium whitespace-nowrap transition-opacity duration-300"
                      style={{
                        transitionTimingFunction:
                          "cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {item.page_name}
                    </span>
                  )}
                </div>
                {isOpen && (
                  <ChevronRight
                    size={16}
                    className={`text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    style={{
                      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer / Logout */}
      {isAuthenticated && (
        <div
          className={`p-4 dark:border-gray-800 transition-all duration-500 ${!isOpen ? "hidden md:block" : ""}`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <button
            onClick={handleLogout}
            className={`
                        flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-300
                        ${isOpen ? "w-full px-4 py-3 gap-3" : "justify-center p-3"}
                    `}
            style={{
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            title={!isOpen ? "Sign Out" : undefined}
          >
            <LogOut size={20} strokeWidth={1.5} />
            {isOpen && (
              <div
                className="flex items-center gap-3 transition-opacity duration-300"
                style={{
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <span className="text-[15px] font-medium">Sign-out</span>
                <ChevronRight size={16} className="ml-auto text-gray-300" />
              </div>
            )}
          </button>
        </div>
      )}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </aside>
    )}
    </>
  );
};

export default Sidebar;