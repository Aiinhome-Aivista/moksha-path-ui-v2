import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/AuthContext";
// @ts-ignore - JSX file without type declarations
import ApiServices from "../../../services/ApiServices";

interface MasterItem {
  id: number;
  name: string;
}

interface AcademicYear {
  year: string;
}

export const AcademicDetails: React.FC = () => {
  const [formData, setFormData] = useState({
    board: "",
    classStandard: "",
    school: "",
    academicYear: "",
  });

  // API data states
  const [boards, setBoards] = useState<MasterItem[]>([]);
  const [schools, setSchools] = useState<MasterItem[]>([]);
  const [classes, setClasses] = useState<MasterItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

  // Loading states
  const [isLoadingBoards, setIsLoadingBoards] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingYears, setIsLoadingYears] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const {
    isAcademicDetailsOpen,
    closeAcademicDetails,
    handleAcademicDetailsSelectSubjects,
    // handleAcademicDetailsBack,
  } = useModal();

  // Fetch boards on component mount
  useEffect(() => {
    if (isAcademicDetailsOpen) {
      fetchBoards();
    }
  }, [isAcademicDetailsOpen]);

  // Fetch schools when board changes
  useEffect(() => {
    if (formData.board) {
      fetchSchools(formData.board);
      // Reset dependent fields
      setFormData((prev) => ({
        ...prev,
        school: "",
        classStandard: "",
        academicYear: "",
      }));
      setClasses([]);
      setAcademicYears([]);
    }
  }, [formData.board]);

  // Fetch classes when school changes
  useEffect(() => {
    if (formData.board && formData.school) {
      fetchClasses(formData.board, formData.school);
      // Reset dependent fields
      setFormData((prev) => ({ ...prev, classStandard: "", academicYear: "" }));
      setAcademicYears([]);
    }
  }, [formData.school]);

  // Fetch academic years when class changes
  useEffect(() => {
    if (formData.board && formData.school && formData.classStandard) {
      fetchAcademicYears(
        formData.board,
        formData.school,
        formData.classStandard,
      );
      // Reset dependent field
      setFormData((prev) => ({ ...prev, academicYear: "" }));
    }
  }, [formData.classStandard]);

  const fetchBoards = async () => {
    setIsLoadingBoards(true);
    try {
      const response = await ApiServices.getAcademicMasters();
      if (response.data?.status === "success" && response.data?.data) {
        setBoards(response.data.data);
      }
    } catch (error) {
      // console.error("Failed to fetch boards:", error);
    } finally {
      setIsLoadingBoards(false);
    }
  };

  // Prevent background scroll when modal is open (Bulletproof Mobile Fix)
  useEffect(() => {
    if (isAcademicDetailsOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isAcademicDetailsOpen]);

  const fetchSchools = async (boardId: string) => {
    setIsLoadingSchools(true);
    setSchools([]);
    try {
      const response = await ApiServices.getAcademicMasters({
        board_id: boardId,
      });
      if (response.data?.status === "success" && response.data?.data) {
        setSchools(response.data.data);
      }
    } catch (error) {
      // console.error("Failed to fetch schools:", error);
    } finally {
      setIsLoadingSchools(false);
    }
  };

  const fetchClasses = async (boardId: string, schoolId: string) => {
    setIsLoadingClasses(true);
    setClasses([]);
    try {
      const response = await ApiServices.getAcademicMasters({
        board_id: boardId,
        school_id: schoolId,
      });
      if (response.data?.status === "success" && response.data?.data) {
        setClasses(response.data.data);
      }
    } catch (error) {
      // console.error("Failed to fetch classes:", error);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const fetchAcademicYears = async (
    boardId: string,
    schoolId: string,
    classId: string,
  ) => {
    setIsLoadingYears(true);
    setAcademicYears([]);
    try {
      const response = await ApiServices.getAcademicMasters({
        board_id: boardId,
        school_id: schoolId,
        class_id: classId,
      });
      if (response.data?.status === "success" && response.data?.data) {
        setAcademicYears(response.data.data);
      }
    } catch (error) {
      // console.error("Failed to fetch academic years:", error);
    } finally {
      setIsLoadingYears(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectSubjects = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        board_id: Number(formData.board),
        class_id: Number(formData.classStandard),
        institute_id: Number(formData.school),
        academic_year: formData.academicYear,
        subject_ids: null, // IMPORTANT: academic details save stage
      };

      //  SAVE ACADEMIC DETAILS IN DB
      const response = await ApiServices.saveBoardClassUserMapping(payload);
      localStorage.setItem("academic_payload", JSON.stringify(payload));

      if (response.data?.status !== "success") {
        alert(response.data?.message || "Failed to save academic details");
        return;
      }

      //  OPEN SUBJECT SELECTION MODAL
      handleAcademicDetailsSelectSubjects();
    } catch (error: any) {
      // console.error("Academic Save Error:", error);
      // alert(
      //   error?.response?.data?.message || "Failed to save academic details",
      // );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    closeAcademicDetails();
    navigate("/student/dashboard");
  };

  if (!isAcademicDetailsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overscroll-contain flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 touch-none" />
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full md:min-h-[32rem] max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex md:w-[35%] bg-[#f5f7fa] items-center justify-center p-6">
          <div className="relative w-full max-w-sm">
            <img
              src="/image84.svg"
              alt="Students Illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="w-full md:w-[65%] p-5 sm:p-8 lg:p-10 overflow-y-auto">
          <button
            onClick={closeAcademicDetails}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h1 className="text-2xl sm:text-[28px] font-bold text-primary mb-5 sm:mb-6 pr-8 sm:pr-0">
            Academic Details
          </h1>
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
              <img
                src="/correct.svg"
                alt="Success"
                className="w-full h-auto"
              />
            </div>
            <p className="text-primary font-medium text-sm sm:text-base">
              You have been successfully signed-in.
            </p>
          </div>

          {/* Description */}
          <p className="text-primary text-sm mb-6 sm:mb-8">
            Please provide the following details to opt for your subscription.
          </p>

          {/* Form */}
          <div className="space-y-5 sm:space-y-6">
            {/* Row 1: Select Board & School */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
              <div>
                <label className="block text-base sm:text-sm font-semibold text-primary mb-2">
                  Select Board
                </label>
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleChange}
                  disabled={isLoadingBoards}
                  className="w-full py-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent text-base sm:text-sm disabled:opacity-50"
                >
                  <option value="" disabled>
                    {isLoadingBoards ? "Loading..." : "Select Board"}
                  </option>
                  {boards.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base sm:text-sm font-semibold text-primary mb-2">
                  Your School/College/University
                </label>
                <select
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  disabled={!formData.board || isLoadingSchools}
                  className="w-full py-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent text-base sm:text-sm disabled:opacity-50"
                >
                  <option value="" disabled>
                    {isLoadingSchools ? "Loading..." : "Select School"}
                  </option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Row 2: Class & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
              <div>
                <label className="block text-base sm:text-sm font-semibold text-primary mb-2">
                  Class/Standard
                </label>
                <select
                  name="classStandard"
                  value={formData.classStandard}
                  onChange={handleChange}
                  disabled={!formData.school || isLoadingClasses}
                  className="w-full py-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent text-base sm:text-sm disabled:opacity-50"
                >
                  <option value="" disabled>
                    {isLoadingClasses ? "Loading..." : "Select Class"}
                  </option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base sm:text-sm font-semibold text-primary mb-2">
                  Academic Year
                </label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  disabled={!formData.classStandard || isLoadingYears}
                  className="w-full py-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent text-base sm:text-sm disabled:opacity-50"
                >
                  <option value="" disabled>
                    {isLoadingYears ? "Loading..." : "Select Year"}
                  </option>
                  {academicYears.map((year, index) => (
                    <option key={index} value={year.year}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-start gap-3 sm:gap-4 pt-6 sm:pt-8 w-full">
              {/* <button
                onClick={handleAcademicDetailsBack}
                className="w-full sm:w-auto px-8 py-3 sm:py-2.5 rounded-full bg-primary text-white text-base sm:text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Back
              </button> */}
              <button
                onClick={handleSkip}
                className="w-full sm:w-auto px-8 py-3 sm:py-2.5 rounded-full bg-primary text-white text-base sm:text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleSelectSubjects}
                disabled={
                  !formData.board ||
                  !formData.school ||
                  !formData.classStandard ||
                  !formData.academicYear ||
                  isSubmitting
                }
                className={`w-full sm:w-auto px-8 py-3 sm:py-2.5 rounded-full text-base sm:text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                  formData.board &&
                  formData.school &&
                  formData.classStandard &&
                  formData.academicYear
                    ? "bg-button-primary text-primary hover:opacity-90"
                    : "bg-primary text-white"
                } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Select Subjects..." : "Select Subjects"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDetails;