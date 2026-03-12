import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { NavLink, useSearchParams } from 'react-router-dom';

// In a real app, this would be a shared data source or fetched from an API
const allSeoData = [
    {
        id: 1,
        route: '/home', // Added for completeness
        title: "Recruitment and Jobs Online in India, UAE and entire world - Remote, IT, Fresher & Internship Jobs | SahajJobs",
        description: "Find jobs in India and internati...",
        keywords: "jobs, recruitment, job search, post jobs, employment, career opportunities, hiring, CV evaluation, job description, SahajJobs, India jobs, international jobs, job openings, fresher, career portal, hiring, recruitment platform, remote work, job listings, jobs in India, entry level jobs, finance jobs, healthcare jobs, IT jobs, urgent hiring, walk-in jobs, Sahaj Job, Sahaj Jobs",
        created: "Jan 21, 2026"
    }
];

export const AddSEO: React.FC = () => {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    // const [routePath, setRoutePath] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('');

    useEffect(() => {
        if (isEditMode && editId) {
            const seoToEdit = allSeoData.find(s => s.id.toString() === editId);
            if (seoToEdit) {
                // setRoutePath(seoToEdit.route);
                setMetaTitle(seoToEdit.title);
                setMetaDescription(seoToEdit.description);
                setKeywords(seoToEdit.keywords);
            }
        } else {
            // Clear form for "Add New" mode
            // setRoutePath('');
            setMetaTitle('');
            setMetaDescription('');
            setKeywords('');
        }
    }, [editId, isEditMode]);

    return (
        <div className="space-y-6 max-w-8xl mx-auto">
            <div className="flex items-center gap-4">
                <NavLink to="/admin/seo/manage" className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors text-secondary-500">
                    <ArrowLeft size={20} />
                </NavLink>
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        {isEditMode ? 'Edit SEO Config' : 'Add New SEO Config'}
                    </h1>
                </div>
            </div>

            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
                <form className="space-y-6">
                    {/* <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Page Route / Path</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g., /home or /courses"
                            value={routePath}
                            onChange={(e) => setRoutePath(e.target.value)}
                        />
                        <p className="text-xs text-secondary-500">The exact URL path where this SEO metadata should apply.</p>
                    </div> */}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">SOE Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter the page title (optimized for search engines)"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">SOE Description</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Write a concise max 160-character description..."
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">Keywords</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="education, platform, learning, courses (comma separated)"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-secondary-200 dark:border-secondary-700">
                        <button type="button" className="flex items-center gap-2 bg-[#b0cb1f] text-gray-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c5de3a] transition-colors">
                            <Save size={18} /> {isEditMode ? 'Update SEO Info' : 'Save SEO Info'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSEO;
