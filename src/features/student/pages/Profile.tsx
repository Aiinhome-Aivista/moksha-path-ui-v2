import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useModal } from '../../../features/auth/context/AuthContext';
import ApiServices from '../../../services/ApiServices';

const StudentProfile: React.FC = () => {
    const { user, roleConfig } = useAuth();
    const { openProfileSelection, setProfilesList } = useModal();
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

    // State for actual data fetched from APIs
    const [profileImage, setProfileImage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [studentData, setStudentData] = useState({
        name: user?.name || 'Student',
        email: user?.email || '',
        phone: '',
        school: 'Not Assigned',
        board: 'Not Assigned',
        className: 'Not Assigned',
        subjects: [] as any[],
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                // Fetch Profile Image
                const imageRes = await ApiServices.getUserProfileImage();
                if (imageRes.data?.status === 'success' && imageRes.data?.data?.image) {
                    setProfileImage(imageRes.data.data.image);
                }

                // Fetch Planner Stats for school/board info
                const plannerRes = await ApiServices.getStudentLearningPlanner();
                let stats: any = {};
                if (plannerRes.data?.status === 'success') {
                    stats = plannerRes.data.data.stats;
                }

                // Fetch Subjects
                const subjectsRes = await ApiServices.getStudentSubjects();
                const subjects = subjectsRes.data?.data || [];

                // Try pulling from user_data localStorage as fallback for phone/email
                let localUserData = { phone: '', email: user?.email || '' };
                try {
                    const storedData = localStorage.getItem('user_data');
                    if (storedData) {
                        const parsed = JSON.parse(storedData);
                        localUserData.phone = parsed.phone || parsed.contact || '';
                        if (!localUserData.email) localUserData.email = parsed.email || '';
                    }
                } catch (e) {
                    // console.error(e);
                }

                setStudentData({
                    name: stats.student_name || user?.name || 'Student',
                    email: localUserData.email,
                    phone: localUserData.phone,
                    school: stats.institute_name || 'Not Available',
                    board: stats.board_name || 'Not Available',
                    className: stats.class_name || 'Not Available',
                    subjects: subjects,
                });

            } catch (error) {
                // console.error('Failed to fetch profile details', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [user]);

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

    const getInitial = () => {
        return studentData.name?.charAt(0).toUpperCase() || 'S';
    };

    if (isLoading) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500 font-medium">Loading profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 relative">
            {/* Header Section Matches Dashboard */}
            <header className="flex flex-wrap justify-between items-start mb-12 gap-6">
                <div className="flex gap-4 items-start">
                    <div className="relative group cursor-pointer">
                        <div className="w-[90px] h-[90px] rounded-full overflow-hidden flex-shrink-0 border-3 border-gray-200 group-hover:border-[#b0cb1f] transition-colors duration-300 bg-gray-100 flex items-center justify-center">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#b0cb1f] to-lime-500 text-white">
                                    <span className="text-4xl font-bold">{getInitial()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-2xl text-[#ABB3BC] font-bold tracking-wide">
                            My Profile
                        </span>
                        <h1 className="text-3xl font-bold text-primary m-0">
                            {studentData.name}
                        </h1>
                        <p className="text-base text-primary font-medium m-0 flex items-center gap-2 mt-1">
                            <span className="px-3 py-1 bg-highlighter text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                {roleConfig?.label || 'Student'}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={handleViewProfiles}
                        disabled={isLoadingProfiles}
                        className="bg-[#b0cb1f] hover:bg-[#c5de3a] text-primary px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm"
                    >
                        {isLoadingProfiles ? 'Loading...' : 'Switch Profile'}
                    </button>
                </div>
            </header>

            {/* Main Content Grid Matches Dashboard Portions */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-12">
                <section>
                    <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-4 border-[#555555]">
                        Academic Details
                    </h2>
                    <ul className="list-none p-0 m-0 space-y-4">
                        <li className="flex justify-between items-center text-sm font-medium text-primary">
                            <span>• School or Institute</span>
                            <span className="font-bold">{studentData.school}</span>
                        </li>
                        <li className="flex justify-between items-center text-sm font-medium text-primary">
                            <span>• Current Board</span>
                            <span className="font-bold">{studentData.board}</span>
                        </li>
                        <li className="flex justify-between items-center text-sm font-medium text-primary">
                            <span>• Class / Grade</span>
                            <span className="font-bold">{studentData.className}</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-4 border-[#555555]">
                        Contact Information
                    </h2>
                    <ul className="list-none p-0 m-0 space-y-4">
                        <li className="flex justify-between items-center text-sm font-medium text-primary">
                            <span>• Email Address</span>
                            <span className="font-bold text-right">{studentData.email || 'Not provided'}</span>
                        </li>
                        <li className="flex justify-between items-center text-sm font-medium text-primary">
                            <span>• Phone Number</span>
                            <span className="font-bold">{studentData.phone || 'Not provided'}</span>
                        </li>
                    </ul>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <section>
                    <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-4 border-[#555555]">
                        Enrolled Subjects ({studentData.subjects.length})
                    </h2>
                    {studentData.subjects.length > 0 ? (
                        <div className="flex gap-16 flex-wrap mt-6">
                            {studentData.subjects.map((subject: any, index: number) => (
                                <div key={index} className="flex flex-col items-center justify-end text-center w-[100px]">
                                    <div className="flex items-center justify-center bg-highlighter w-[70px] h-[70px] rounded-full mb-3">
                                        <span className="text-2xl font-bold text-red-500">
                                            {subject.subject_name.charAt(0)}
                                        </span>
                                    </div>
                                    <span
                                        className="text-xs font-bold text-primary mt-1 uppercase tracking-wider max-w-[100px] break-words whitespace-normal text-center"
                                        style={{
                                            wordBreak: "break-word",
                                            lineHeight: "1.2",
                                            minHeight: "38px",
                                            display: "inline-block",
                                        }}
                                    >
                                        {subject.subject_name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mt-2">You are not currently enrolled in any subjects.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default StudentProfile;
