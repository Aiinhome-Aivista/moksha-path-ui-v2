import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ListPlus, Search, Edit, Trash2 } from 'lucide-react';

export const ManageSEO: React.FC = () => {
    // Mock data based on your screenshot
    const [allSeoData] = useState([
        {
            id: 1,
            title: "Recruitment and Jobs Online in India, UAE and entire world - Remote, IT, Fresher & Internship Jobs | SahajJobs",
            description: "Find jobs in India and internati...",
            keywords: "jobs, recruitment, job search, post jobs, employment, career opportunities, hiring, CV evaluation, job description, SahajJobs, India jobs, international jobs, job openings, fresher, career portal, hiring, recruitment platform, remote work, job listings, jobs in India, entry level jobs, finance jobs, healthcare jobs, IT jobs, urgent hiring, walk-in jobs, Sahaj Job, Sahaj Jobs",
            created: "Jan 21, 2026"
        },
        {
            id: 2,
            title: "Homepage - MokshaPath - Guided Path to True Learning",
            description: "MokshaPath offers AI-based learning plans, courses, and more.",
            keywords: "learning, education, ai tutor, online courses, student success",
            created: "Jan 20, 2026"
        },
        {
            id: 3,
            title: "About Us - Our Mission at MokshaPath",
            description: "Learn about the team and vision behind MokshaPath.",
            keywords: "about us, mission, vision, edtech, education team",
            created: "Jan 19, 2026"
        },
        {
            id: 4,
            title: "Contact MokshaPath for Support and Inquiries",
            description: "Get in touch with our support team for any questions.",
            keywords: "contact, support, help, inquiry, customer service",
            created: "Jan 18, 2026"
        },
        {
            id: 5,
            title: "Blog - Latest Articles on Education and Career",
            description: "Read our blog for tips on study skills, career development, and more.",
            keywords: "blog, articles, study tips, career advice, student help",
            created: "Jan 17, 2026"
        },
        {
            id: 6,
            title: "Pricing and Plans for MokshaPath Subscriptions",
            description: "Explore our affordable subscription plans for students and institutions.",
            keywords: "pricing, plans, subscription, cost, student plan",
            created: "Jan 16, 2026"
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const filteredData = allSeoData.filter(seo => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        return (
            seo.id.toString().includes(query) ||
            seo.title.toLowerCase().includes(query) ||
            seo.description.toLowerCase().includes(query) ||
            seo.keywords.toLowerCase().includes(query) ||
            seo.created.toLowerCase().includes(query)
        );
    });

    // Pagination Logic
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white flex items-center gap-3">
                        <Search className="text-[#b0cb1f]" />
                        Manage SEO
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
                    Add New SEO
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
                            placeholder="Search by ID, Title, Description, Keywords..."
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-secondary-600 rounded-md w-full bg-white dark:bg-secondary-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#b0cb1f]/50 transition-shadow"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Layout */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        {/* GREEN Table Header */}
                        <thead className="bg-[#b0cb1f] text-gray-900 font-semibold border-b border-gray-200 dark:border-secondary-700">
                            <tr className="divide-x divide-gray-900/20">
                                <th className="px-6 py-4 text-center whitespace-nowrap">ID</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Title</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Description</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Keywords</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Created Date</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100 dark:divide-secondary-700">
                            {currentItems.length > 0 ? (
                                currentItems.map((seo) => (
                                    <tr key={seo.id} className="divide-x divide-gray-100 dark:divide-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-700/50 transition-colors">
                                        <td className="px-6 py-4 text-center text-primary dark:text-gray-300 align-middle">
                                            {seo.id}
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-primary dark:text-gray-200 min-w-[200px] align-middle">
                                            {seo.title}
                                        </td>
                                        <td className="px-6 py-4 text-center text-primary dark:text-gray-400 min-w-[200px] align-middle">
                                            {seo.description}
                                        </td>
                                        <td className="px-6 py-4 text-center text-primary dark:text-gray-300 min-w-[300px] leading-relaxed align-middle">
                                            {seo.keywords}
                                        </td>
                                        <td className="px-6 py-4 text-center text-primary dark:text-gray-300 whitespace-nowrap align-middle">
                                            {seo.created}
                                        </td>
                                        <td className="px-6 py-4 text-center align-middle">
                                            {/* Horizontal Action Buttons */}
                                            <div className="flex items-center justify-center space-x-4">
                                                <NavLink to={`/admin/seo/add?edit=${seo.id}`} className="text-amber-500 hover:text-amber-600 transition-colors" title="Edit">
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
                                    <td colSpan={6}>
                                        <div className="p-12 text-center text-secondary-500 dark:text-secondary-400 flex flex-col items-center justify-center min-h-[300px]">
                                            <Search size={48} className="text-gray-300 dark:text-secondary-600 mb-4" />
                                            <p className="font-semibold text-lg text-gray-600 dark:text-secondary-300">
                                                No SEO data configured yet
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Start by adding metadata for your core pages.
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
                            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems} entries
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

export default ManageSEO;