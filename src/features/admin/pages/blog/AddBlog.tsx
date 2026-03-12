import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import { NavLink, useSearchParams } from 'react-router-dom';
// Ensure this path is correct for your project
import { blogs } from '../../../blog/blog';
import TiptapEditor from '../blog/TitapEditor';

export const AddBlog: React.FC = () => {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');

    const availableCategories = [...new Set(blogs.map(b => b.category))];

    useEffect(() => {
        if (isEditMode && editId) {
            const blogToEdit = blogs.find(b => b.id.toString() === editId);
            if (blogToEdit) {
                setTitle(blogToEdit.title);
                setCategory(blogToEdit.category);
                setAuthor(blogToEdit.author || '');
                setContent(blogToEdit.content.join('\n\n'));
                setImageUrl(blogToEdit.image);
                setImageFile(null);
            }
        } else {
            setTitle('');
            setAuthor('');
            setCategory('');
            setContent('');
            setImageFile(null);
            setImageUrl('');
        }
    }, [editId, isEditMode]);

    const imagePreviewUrl = imageFile ? URL.createObjectURL(imageFile) : imageUrl;

    return (
        <div className="space-y-6 max-w-8xl mx-auto">

            {/* Header / Top Bar */}
            <div className="flex items-center gap-4">
                <NavLink to="/admin/blog/manage" className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors text-secondary-500">
                    <ArrowLeft size={20} />
                </NavLink>
                <div>
                    <h1 className="text-2xl font-bold text-primary dark:text-white">
                        {isEditMode ? 'Edit Blog Article' : 'Add New Blog Article'}
                    </h1>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <form className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Post Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Post Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter a captivating title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Author */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Author</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., Arpan Dutta"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Content (Rich Text Editor) */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Content</label>
                        <TiptapEditor
                            content={content}
                            onChange={(html) => setContent(html)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Category</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select a Category</option>
                                {availableCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Featured Image */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Featured Image</label>
                            <div className="flex items-center gap-4">
                                {imagePreviewUrl ? (
                                    <div className="relative">
                                        <img src={imagePreviewUrl} alt="Preview" className="w-28 h-28 object-cover rounded-lg border border-secondary-200 dark:border-secondary-700" />
                                        <button type="button" onClick={() => { setImageFile(null); setImageUrl(''); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-28 h-28 flex-shrink-0 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 flex flex-col items-center justify-center">
                                        <ImageIcon size={24} className="text-secondary-400 dark:text-secondary-500" />
                                        <p className="text-xs text-secondary-400 mt-1">No Image</p>
                                    </div>
                                )}
                                <div className="w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-secondary-700 file:text-primary-700 dark:file:text-secondary-200 hover:file:bg-primary-100 dark:hover:file:bg-secondary-600 cursor-pointer"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    />
                                    <p className="text-xs text-secondary-500 mt-2">
                                        Recommended: 1200x630px. Max 2MB.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-secondary-200 dark:border-secondary-700">
                        <button
                            type="button"
                            className="flex items-center gap-2 bg-[#b0cb1f] text-gray-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c5de3a] transition-colors"
                        >
                            <Save size={18} /> {isEditMode ? 'Update Blog' : 'Publish Blog'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddBlog;