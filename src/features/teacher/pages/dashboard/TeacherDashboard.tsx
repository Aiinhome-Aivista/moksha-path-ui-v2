import React, { useState, useEffect } from 'react';
import ApiServices from '../../../../services/ApiServices';
import OverviewTab from './overviewTab';
import SyllabusTab from './syllabusTab';
import MockExamsTab from './mockExamsTab';
import RemediationTab from './remediationTab';

type TabName = 'Overview' | 'Syllabus' | 'Mock Exams' | 'Remediation';

const tabs: { name: TabName }[] = [
  { name: 'Overview' },
  { name: 'Syllabus' },
  { name: 'Mock Exams' },
  { name: 'Remediation' },
];

const tabComponents: Record<TabName, React.ReactElement> = {
  Overview: <OverviewTab />,
  Syllabus: <SyllabusTab />,
  'Mock Exams': <MockExamsTab />,
  Remediation: <RemediationTab />,
};

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Overview');
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const [profileRes, imageRes] = await Promise.all([
          ApiServices.getTeacherProfile(),
          ApiServices.getUserProfileImage()
        ]);

        if (profileRes.data?.status === 'success') {
          setProfileData(profileRes.data.data);
        }
        if (imageRes.data?.status === 'success' && imageRes.data?.data?.image) {
          setProfileImage(imageRes.data.data.image);
        }
      } catch (error) {
        console.error('Failed to fetch teacher profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const teacherName = profileData?.name || 'Teacher';
  const schoolName = profileData?.institute_name || 'Moksha Path';

  return (
    // Single wrapper for the entire dashboard
    <div className="flex flex-col">
      
      {/* 1. THE HEADER ROW */}
<div className="flex items-center w-full relative pt-2 -ml-6">
        
        {/* Left: Dark Profile Pill */}
        <div className="flex items-center gap-4 bg-[#4a4b4c] text-white py-4 pl-6 pr-16 rounded-r-[10rem] shadow-md z-10 relative flex-shrink-0 min-w-[320px]">
          <div className="relative flex-shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm"
                alt="profile"
              />
            ) : (
              <div className="w-14 h-14 rounded-full border-2 border-white bg-gradient-to-br from-[#BADA55] to-lime-400 flex items-center justify-center text-white text-xl font-black shadow-sm">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  teacherName.charAt(0).toUpperCase()
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-200 leading-none mb-0.5">
              Greetings
            </span>
            <h2 className="text-xl font-black leading-none tracking-tight">
              {teacherName}
            </h2>
            <p className="text-[10px] text-gray-300 font-medium mt-1 tracking-wide">
              {schoolName}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between px-6 py-2 bg-[#E9E9E9] h-14 rounded-tr-full rounded-br-full lg:col-span-2 xl:col-span-3">
          <h1 className="text-[#00bcd4] font-black text-lg tracking-tight  whitespace-nowrap">
            My Dashboard
          </h1>
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-10 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.name
                    ? "bg-yellow-500  text-black"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT AREA */}
      <main className="px-2 w-full animate-in fade-in duration-500">
        {tabComponents[activeTab]}
      </main>
      
    </div>
  );
};

export default TeacherDashboard;