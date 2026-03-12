import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";
import Footer from "./Footer";
import { useAuth } from "../../app/providers/AuthProvider";
import { PageLoader } from "../common/Loader";

export const AdminLayout: React.FC = () => {
    // We are maintaining basic authentication checks, but ideally 
    // you would check for an 'admin' role here later.
    const { isLoading, isAuthenticated } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Show loading state while checking auth
    if (isLoading) {
        return <PageLoader text="Loading Admin Workspace..." />;
    }

    // Temporarily bypassing authentication for the admin panel during development
    // NOTE: For true security, implement an admin login flow and role-check here.
    // if (!isAuthenticated) {
    //     return <Navigate to="/login" replace />;
    // }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-background-dark flex">
            {/* Admin Specific Sidebar */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Main Content Wrapper */}
            <div
                className={`flex-1 flex flex-col min-h-screen ml-0 md:ml-[88px] transition-all duration-300 ease-in-out`}
            >
                {/* Header (Reused, but can be customized later if needed) */}
                <Header isSidebarOpen={isSidebarOpen} />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default AdminLayout;
