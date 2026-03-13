import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { NavLink, useSearchParams, useNavigate } from 'react-router-dom';
import ApiServices from '../../../../services/ApiServices';
import { useToast } from '../../../../app/providers/ToastProvider';



export const AddSEO: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [routePath, setRoutePath] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [canonicalUrl, setCanonicalUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchExistingData = async () => {
            if (isEditMode && editId) {
                try {
                    const response = await ApiServices.getBlogSeoSettings();
                    if (response.data.code === 200 || response.data.status === 'success') {
                        const seoToEdit = response.data.data.find((s: any) => s.id.toString() === editId);
                        if (seoToEdit) {
                            setRoutePath(seoToEdit.page_route || '');
                            setMetaTitle(seoToEdit.seo_title || '');
                            setMetaDescription(seoToEdit.seo_description || '');
                            setKeywords(seoToEdit.seo_keywords || '');
                            setCanonicalUrl(seoToEdit.canonical_url || '');
                        }
                    }
                } catch (error) {
                    console.error("Error fetching SEO data for edit:", error);
                }
            }
        };
        fetchExistingData();
    }, [editId, isEditMode]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!routePath.trim() || !metaTitle.trim()) {
            showToast("Page Route and SEO Title are required", "warning");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                id: editId ? parseInt(editId) : null,
                page_route: routePath.trim(),
                seo_title: metaTitle,
                seo_description: metaDescription,
                seo_keywords: keywords,
                canonical_url: canonicalUrl
            };

            const response = await ApiServices.insertUpdateBlogSeo(payload);
            
            if (response.data.code === 200 || response.data.status === 'success') {
                showToast(response.data.message || `SEO ${isEditMode ? 'updated' : 'added'} successfully`, 'success');
                navigate('/admin/manage-seo');
            } else {
                showToast(response.data.message || 'Failed to save SEO config', 'error');
            }
        } catch (error) {
            console.error('Error saving SEO:', error);
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-8xl mx-auto">
            <div className="flex items-center gap-4">
                <NavLink to="/admin/manage-seo" className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors text-secondary-500">
                    <ArrowLeft size={20} />
                </NavLink>
                <div>
                    <h1 className="text-2xl font-bold text-primary dark:text-white">
                        {isEditMode ? 'Edit SEO Config' : 'Add New SEO Config'}
                    </h1>
                </div>
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <form className="space-y-6" onSubmit={handleSave}>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Page Route / Path</label>
                        <input
                            type="text"
                            style={{ color: 'black' }}
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-black dark:text-white"
                            placeholder="e.g., /home or /courses"
                            value={routePath}
                            onChange={(e) => setRoutePath(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-secondary-500">The exact URL path where this SEO metadata should apply.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">SEO Title</label>
                        <input
                            type="text"
                            style={{ color: 'black' }}
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-black dark:text-white"
                            placeholder="Enter the page title (optimized for search engines)"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">SEO Description</label>
                        <textarea
                            rows={4}
                            style={{ color: 'black' }}
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-black dark:text-white"
                            placeholder="Write a concise max 160-character description..."
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            disabled={isSubmitting}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Keywords</label>
                            <input
                                type="text"
                                style={{ color: 'black' }}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-black dark:text-white"
                                placeholder="education, platform, learning, courses"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Canonical URL</label>
                            <input
                                type="text"
                                style={{ color: 'black' }}
                                className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-black dark:text-white"
                                placeholder="https://example.com/page"
                                value={canonicalUrl}
                                onChange={(e) => setCanonicalUrl(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-secondary-200 dark:border-secondary-700">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-[#b0cb1f] text-gray-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c5de3a] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {isEditMode ? 'Update SEO Info' : 'Save SEO Info'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSEO;
