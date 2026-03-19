import React from "react";
import { remediationFooterData } from "../NewStudent";

interface FooterCardProps {
  title: string;
  value: string;
  subtitle: string;
  description: string;
  progress: number;
  color: string;
}

const FooterCard: React.FC<FooterCardProps> = ({
  title,
  value,
  subtitle,
  description,
  progress,
  color,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow border flex flex-col justify-between">
      
      {/* Top */}
      <div className="flex justify-between items-center mt-2">
        <h3 className="font-semibold text-xl text-[#4DA1B3]">{title}</h3>
        <span className="text-sm text-gray-500">{value}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded mb-2">
        <div
          className="h-2 rounded"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>

      {/* Subtitle */}
      <p className="text-xs font-medium text-gray-600 mb-1">
        {subtitle}
      </p>

      {/* Description */}
      <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
        {description}
      </p>

      {/* Button */}
      <div className="flex justify-between items-center">
        <span className="text-yellow-500 text-lg">➜</span>
        <button className="text-xs bg-[#4DA1B3] text-white px-3 py-1 rounded-full">
          Buy a Plan
        </button>
      </div>
    </div>
  );
};

/* ------------------ Main Footer ------------------ */

const RemediationFooter = () => {
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {remediationFooterData.map((item, i) => (
        <FooterCard key={i} {...item} />
      ))}
    </div>
  );
};

export default RemediationFooter;