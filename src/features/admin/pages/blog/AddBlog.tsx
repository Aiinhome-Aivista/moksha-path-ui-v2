import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const AddBlog: React.FC = () => {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <NavLink to="/admin/blog/manage" className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors text-secondary-500">
                    <ArrowLeft size={20} />
                </NavLink>
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        Add New Blog Article
                    </h1>
                </div>
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Blog Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter a captivating title..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Category</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option>Select a category...</option>
                                <option>Education</option>
                                <option>Platform Updates</option>
                                <option>Tips & Tricks</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Cover Image URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="https://"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Blog Content</label>
                        <textarea
                            rows={10}
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Write your article content here... (Rich Text Editor will be implemented here)"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-secondary-200 dark:border-secondary-700">
                        <button type="button" className="flex items-center gap-2 bg-[#b0cb1f] text-gray-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c5de3a] transition-colors">
                            <Save size={18} /> Publish Blog
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBlog;
