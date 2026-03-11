import React from "react";
import { NavLink } from "react-router-dom";
import {
    X,
    LogOut,
    Menu,
    LayoutDashboard,
    FileText,
    Search,
    ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const adminMenuItems = [
    {
        page_id: "admin-dashboard",
        page_name: "Dashboard",
        icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
        route: "/admin/dashboard",
    },
    {
        page_id: "admin-manage-blog",
        page_name: "Blog",
        icon: <FileText size={20} strokeWidth={1.5} />,
        route: "/admin/blog/manage",
    },
    {
        page_id: "admin-manage-seo",
        page_name: "SEO",
        icon: <Search size={20} strokeWidth={1.5} />,
        route: "/admin/seo/manage",
    },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => {

    const handleLogout = () => {
        // Here you would typically clear the auth token and navigate to login
        // Reusing standard sign out for now
        localStorage.removeItem("auth_token");
        window.location.href = "/";
    };

    return (
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
                        <div className="flex flex-col items-start justify-center">
                            <span className="text-secondary-900 dark:text-white font-bold text-lg tracking-wide leading-tight">Admin CP</span>
                            <span className="text-primary-500 text-[10px] font-bold uppercase tracking-widest text-[#b0cb1f]">Workspace</span>
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
                <div className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3 ${!isOpen && "text-center opacity-0 hidden"}`}>
                    Core Modules
                </div>
                <ul className="space-y-1">
                    {adminMenuItems.map((item) => (
                        <li key={item.page_id}>
                            <NavLink
                                to={item.route}
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                                onClick={() => {
                                    if (isOpen) toggleSidebar();
                                }}
                                className={({ isActive }) => `
                                    group flex items-center
                                    px-3 py-3 rounded-xl
                                    transition-all duration-300
                                    ${isActive
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
                                    <span>{item.icon}</span>
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
                            <span className="text-[15px] font-medium">Safe Logout</span>
                            <ChevronRight size={16} className="ml-auto text-gray-300" />
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
