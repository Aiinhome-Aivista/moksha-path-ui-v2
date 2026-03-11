import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const AddSEO: React.FC = () => {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <NavLink to="/admin/seo/manage" className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors text-secondary-500">
                    <ArrowLeft size={20} />
                </NavLink>
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        Add New SEO Config
                    </h1>
                </div>
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Page Route / Path</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g., /home or /courses"
                        />
                        <p className="text-xs text-secondary-500">The exact URL path where this SEO metadata should apply.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Meta Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter the page title (optimized for search engines)"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Meta Description</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Write a concise max 160-character description..."
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Keywords</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="education, platform, learning, courses (comma separated)"
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-secondary-200 dark:border-secondary-700">
                        <button type="button" className="flex items-center gap-2 bg-[#b0cb1f] text-gray-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c5de3a] transition-colors">
                            <Save size={18} /> Save SEO Info
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSEO;
