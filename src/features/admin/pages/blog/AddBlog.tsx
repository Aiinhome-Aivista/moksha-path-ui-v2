import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { NavLink, useSearchParams, useNavigate } from 'react-router-dom';
import ApiServices from '../../../../services/ApiServices';
import { useToast } from '../../../../app/providers/ToastProvider';
import TiptapEditor from './TitapEditor';

export const AddBlog: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Arpan Dutta');
    const [categoryId, setCategoryId] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<any[]>([]);

    useEffect(() => {
        // Fetch Categories
        const fetchCategories = async () => {
            try {
                const response = await ApiServices.getBlogCategories();
                if (response.data.code === 200 || response.data.status === 'success') {
                    setAvailableCategories(response.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        // Fetch Blog Data if Editing
        const fetchBlogData = async () => {
            if (isEditMode && editId) {
                try {
                    const response = await ApiServices.getBlogsList();
                    if (response.data.code === 200 || response.data.status === 'success') {
                        const blogToEdit = response.data.data.find((b: any) => b.id.toString() === editId);
                        if (blogToEdit) {
                            setTitle(blogToEdit.blog_title || '');
                            setAuthor(blogToEdit.blog_author || '');
                            setCategoryId(blogToEdit.category_id?.toString() || '');
                            setContent(blogToEdit.blog_content || '');
                            setImageUrl(blogToEdit.image || '');
                            setImageFile(null);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching blog data:", error);
                    showToast("Failed to load blog data", "error");
                }
            }
        };

        fetchCategories();
        fetchBlogData();
    }, [editId, isEditMode]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim() || !categoryId || (!imageUrl && !imageFile)) {
            showToast("Please fill in all required fields, including a featured image", "warning");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            if (editId) formData.append('id', editId);
            formData.append('blog_title', title);
            formData.append('blog_author', author);
            formData.append('blog_content', content);
            formData.append('category_id', categoryId);
            
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await ApiServices.insertUpdateBlog(formData);
            
            if (response.data.code === 200 || response.data.status === 'success') {
                showToast(response.data.message || `Blog ${isEditMode ? 'updated' : 'published'} successfully`, 'success');
                navigate('/admin/manage-blog');
            } else {
                showToast(response.data.message || 'Failed to save blog', 'error');
            }
        } catch (error: any) {
            console.error('Error saving blog:', error);
            showToast('Something went wrong while saving', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const imagePreviewUrl = imageFile ? URL.createObjectURL(imageFile) : imageUrl;

    return (
        <div className="space-y-6 max-w-8xl mx-auto">

            {/* Header / Top Bar */}
            <div className="flex items-center gap-4">
                <NavLink to="/admin/manage-blog" className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors text-secondary-500">
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
                <form className="space-y-6" onSubmit={handleSave}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Post Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Post Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-black dark:text-white"
                                placeholder="Enter a captivating title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Author */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Author</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-black dark:text-white"
                                placeholder="e.g., Arpan Dutta"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                disabled
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
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-black dark:text-white"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="">Select a Category</option>
                                {availableCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
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
                                        disabled={isSubmitting}
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
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-[#b0cb1f] text-gray-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c5de3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> 
                                    {isEditMode ? 'Updating...' : 'Publishing...'}
                                </>
                            ) : (
                                <>
                                    <Save size={18} /> {isEditMode ? 'Update Blog' : 'Publish Blog'}
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddBlog;