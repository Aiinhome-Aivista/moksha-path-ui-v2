import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useAuth } from '../../../app/providers/AuthProvider';
// import { useModal } from '../../../features/auth/context/AuthContext';
import ApiServices from '../../../services/ApiServices';
import {
    Mail, BookOpen, Phone,
    TrendingUp,  Edit3, CheckCircle2,
    GraduationCap, Users, Lock, MapPin,
    PlusCircle, X
} from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────


interface Course {
    name: string;
    grade: string;
    progress: number;
}

interface ProfileFormValues {
    // Contact (email & phone always read-only)
    address: string;
    // Academic
    academic: string;
    board: string;
    dateOfBirth: string;
    grade: string;
    section: string;
    enrollmentDate: string;
    // Guardian
    guardianName: string;
    guardianRelation: string;
    guardianEmail: string;
    guardianPhone: string;
    // Lists
    courses: Course[];
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const StudentProfile: React.FC = () => {
    const { user, roleConfig } = useAuth();
    // const { openProfileSelection, setProfilesList } = useModal();
    const [isEditing, setIsEditing] = useState(false);
    // const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Profile image ──────────────────────────
    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await ApiServices.getUserProfileImage();
                if (response.data?.status === 'success' && response.data?.data?.image) {
                    setProfileImage(response.data.data.image);
                }
            } catch {
                // silently fail
            }
        };
        fetchProfileImage();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfileImage(URL.createObjectURL(file));
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            await ApiServices.uploadProfilePicture(formData);
        } catch {
            // silently fail
        } finally {
            setUploading(false);
        }
    };

    // ── View Profiles ──────────────────────────
    // const handleViewProfiles = async () => {
    //     try {
    //         setIsLoadingProfiles(true);
    //         const response = await ApiServices.getUsersByTokenContact();
    //         if (response.data?.status === 'success') {
    //             setProfilesList(response.data.data);
    //             openProfileSelection();
    //         }
    //     } catch {
    //         // silently fail
    //     } finally {
    //         setIsLoadingProfiles(false);
    //     }
    // };

    // ── Role-based Action Button ────────────────
    const getProfileBtnProps = () => {
        const role = user?.role;
        if (role === 'student') return { label: 'Add Parent', show: true, targetRole: 'parent' as const };
        if (role === 'parent') return { label: 'Add Child', show: true, targetRole: 'student' as const };
        return { label: '', show: false, targetRole: null };
    };

    const profileBtn = getProfileBtnProps();

    // ── Formik ─────────────────────────────────
    const initialValues: ProfileFormValues = {
        address: '123 Learning Street, Education City, EC 12345',
        academic: '2026-2027',
        board: 'CBSE',
        dateOfBirth: 'January 15, 2005',
        grade: '11th',
        section: 'A',
        enrollmentDate: 'March 1, 2026',
        guardianName: 'Robert Doe',
        guardianRelation: 'Father',
        guardianEmail: 'robert.doe@example.com',
        guardianPhone: '+91 98765 99999',
        courses: [
            { name: 'Advanced Mathematics', grade: 'A', progress: 85 },
            { name: 'Physics', grade: 'A-', progress: 78 },
            { name: 'English Literature', grade: 'B+', progress: 92 },
            { name: 'Computer Science', grade: 'A', progress: 95 },
            { name: 'Chemistry', grade: 'B+', progress: 72 },
        ],
    };

    const formik = useFormik<ProfileFormValues>({
        initialValues,
        onSubmit: async () => {
            // values
            try {
                setIsSaving(true);
                // API payload — ready to send
                // const payload = {
                //     address: values.address,
                //     academic: values.academic,
                //     board: values.board,
                //     dateOfBirth: values.dateOfBirth,
                //     grade: values.grade,
                //     section: values.section,
                //     enrollmentDate: values.enrollmentDate,
                //     guardianName: values.guardianName,
                //     guardianRelation: values.guardianRelation,
                //     guardianEmail: values.guardianEmail,
                //     guardianPhone: values.guardianPhone,
                //     courses: values.courses,
                // };
                // TODO: await ApiServices.updateStudentProfile(payload);
                // console.log('[Profile] API Payload ready:', payload);
                setIsEditing(false);
            } catch {
                // silently fail
            } finally {
                setIsSaving(false);
            }
        },
    });

    // ── Helpers ────────────────────────────────
    const handleSave = () => formik.submitForm();

    const handleCancel = () => {
        formik.resetForm();
        setIsEditing(false);
    };



    // ── Style helpers ──────────────────────────
    const avgProgress = formik.values.courses.length
        ? Math.round(
            formik.values.courses.reduce((p, c) => p + Number(c.progress), 0) /
            formik.values.courses.length
        )
        : 0;

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'bg-[#b0cb1f]/10 text-primary';
        if (grade.startsWith('B')) return 'bg-blue-50 text-primary';
        return 'bg-gray-100 text-primary';
    };

    const getProgressColor = (value: number) => {
        if (value >= 85) return '#b0cb1f';
        if (value >= 70) return '#f97316';
        return '#ef4444';
    };
    return (
        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-5">

            {/* ── Profile Hero Card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">

                {/* Banner */}
                <div className="h-20 bg-gradient-to-r from-[#b0cb1f] to-lime-400 relative flex items-center px-5 gap-4">
                    {/* Decorative circles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full bg-white/10" />
                        <div className="absolute -bottom-6 right-16 w-20 h-20 rounded-full bg-white/10" />
                    </div>

                    {/* Avatar */}
                    <div className="relative group shrink-0 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/50 shadow-md select-none">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" onError={() => setProfileImage('')} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl font-black text-white" style={{ background: 'rgba(255,255,255,0.25)' }}>
                                    {user?.name?.charAt(0).toUpperCase() || 'S'}
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            disabled={uploading}
                            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow border border-gray-200 group-hover:scale-110 transition-transform"
                            title="Change profile picture"
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        >
                            {uploading
                                ? <div className="w-3 h-3 border-2 border-gray-300 border-t-[#b0cb1f] rounded-full animate-spin" />
                                : <span style={{ fontVariationSettings: "'wght' 600, 'opsz' 20" }} className="material-symbols-outlined text-gray-600 text-[11px]">photo_camera</span>
                            }
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" aria-label="Upload profile picture" disabled={uploading} />
                    </div>
                    <div className="relative flex-1 min-w-0">
                        <h1 className="text-lg font-bold text-primary leading-none">My Profile</h1>
                        <p className="text-xs text-primary mt-0.5">View and manage your personal information</p>
                    </div>
                    {/* Action buttons */}
                    <div className="relative flex gap-1.5 shrink-0">
                        {profileBtn.show && (
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/25 hover:bg-white/35 text-primary text-xs font-semibold transition-all"
                            >
                                <PlusCircle size={11} />
                                {profileBtn.label}
                            </button>
                        )}

                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/25 hover:bg-white/35 text-primary text-xs font-semibold transition-all"
                                >
                                    <X size={11} />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all bg-white text-[#6b7a0e] hover:bg-gray-50 disabled:opacity-60"
                                    onClick={handleSave}
                                >
                                    {isSaving
                                        ? <div className="w-3 h-3 border-2 border-gray-300 border-t-[#b0cb1f] rounded-full animate-spin" />
                                        : <CheckCircle2 size={11} />
                                    }
                                    Save
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all bg-white text-[#6b7a0e] hover:bg-gray-50"
                            >
                                <Edit3 size={11} />
                                Edit
                            </button>
                        )}
                    </div>
                </div>
                <div className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-3">
                        <div className="flex items-start gap-10 flex-1">
                            <div>
                                <h2 className="text-base font-bold text-primary">{user?.name || 'Student Name'}</h2>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-xs text-primary capitalize">{roleConfig?.label || 'Student'}</span>
                                    <span className="text-gray-300 text-[10px]">•</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200/60">
                                        Active
                                    </span>
                                </div>
                            </div>
                            <div className="">
                                <span className="text-base font-bold text-primary tracking-wider block">Date of Birth</span>
                                {isEditing ? (
                                    <input
                                        name="dateOfBirth"
                                        value={formik.values.dateOfBirth}
                                        onChange={formik.handleChange}
                                        className="px-2 py-0.5 text-xs rounded border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#b0cb1f] text-gray-900"
                                    />
                                ) : (
                                    <span className="text-xs text-primary">{formik.values.dateOfBirth}</span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            {[
                                { label: 'Subject', value: formik.values.courses.length, icon: <BookOpen size={13} className="text-primary" /> },
                                { label: 'Avg Progress', value: `${avgProgress}%`, icon: <TrendingUp size={13} className="text-primary" /> },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                                        {s.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary leading-none">{s.value}</p>
                                        <p className="text-[10px] text-primary mt-0.5 leading-none">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-500">
                            <Receipt size={11} className="text-[#b0cb1f]" />
                            STU-2024-001
                        </span> */}
                    </div>

                    {/* Quick stats */}

                </div>
            </div>

            {/* ── Sections ── */}
            <div className="space-y-4">

                {/* Row 1: Contact Information + Guardian Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SectionCard icon={<Mail size={14} className="text-primary" />} title="Contact Information">
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <ReadOnlyField
                                    label="Email Address"
                                    value={user?.email || 'student@mokshapath.edu'}
                                    icon={<Mail size={10} className="text-primary" />}
                                />
                                <ReadOnlyField
                                    label="Mobile Number"
                                    value={(user as any)?.phone || '+91 98765 43210'}
                                    icon={<Phone size={10} className="text-primary" />}
                                />
                            </div>
                            <FormField
                                label="Address"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                isEditing={isEditing}
                                icon={<MapPin size={10} className="text-primary" />}
                            />
                        </div>
                    </SectionCard>
                    <SectionCard icon={<Users size={14} className="text-primary" />} title="Guardian Info">
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="Name" name="guardianName" value={formik.values.guardianName} onChange={formik.handleChange} isEditing={false} />
                                <FormField label="Relation" name="guardianRelation" value={formik.values.guardianRelation} onChange={formik.handleChange} isEditing={false} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="Email" name="guardianEmail" value={formik.values.guardianEmail} onChange={formik.handleChange} isEditing={false} />
                                <FormField label="Phone" name="guardianPhone" value={formik.values.guardianPhone} onChange={formik.handleChange} isEditing={false} />
                            </div>
                        </div>
                    </SectionCard>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SectionCard icon={<GraduationCap size={14} className="text-primary" />} title="Academic Information">
                        <div className="p-4 grid grid-cols-3 gap-4">
                            <FormField label="Board" name="board" value={formik.values.board} onChange={formik.handleChange} isEditing={isEditing} />
                            <FormField label="School" name="grade" value={formik.values.grade} onChange={formik.handleChange} isEditing={isEditing} />
                            <FormField label="Section" name="section" value={formik.values.section} onChange={formik.handleChange} isEditing={isEditing} />
                                                        <FormField label="Academic Year" name="academic" value={formik.values.academic} onChange={formik.handleChange} isEditing={isEditing} />
                            <div className="col-span-2">
                                <FormField label="Enrollment" name="enrollmentDate" value={formik.values.enrollmentDate} onChange={formik.handleChange} isEditing={isEditing} />
                            </div>
                        </div>
                    </SectionCard>

                    {/* Current Progress */}
                    <SectionCard
                        icon={<TrendingUp size={14} className="text-primary" />}
                        title="Current Progress"
                    >
                        <div className="p-4 space-y-3">
                            {formik.values.courses.map((course, index) => (
                                <div key={index}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-primary w-32 shrink-0 truncate">{course.name}</span>
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${course.progress}%`, backgroundColor: getProgressColor(Number(course.progress)) }}
                                            />
                                        </div>
                                        <span className="text-xs text-primary w-8 text-right shrink-0">{course.progress}%</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${getGradeColor(course.grade)}`}>
                                            {course.grade}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {formik.values.courses.length === 0 && (
                                <p className="text-xs text-primary text-center py-2">No courses added yet.</p>
                            )}
                        </div>
                    </SectionCard>
                </div>
            </div>

            {/* ── Add Profile Modal ── */}
            {profileBtn.targetRole && (
                <AddProfileModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    targetRole={profileBtn.targetRole}
                />
            )}
        </form>
    );
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

/** Section card wrapper */
const SectionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}> = ({ icon, title, action, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-sm font-bold text-primary">{title}</h3>
            </div>
            {action && <div>{action}</div>}
        </div>
        {children}
    </div>
);

/** Editable / display field bound to Formik */
const FormField: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    isEditing?: boolean;
    highlight?: boolean;
    icon?: React.ReactNode;
}> = ({ label, name, value, onChange, isEditing, highlight, icon }) => (
    <div>
        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
            {label}
        </label>
        {isEditing ? (
            <input
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#b0cb1f] focus:ring-2 focus:ring-[#b0cb1f]/20 text-gray-900 transition-all"
            />
        ) : (
            <div className="flex items-center gap-1">
                {icon && <span className="shrink-0">{icon}</span>}
                <p className={`text-xs font-medium text-primary ${highlight ? 'text-base font-bold text-[#6b7a0e]' : ''}`}>
                    {value || <span className="text-gray-300 italic">—</span>}
                </p>
            </div>
        )}
    </div>
);

/** Always read-only field (Email, Mobile) */
const ReadOnlyField: React.FC<{
    label: string;
    value: string;
    icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
    <div>
        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1 flex items-center gap-1">
            {label}
            <Lock size={8} className="text-gray-300" />
        </label>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
            {icon && <span className="shrink-0">{icon}</span>}
            <p className="text-xs font-medium text-primary truncate">{value}</p>
        </div>
    </div>
);

/** Modal for adding a new profile (Parent/Child) */
const AddProfileModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    targetRole: 'parent' | 'student';
}> = ({ isOpen, onClose, targetRole }) => {
    const [name, setName] = useState('');
    const [identifier, setIdentifier] = useState(''); // Email or Mobile
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !identifier) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            const payload = {
                name,
                auth_identifier: identifier,
                role_name: targetRole
            };

            const response = await ApiServices.addProfileV4(payload);
            if (response.data?.status === 'success') {
                onClose();
                // Optionally refresh or show success toast (not implemented in this component)
                window.location.reload(); // Simple way to refresh profiles
            } else {
                setError(response.data?.message || 'Failed to add profile');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-primary hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Add {targetRole === 'parent' ? 'Parent' : 'Child'}
                </h2>
                <p className="text-sm text-gray-500 mb-6">Create a linked profile for your {targetRole === 'parent' ? 'guardian' : 'child'}.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#b0cb1f] focus:ring-2 focus:ring-[#b0cb1f]/20 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                            Email or Mobile Number
                        </label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#b0cb1f] focus:ring-2 focus:ring-[#b0cb1f]/20 transition-all"
                            required
                        />
                    </div>

                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-[#b0cb1f] hover:bg-[#a0ba1c] rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <PlusCircle size={14} />
                                    Add Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentProfile;
