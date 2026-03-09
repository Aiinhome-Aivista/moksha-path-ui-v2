import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/AuthContext";
import { useEffect } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
// @ts-ignore - JSX file without type declarations
import ApiServices from "../../../services/ApiServices";

interface Subject {
  subject_id: number;
  subject_name: string;
}

export const SelectSubjectsModal: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);

  const navigate = useNavigate();
  const {
    isSelectSubjectsOpen,
    closeSelectSubjects,
    handleSelectSubjectsBack,
  } = useModal();
  const { role: authRole } = useAuth();

  // Prevent background scroll when modal is open (Bulletproof Mobile Fix)
  useEffect(() => {
    if (isSelectSubjectsOpen) {
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
  }, [isSelectSubjectsOpen]);

  useEffect(() => {
    if (isSelectSubjectsOpen) {
      // Reset selections when modal opens so old subjects don't persist
      setSelectedSubjects([]);
      fetchSubjects();
    }
  }, [isSelectSubjectsOpen]);

  const fetchSubjects = async () => {
    const stored = localStorage.getItem("academic_payload");
    if (!stored) return;

    const payload = JSON.parse(stored);

    setIsLoading(true);
    try {
      const response = await ApiServices.getSubjectsByBoards({
        institute_name: payload.institute_id,
        board_name: payload.board_id,
        class_name: payload.class_id,
        academic_year: payload.academic_year,
      });

      if (response.data?.status === "success") {
        setSubjects(response.data.data.subjects);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects((prev) => {
      const exists = prev.find((s) => s.subject_id === subject.subject_id);

      if (exists) {
        return prev.filter((s) => s.subject_id !== subject.subject_id);
      } else {
        return [...prev, subject];
      }
    });
  };

  const handleSubscribe = async () => {
    try {
      const storedAcademic = localStorage.getItem("academic_payload");

      if (!storedAcademic) {
        alert("Academic details missing");
        return;
      }

      setIsSubscribing(true);

      const academicData = JSON.parse(storedAcademic);

      const subject_ids = selectedSubjects.map((s) => s.subject_id);

      const payload = {
        board_id: academicData.board_id,
        class_id: academicData.class_id,
        institute_id: academicData.institute_id,
        academic_year: academicData.academic_year,
        subject_ids: subject_ids,
      };

      const response = await ApiServices.saveBoardClassUserMapping(payload);

      if (response.data.status === "success") {
        //  Remove temporary wizard storage
        localStorage.removeItem("academic_payload");

        closeSelectSubjects();
        navigate("/subscription");
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      // console.error("Subscription Error:", error);
      alert(
        error?.response?.data?.message ||
          "Something went wrong while saving subscription",
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSkip = () => {
    closeSelectSubjects();
    const role = authRole?.toLowerCase();
    if (role === "teacher") {
      navigate("/teacher/dashboard", { replace: true });
    } else if (role === "parent") {
      navigate("/parent/dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  if (!isSelectSubjectsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overscroll-contain">
      <div className="absolute inset-0 bg-black/40 touch-none" />
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full md:min-h-[32rem] max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-[38%] bg-[#f5f7fa] items-center justify-center p-6">
          <div className="relative w-full max-w-sm">
            <img
              src="/image85.svg"
              alt="Students Illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="w-full md:w-[62%] p-5 sm:p-8 lg:p-10 relative overflow-y-auto flex flex-col">
          <button
            onClick={closeSelectSubjects}
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

          <h1 className="text-2xl sm:text-[26px] font-bold text-primary mb-3 sm:mb-4 pr-8 sm:pr-0">
            Select Subjects
          </h1>
          <p className="text-base sm:text-sm text-primary mb-6 sm:mb-8 leading-relaxed">
            Please select the subjects you want to access and evaluate
            your-self. We will present the subscriptions based on your
            selections.
          </p>

          {/* Subject Chips */}
          <div className="flex flex-wrap gap-2.5 mb-8 sm:mb-10">
            {isLoading && (
              <p className="text-sm text-gray-500">Loading subjects...</p>
            )}

            {!isLoading && subjects.length === 0 && (
              <p className="text-sm text-gray-500">No subjects found</p>
            )}

            {!isLoading &&
              subjects.map((subject) => (
                <button
                  key={subject.subject_id}
                  onClick={() => toggleSubject(subject)}
                  className={`
          px-4 py-2 sm:px-4 sm:py-2 rounded-full text-base sm:text-sm font-medium
          transition-all duration-200 border
          ${
            selectedSubjects.some((s) => s.subject_id === subject.subject_id)
              ? "bg-button-primary text-primary border-lime-500"
              : "bg-primary text-white border-primary hover:bg-gray-600"
          }
        `}
                >
                  {subject.subject_name}
                </button>
              ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-auto sm:mt-auto pt-4 sm:pt-0 w-full">
            <button
              onClick={handleSelectSubjectsBack}
              className="w-full sm:w-auto flex justify-center px-7 py-3 sm:py-2.5 rounded-full bg-primary text-white text-base sm:text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSkip}
              className="w-full sm:w-auto flex justify-center px-7 py-3 sm:py-2.5 rounded-full bg-primary text-white text-base sm:text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleSubscribe}
              disabled={selectedSubjects.length === 0 || isSubscribing}
              className={`w-full sm:w-auto flex justify-center px-7 py-3 sm:py-2.5 rounded-full text-base sm:text-sm font-medium transition-colors border disabled:cursor-not-allowed ${
                selectedSubjects.length > 0
                  ? "bg-button-primary text-primary border-lime-500 hover:opacity-90"
                  : "bg-primary text-white border-primary"
              }`}
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectSubjectsModal;