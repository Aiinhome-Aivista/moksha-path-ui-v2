import React from 'react';
import { NavLink } from 'react-router-dom';
import { ListPlus, Search } from 'lucide-react';

export const ManageSEO: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white flex items-center gap-3">
                        <Search className="text-[#b0cb1f]" />
                        Manage SEO Metadata
                    </h1>
                    <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                        View, edit, or delete existing SEO configurations for pages.
                    </p>
                </div>
                <NavLink
                    to="/admin/seo/add"
                    className="flex items-center gap-2 bg-[#b0cb1f] hover:bg-[#c5de3a] text-gray-900 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-md"
                >
                    <ListPlus size={18} />
                    Add New SEO Entry
                </NavLink>
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                <div className="p-6 border-b border-secondary-200 dark:border-secondary-700 flex justify-between items-center bg-secondary-50/50 dark:bg-secondary-800/50">
                    <input
                        type="text"
                        placeholder="Search SEO entries by path..."
                        className="px-4 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg w-full max-w-sm bg-white dark:bg-secondary-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                </div>
                <div className="p-8 text-center text-secondary-500 dark:text-secondary-400 min-h-[300px] flex flex-col items-center justify-center">
                    <Search size={48} className="text-secondary-200 dark:text-secondary-700 mb-4" />
                    <p className="font-medium text-lg text-secondary-700 dark:text-secondary-300">No SEO data configured yet</p>
                    <p className="text-sm mt-1">Start by adding metadata for your core pages.</p>
                </div>
            </div>
        </div>
    );
};

export default ManageSEO;
