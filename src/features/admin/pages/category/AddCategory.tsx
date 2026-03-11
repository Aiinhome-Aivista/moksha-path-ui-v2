import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

// Mock data - in a real app, this would come from a shared source or API.
const allCategories = [
    { id: 1, name: "Career Development" },
    { id: 2, name: "Interview Preparation" },
    { id: 3, name: "Employment Law & Rights" },
    { id: 4, name: "Study Tips" },
    { id: 5, name: "EdTech" },
    { id: 6, name: "Education Insights" },
    { id: 7, name: "Parent Guide" },
    { id: 8, name: "Teaching Strategies" },
    { id: 9, name: "Study Skills" },
];

interface AddCategoryProps {
    isOpen: boolean;
    onClose: () => void;
    editId: number | null;
}

export const AddCategory: React.FC<AddCategoryProps> = ({ isOpen, onClose, editId }) => {
    const isEditMode = !!editId;
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && editId) {
                const categoryToEdit = allCategories.find(c => c.id === editId);
                if (categoryToEdit) {
                    setCategoryName(categoryToEdit.name);
                }
            } else {
                setCategoryName('');
            }
        }
    }, [isOpen, editId, isEditMode]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-secondary-900 rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                    <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
                        {isEditMode ? 'Edit Category' : 'Add New Category'}
                    </h1>
                    <button onClick={onClose} className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors text-secondary-500">
                        <X size={20} />
                    </button>
                </div>

                <form className="p-6">
                    <label htmlFor="categoryName" className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Category Name</label>
                    <input
                        id="categoryName"
                        type="text"
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Career Development"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />

                    <div className="flex justify-end pt-6 mt-6 border-t border-secondary-200 dark:border-secondary-700">
                        <button type="button" className="flex items-center gap-2 bg-[#b0cb1f] text-gray-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c5de3a] transition-colors">
                            <Save size={18} /> {isEditMode ? 'Update Category' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;