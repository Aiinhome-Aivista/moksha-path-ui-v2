import React from 'react';
import { LayoutDashboard, Users, FileText, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                        Welcome to the administrative control panel.
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: '1,245', icon: <Users size={24} />, color: 'bg-primary-500' },
                    { label: 'Published Blogs', value: '48', icon: <FileText size={24} />, color: 'bg-[#b0cb1f]' },
                    { label: 'Active Sessions', value: '12', icon: <Activity size={24} />, color: 'bg-orange-500' },
                    { label: 'Platform Status', value: '100%', icon: <LayoutDashboard size={24} />, color: 'bg-green-500' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shrink-0 shadow-md`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-1">
                                {stat.label}
                            </p>
                            <h3 className="text-2xl font-black text-secondary-900 dark:text-white leading-none">
                                {stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-sm border border-secondary-200 dark:border-secondary-700 min-h-[400px] flex items-center justify-center text-secondary-500">
                <p>Dashboard analytics and recent activity feed will go here.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
