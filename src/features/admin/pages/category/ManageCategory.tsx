import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderTree,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import AddCategory from "./AddCategory";
import ApiServices from "../../../../services/ApiServices";
import { useToast } from "../../../../app/providers/ToastProvider";

export const ManageCategories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await ApiServices.getBlogCategories();
      if (response.data.code === 200 || response.data.status === "success") {
        setAllCategories(response.data.data || []);
      } else {
        // showToast(response.data.message || 'Failed to fetch categories', 'error');
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Error fetching categories", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredCategories = allCategories.filter((cat) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const catName = cat.category_name || cat.name || "";
    return (
      cat.id?.toString().includes(query) ||
      catName.toLowerCase().includes(query)
    );
  });

  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCategories = filteredCategories.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await ApiServices.deleteBlogCategory({
        id: categoryToDelete,
      });
      if (response.data.code === 200 || response.data.status === "success") {
        showToast(
          response.data.message || "Category deleted successfully",
          "success",
        );
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        fetchCategories();
      } else {
        showToast(
          response.data.message || "Failed to delete category",
          "error",
        );
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      showToast(
        error.response?.data?.message || "Error deleting category",
        "error",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-white flex items-center gap-3">
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
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800/50 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md flex items-center">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search category..."
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-secondary-600 rounded-md w-full bg-white dark:bg-secondary-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#b0cb1f]/50 transition-shadow text-primary dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-500 dark:text-secondary-400 transition-colors disabled:opacity-50 disabled:cursor-wait"
            title="Refresh"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Table Layout */}
        <div className="overflow-x-auto min-h-[300px] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-secondary-800/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-[#b0cb1f]" size={40} />
                <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  Loading categories...
                </span>
              </div>
            </div>
          )}

          <table className="w-full text-sm text-left">
            {/* GREEN Table Header */}
            <thead className="bg-[#b0cb1f] text-gray-900 font-semibold border-b border-gray-200 dark:border-secondary-700">
              <tr className="divide-x divide-gray-900/20">
                <th className="px-6 py-4 text-center w-24">Sl. No.</th>
                <th className="px-6 py-4 text-center">Category Name</th>
                <th className="px-6 py-4 text-center w-32">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 dark:divide-secondary-700">
              {currentCategories.length > 0
                ? currentCategories.map((cat, index) => (
                    <tr
                      key={cat.id}
                      className="divide-x divide-gray-100 dark:divide-secondary-700 hover:bg-gray-50 dark:hover:bg-secondary-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-center text-primary dark:text-gray-300 align-middle">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-primary dark:text-gray-200 align-middle">
                        {cat.category_name || cat.name}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {/* Horizontal Action Buttons */}
                        <div className="flex items-center justify-center space-x-4">
                          <button
                            onClick={() => handleOpenEditModal(cat.id)}
                            className="text-amber-500 hover:text-amber-600 transition-colors p-1"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(cat.id)}
                            className="text-red-500 hover:text-red-600 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : !isLoading && (
                    /* Empty State */
                    <tr>
                      <td colSpan={3}>
                        <div className="p-12 text-center text-secondary-500 dark:text-secondary-400 flex flex-col items-center justify-center min-h-[200px]">
                          <FolderTree
                            size={48}
                            className="text-gray-300 dark:text-secondary-600 mb-4"
                          />
                          <p className="font-semibold text-lg text-gray-600 dark:text-secondary-300 mb-1">
                            {searchQuery
                              ? "No categories found"
                              : "No categories created yet"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {searchQuery
                              ? `Your search for "${searchQuery}" did not return any results.`
                              : 'Click "Add New Category" to get started.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of{" "}
              {totalItems} categories
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-1.5 text-sm border border-gray-200 dark:border-secondary-600 rounded bg-white dark:bg-secondary-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-1.5 text-sm rounded font-medium shadow-sm ${
                      currentPage === page
                        ? "bg-[#b0cb1f] text-gray-900"
                        : "bg-white dark:bg-secondary-900 border border-gray-200 dark:border-secondary-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
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
        allCategories={allCategories}
        onSuccess={fetchCategories}
      />

      {/* Modern Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop with Glassmorphism */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white dark:bg-secondary-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-secondary-100 dark:border-secondary-800">
            <div className="p-8 text-center">
              {/* Warning Icon */}
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-red-500" />
              </div>

              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-3">
                Delete Category?
              </h3>
              <p className="text-secondary-500 dark:text-secondary-400 mb-8 leading-relaxed">
                Are you sure you want to remove this category? All articles
                linked to this category might be affected.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-6 py-3.5 rounded-2xl font-bold text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-6 py-3.5 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {isDeleting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={18} className="group-hover:shake" />
                      Delete Now
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-red-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
