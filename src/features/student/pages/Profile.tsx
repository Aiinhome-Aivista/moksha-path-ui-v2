import React, { useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import Button from '../../../components/common/Button';
import { useModal } from '../../../features/auth/context/AuthContext';
import ApiServices from '../../../services/ApiServices';

const StudentProfile: React.FC = () => {
    const { user, roleConfig } = useAuth();
    const { openProfileSelection, setProfilesList } = useModal();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

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

    // Mock profile data
    const profileData = {
        studentId: 'STU-2024-001',
        email: user?.email || 'john.doe@mokshapath.edu',
        phone: '+1 (555) 123-4567',
        dateOfBirth: 'January 15, 2005',
        enrollmentDate: 'August 1, 2023',
        grade: '11th Grade',
        section: 'A',
        gpa: '3.8',
        address: '123 Learning Street, Education City, EC 12345',
        guardianName: 'Robert Doe',
        guardianPhone: '+1 (555) 987-6543',
    };

    const achievements = [
        { id: 1, title: 'Honor Roll', date: 'Fall 2023', icon: '🏆' },
        { id: 2, title: 'Science Fair Winner', date: 'March 2023', icon: '🔬' },
        { id: 3, title: 'Perfect Attendance', date: '2023-2024', icon: '⭐' },
        { id: 4, title: 'Math Olympiad Finalist', date: 'December 2023', icon: '🧮' },
    ];

    const courses = [
        { id: 1, name: 'Advanced Mathematics', grade: 'A', progress: 85 },
        { id: 2, name: 'Physics', grade: 'A-', progress: 78 },
        { id: 3, name: 'English Literature', grade: 'B+', progress: 92 },
        { id: 4, name: 'Computer Science', grade: 'A', progress: 95 },
        { id: 5, name: 'Chemistry', grade: 'B+', progress: 72 },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                        My Profile
                    </h1>
                    <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                        Manage your personal information and preferences
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleViewProfiles}
                        isLoading={isLoadingProfiles}
                        className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                    >
                        View Profiles
                    </Button>
                    <Button
                        variant={isEditing ? 'primary' : 'outline'}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                </div>

                {/* Profile Info */}
                <div className="relative px-6 pb-6">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl ring-4 ring-white dark:ring-secondary-800">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pt-16">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                    {user?.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-lg">{roleConfig?.icon}</span>
                                    <span className="text-secondary-500 dark:text-secondary-400 capitalize">
                                        {roleConfig?.label}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        Active
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
                                <span>Student ID:</span>
                                <span className="font-mono font-medium text-secondary-900 dark:text-white">
                                    {profileData.studentId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                Contact Information
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Email Address
                                </label>
                                <p className="mt-1 font-medium text-secondary-900 dark:text-white">
                                    {profileData.email}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Phone Number
                                </label>
                                <p className="mt-1 font-medium text-secondary-900 dark:text-white">
                                    {profileData.phone}
                                </p>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Address
                                </label>
                                <p className="mt-1 font-medium text-secondary-900 dark:text-white">
                                    {profileData.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                Academic Information
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Grade
                                </label>
                                <p className="mt-1 font-medium text-secondary-900 dark:text-white">
                                    {profileData.grade}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Section
                                </label>
                                <p className="mt-1 font-medium text-secondary-900 dark:text-white">
                                    {profileData.section}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Current GPA
                                </label>
                                <p className="mt-1 font-medium text-green-600 dark:text-green-400">
                                    {profileData.gpa}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Date of Birth
                                </label>
                                <p className="mt-1 font-medium text-secondary-900 dark:text-white">
                                    {profileData.dateOfBirth}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Enrollment Date
                                </label>
                                <p className="mt-1 font-medium text-secondary-900 dark:text-white">
                                    {profileData.enrollmentDate}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Current Courses */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                Current Courses
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {courses.map((course) => (
                                <div key={course.id} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-secondary-900 dark:text-white">
                                                {course.name}
                                            </span>
                                            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                                {course.grade}
                                            </span>
                                        </div>
                                        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-secondary-500 dark:text-secondary-400 w-12 text-right">
                                        {course.progress}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Guardian Information */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                Guardian Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Name
                                </label>
                                <p className="mt-1 font-medium text-secondary-900 dark:text-white">
                                    {profileData.guardianName}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-secondary-500 dark:text-secondary-400">
                                    Phone
                                </label>
                                <p className="mt-1 font-medium text-secondary-900 dark:text-white">
                                    {profileData.guardianPhone}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
                        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                Achievements
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-700/50"
                                >
                                    <span className="text-2xl">{achievement.icon}</span>
                                    <div>
                                        <p className="font-medium text-secondary-900 dark:text-white text-sm">
                                            {achievement.title}
                                        </p>
                                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                            {achievement.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
