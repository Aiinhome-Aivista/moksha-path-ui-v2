import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, FolderTree } from 'lucide-react';
import AddCategory from './AddCategory';

export const ManageCategories: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    // Mock data based on your screenshot
    const [allCategories] = useState([
        { id: 1, name: "Career Development" },
        { id: 2, name: "Interview Preparation" },
        { id: 3, name: "Employment Law & Rights" },
        { id: 4, name: "Study Tips" },
        { id: 5, name: "EdTech" },
        { id: 6, name: "Education Insights" },
        { id: 7, name: "Parent Guide" },
        { id: 8, name: "Teaching Strategies" },
        { id: 9, name: "Study Skills" },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const filteredCategories = allCategories.filter(cat => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            cat.id.toString().includes(query) ||
            cat.name.toLowerCase().includes(query)
        );
    });

    const totalItems = filteredCategories.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleOpenAddModal = () => {
        setEditingCategoryId(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (id: number) => {
        setEditingCategoryId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold Manage Post Categories dark:text-white flex items-center gap-3">
                        <FolderTree className="text-[#b0cb1f]" />
                        Manage Post Categories
                    </h1>
                    <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                        Create and organize categories for your blog posts.
                    </p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-[#b0cb1f] hover:bg-[#c5de3a] text-gray-900 px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-md"
                >
                    <Plus size={18} />
                    Add New Category
                </button>
            </div>

            {/* Table Card Container */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                
                {/* Search Bar Top Bar */}
                <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/50">
                    <div className="relative w-full max-w-md flex items-center">
                        <Search className="absolute left-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or Category Name..."
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
                                <th className="px-6 py-4 text-center w-24">ID</th>
                                <th className="px-6 py-4 text-center">Category Name</th>
                                <th className="px-6 py-4 text-center w-32">Action</th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100 dark:divide-secondary-700">
                            {currentCategories.length > 0 ? (
                                currentCategories.map((cat) => (
                                    <tr key={cat.id} className="divide-x divide-gray-100 dark:divide-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-700/50 transition-colors">
                                        <td className="px-6 py-4 text-center text-primary dark:text-gray-300 align-middle">
                                            {cat.id}
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-primary dark:text-gray-200 align-middle">
                                            {cat.name}
                                        </td>
                                        <td className="px-6 py-4 text-center align-middle">
                                            {/* Horizontal Action Buttons */}
                                            <div className="flex items-center justify-center space-x-4">
                                                <button onClick={() => handleOpenEditModal(cat.id)} className="text-amber-500 hover:text-amber-600 transition-colors" title="Edit">
                                                    <Edit size={18} />
                                                </button>
                                                <button className="text-red-500 hover:text-red-600 transition-colors" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                /* Empty State */
                                <tr>
                                    <td colSpan={3}>
                                        <div className="p-12 text-center text-secondary-500 dark:text-secondary-400 flex flex-col items-center justify-center min-h-[200px]">
                                            <FolderTree size={48} className="text-gray-300 dark:text-secondary-600 mb-4" />
                                            <p className="font-semibold text-lg text-gray-600 dark:text-secondary-300 mb-1">
                                                {searchQuery ? 'No categories found' : 'No categories created yet'}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {searchQuery ? `Your search for "${searchQuery}" did not return any results.` : 'Click "Add New Category" to get started.'}
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
                            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems} categories
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
            <AddCategory
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editId={editingCategoryId}
            />
        </div>
    );
};

export default ManageCategories;