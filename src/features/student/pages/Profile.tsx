import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useModal } from '../../../features/auth/context/AuthContext';
import ApiServices from '../../../services/ApiServices';
import {
    Mail, BookOpen,
    Award, TrendingUp, User, Edit3, CheckCircle2,
    GraduationCap, Users, Receipt
} from 'lucide-react';

const StudentProfile: React.FC = () => {
    const { user, roleConfig } = useAuth();
    const { openProfileSelection, setProfilesList } = useModal();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
    const [profileImage, setProfileImage] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleViewProfiles = async () => {
        try {
            setIsLoadingProfiles(true);
            const response = await ApiServices.getUsersByTokenContact();
            if (response.data?.status === 'success') {
                setProfilesList(response.data.data);
                openProfileSelection();
            }
        } catch (error) {
            // console.error('Failed to fetch profiles:', error);
        } finally {
            setIsLoadingProfiles(false);
        }
    };

    const profileData = {
        studentId: 'STU-2024-001',
        email: user?.email || 'student@mokshapath.edu',
        phone: (user as any)?.phone || '+91 98765 43210',
        dateOfBirth: 'January 15, 2005',
        enrollmentDate: 'August 1, 2023',
        grade: '11th Grade',
        section: 'A',
        gpa: '3.8',
        address: '123 Learning Street, Education City, EC 12345',
        guardianName: 'Robert Doe',
        guardianPhone: '+91 98765 99999',
    };

    const achievements = [
        { id: 1, title: 'Honor Roll', date: 'Fall 2023', emoji: '🏆' },
        { id: 2, title: 'Science Fair Winner', date: 'March 2023', emoji: '🔬' },
        { id: 3, title: 'Perfect Attendance', date: '2023-2024', emoji: '⭐' },
        { id: 4, title: 'Math Olympiad Finalist', date: 'Dec 2023', emoji: '🧮' },
    ];

    const courses = [
        { id: 1, name: 'Advanced Mathematics', grade: 'A', progress: 85 },
        { id: 2, name: 'Physics', grade: 'A-', progress: 78 },
        { id: 3, name: 'English Literature', grade: 'B+', progress: 92 },
        { id: 4, name: 'Computer Science', grade: 'A', progress: 95 },
        { id: 5, name: 'Chemistry', grade: 'B+', progress: 72 },
    ];

    const avgProgress = Math.round(courses.reduce((p, c) => p + c.progress, 0) / courses.length);

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'bg-[#b0cb1f]/10 text-[#6b7a0e]';
        if (grade.startsWith('B')) return 'bg-blue-50 text-blue-700';
        return 'bg-gray-100 text-gray-600';
    };

    const getProgressColor = (value: number) => {
        if (value >= 85) return '#b0cb1f';
        if (value >= 70) return '#f97316';
        return '#ef4444';
    };

    return (
        <div className="p-4 sm:p-5">

            {/* Profile Hero Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                {/* Banner — avatar + title + buttons all in one row */}
                <div className="h-20 bg-gradient-to-r from-[#b0cb1f] to-lime-400 relative flex items-center px-5 gap-4">
                    {/* Decorative circles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full bg-white/10" />
                        <div className="absolute -bottom-6 right-16 w-20 h-20 rounded-full bg-white/10" />
                    </div>

                    {/* Avatar — clickable to upload */}
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
                        {/* Camera badge */}
                        <button
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

                    {/* Title + subtitle */}
                    <div className="relative flex-1 min-w-0">
                        <h1 className="text-lg font-bold text-white leading-none">My Profile</h1>
                        <p className="text-xs text-white/80 mt-0.5">View and manage your personal information</p>
                    </div>

                    {/* Action buttons */}
                    <div className="relative flex gap-1.5 shrink-0">
                        <button
                            onClick={handleViewProfiles}
                            disabled={isLoadingProfiles}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/25 hover:bg-white/35 text-white text-xs font-semibold transition-all"
                        >
                            <User size={11} />
                            Profiles
                        </button>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all bg-white text-[#6b7a0e] hover:bg-gray-50"
                        >
                            {isEditing ? <CheckCircle2 size={11} /> : <Edit3 size={11} />}
                            {isEditing ? 'Save' : 'Edit'}
                        </button>
                    </div>
                </div>

                {/* Name / role / stats below */}
                <div className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">{user?.name || 'Student Name'}</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-gray-500 capitalize">{roleConfig?.label || 'Student'}</span>
                                <span className="text-gray-300 text-[10px]">•</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200/60">
                                    Active
                                </span>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-500">
                            <Receipt size={11} className="text-[#b0cb1f]" />
                            {profileData.studentId}
                        </span>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: 'Courses', value: courses.length, icon: <BookOpen size={13} className="text-[#b0cb1f]" /> },
                            { label: 'Achievements', value: achievements.length, icon: <Award size={13} className="text-amber-500" /> },
                            { label: 'Avg Progress', value: `${avgProgress}%`, icon: <TrendingUp size={13} className="text-blue-500" /> },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                                    {s.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 leading-none">{s.value}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 leading-none">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* LEFT column */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Contact + Academic merged — two sections side by side inside one card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
                            <Mail size={14} className="text-[#b0cb1f]" />
                            <h3 className="text-sm font-bold text-gray-800">Contact Information</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoField label="Email Address" value={profileData.email} isEditing={isEditing} />
                            <InfoField label="Phone Number" value={profileData.phone} isEditing={isEditing} />
                            <div className="sm:col-span-2">
                                <InfoField label="Address" value={profileData.address} isEditing={isEditing} />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
                            <GraduationCap size={14} className="text-[#b0cb1f]" />
                            <h3 className="text-sm font-bold text-gray-800">Academic Information</h3>
                        </div>
                        <div className="p-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                            <InfoField label="Grade" value={profileData.grade} isEditing={isEditing} />
                            <InfoField label="Section" value={profileData.section} isEditing={isEditing} />
                            <InfoField label="GPA" value={profileData.gpa} isEditing={isEditing} highlight />
                            <InfoField label="Date of Birth" value={profileData.dateOfBirth} isEditing={isEditing} />
                            <InfoField label="Enrollment" value={profileData.enrollmentDate} isEditing={isEditing} />
                        </div>
                    </div>

                    {/* Current Courses — compact rows */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
                            <TrendingUp size={14} className="text-[#b0cb1f]" />
                            <h3 className="text-sm font-bold text-gray-800">Current Courses</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {courses.map((course) => (
                                <div key={course.id} className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700 w-44 shrink-0 truncate">{course.name}</span>
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${course.progress}%`, backgroundColor: getProgressColor(course.progress) }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 w-8 text-right shrink-0">{course.progress}%</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${getGradeColor(course.grade)}`}>
                                        {course.grade}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT sidebar */}
                <div className="space-y-4">

                    {/* Guardian Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
                            <Users size={14} className="text-[#b0cb1f]" />
                            <h3 className="text-sm font-bold text-gray-800">Guardian Info</h3>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-4">
                            <InfoField label="Name" value={profileData.guardianName} isEditing={isEditing} />
                            <InfoField label="Phone" value={profileData.guardianPhone} isEditing={isEditing} />
                        </div>
                    </div>

                    {/* Achievements — compact list */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
                            <Award size={14} className="text-[#b0cb1f]" />
                            <h3 className="text-sm font-bold text-gray-800">Achievements</h3>
                        </div>
                        <div className="p-3 space-y-1">
                            {achievements.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-base shrink-0">{a.emoji}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-gray-800 truncate">{a.title}</p>
                                        <p className="text-[10px] text-gray-400">{a.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

// Compact field component
const InfoField: React.FC<{
    label: string;
    value: string;
    isEditing?: boolean;
    highlight?: boolean;
}> = ({ label, value, isEditing, highlight }) => (
    <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            {label}
        </label>
        {isEditing ? (
            <input
                defaultValue={value}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#b0cb1f] focus:ring-2 focus:ring-[#b0cb1f]/20 text-gray-900 transition-all"
            />
        ) : (
            <p className={`text-xs font-medium text-gray-800 ${highlight ? 'text-base font-bold text-[#6b7a0e]' : ''}`}>
                {value}
            </p>
        )}
    </div>
);

export default StudentProfile;
