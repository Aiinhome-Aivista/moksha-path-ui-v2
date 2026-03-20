import React from "react";

interface ProfileHeaderProps {
  avatarUrl: string;
  greeting: string;
  name: string;
  subtitle: string;
  altText: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  greeting,
  name,
  subtitle,
  altText,
}) => (
  <div className="flex items-center gap-4 bg-[#4a4b4c] text-white py-4 pl-6 pr-16 rounded-r-[10rem] shadow-md z-10 relative flex-shrink-0">
    <img
      src={avatarUrl}
      className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm flex-shrink-0"
      alt={altText}
    />
    <div className="flex flex-col justify-center">
      <span className="text-[11px] font-bold text-gray-200 leading-none mb-0.5">
        {greeting}
      </span>
      <h2 className="text-xl font-black leading-none tracking-tight">
        {name}
      </h2>
      <p className="text-[10px] text-gray-300 font-medium mt-1 tracking-wide">{subtitle}</p>
    </div>
  </div>
);

interface DashboardHeaderProps {
  profile: {
    avatarUrl: string;
    greeting: string;
    name: string;
    school: string;
  };
  meta: {
    title: string;
    academicYear: string;
  };
  profileAltText: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  meta,
  profileAltText,
}) => {
  return (
    <div className="flex items-center w-full relative pt-2 -ml-6">
      <ProfileHeader
        avatarUrl={profile.avatarUrl}
        greeting={profile.greeting}
        name={profile.name}
        subtitle={profile.school}
        altText={profileAltText}
      />
      <div className="flex flex-1 items-center justify-start px-6 py-2 bg-[#E9E9E9] h-14 rounded-tr-full rounded-br-full">
        <div>
          <span className="text-lg font-bold text-cyan-600">{meta.title}</span>
          <span className="text-gray-400 mx-2 font-light">|</span>
          <span className="text-sm font-semibold text-primary">{meta.academicYear}</span>
        </div>
      </div>
    </div>
  );
};