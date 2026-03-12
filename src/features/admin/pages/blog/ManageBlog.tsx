import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FilePlus2, FileText, Search, Edit, Trash2 } from 'lucide-react';
import { blogs as allBlogs } from '../../../blog/blog';

export const ManageBlog: React.FC = () => {
    const [blogs] = useState(allBlogs);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 5;

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const filteredBlogs = blogs.filter(blog => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        return (
            blog.id.toString().includes(query) ||
            blog.title.toLowerCase().includes(query) ||
            blog.category.toLowerCase().includes(query) ||
            blog.publishDate.toLowerCase().includes(query)
        );
    });

    // Pagination Logic
    const totalPosts = filteredBlogs.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentBlogs = filteredBlogs.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
                        <FileText className="text-[#b0cb1f]" />
                        Manage Blogs
                    </h1>
                    <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                        View, edit, or delete existing blog posts.
                    </p>
                </div>
                <NavLink
                    to="/admin/blog/add"
                    className="flex items-center gap-2 bg-[#b0cb1f] hover:bg-[#c5de3a] text-gray-900 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-md"
                >
                    <FilePlus2 size={18} />
                    Create New Blog
                </NavLink>
            </div>

            {/* Table Card Container */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                
                {/* Search Bar Top Bar */}
                <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/50">
                    <div className="relative w-full max-w-md flex items-center">
                        <Search className="absolute left-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, Title, Category, or Date..."
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-secondary-600 rounded-md w-full bg-white dark:bg-secondary-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#b0cb1f]/50 transition-shadow"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Layout */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        {/* GREEN Table Header */}
                        <thead className="bg-[#b0cb1f] text-gray-900 font-semibold border-b border-gray-200 dark:border-secondary-700">
                            <tr className="divide-x divide-gray-900/20">
                                <th className="px-6 py-4 text-center">ID</th>
                                <th className="px-6 py-4 text-center">Title</th>
                                <th className="px-6 py-4 text-center">Content Preview</th>
                                <th className="px-6 py-4 text-center">Category</th>
                                <th className="px-6 py-4 text-center">Featured Image</th>
                                <th className="px-6 py-4 text-center">Created Date</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100 dark:divide-secondary-700">
                            {currentBlogs.length > 0 ? (
                                currentBlogs.map((blog) => (
                                    <tr key={blog.id} className="divide-x divide-gray-100 dark:divide-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-700/50 transition-colors">
                                        <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                                            {blog.id}
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-gray-700 dark:text-gray-200 max-w-xs truncate">
                                            {blog.title}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-500 text-xs max-w-xs truncate">
                                            {blog.excerpt}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                                            {blog.category}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                {blog.image ? (
                                                    <img 
                                                        src={blog.image} 
                                                        alt="feature" 
                                                        className="w-12 h-12 object-cover rounded shadow-sm border border-gray-200" 
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded flex flex-col items-center justify-center text-[10px] text-gray-400 leading-tight">
                                                        <span>No</span>
                                                        <span>Image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                                            {blog.publishDate}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-4">
                                                <NavLink to={`/admin/blog/add?edit=${blog.id}`} className="text-amber-500 hover:text-amber-600 transition-colors" title="Edit">
                                                    <Edit size={18} />
                                                </NavLink>
                                                <button className="text-red-500 hover:text-red-600 transition-colors" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                /* Empty State (Hidden if there is data) */
                                <tr>
                                    <td colSpan={7}>
                                        <div className="p-12 text-center text-secondary-500 dark:text-secondary-400 flex flex-col items-center justify-center min-h-[300px]">
                                            <FileText size={48} className="text-gray-300 dark:text-secondary-600 mb-4" />
                                            <p className="font-semibold text-lg text-gray-600 dark:text-secondary-300">
                                                No blogs found
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Get started by creating your first blog post.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {startIndex + 1} to {Math.min(startIndex + POSTS_PER_PAGE, totalPosts)} of {totalPosts} blogs
                        </span>
                        <div className="flex space-x-1">
                            <button 
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-1.5 text-sm border border-gray-200 dark:border-secondary-600 rounded bg-white dark:bg-secondary-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button 
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`px-4 py-1.5 text-sm rounded font-medium shadow-sm ${
                                        currentPage === page 
                                        ? 'bg-[#b0cb1f] text-gray-900' 
                                        : 'bg-white dark:bg-secondary-900 border border-gray-200 dark:border-secondary-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button 
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-1.5 text-sm border border-gray-200 dark:border-secondary-600 rounded bg-white dark:bg-secondary-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBlog;