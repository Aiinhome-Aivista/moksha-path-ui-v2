import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IconChat from "../../../assets/icon/chat2.svg";
// @ts-ignore
import ApiServices from "../../../services/ApiServices";
import { useToast } from "../../../app/providers/ToastProvider";
import { useModal } from "../../auth/context/AuthContext";
import PaymentSummaryModal from "../components/PaymentSummaryModal";
import SubscriptionSetupModal from "../components/SubscriptionSetupModal";
import { defaultPlans } from "./defaultPlans";
import SearchableSelect from "../../../components/common/SearchableSelect";

// Types
interface Subject {
  subject_id: number;
  subject_name: string;
}

interface ApiFeature {
  feature_name: string;
  availability: string;
  feature_type: string;
}
interface SubjectPrice {
  subject_id: number;
  price: number;
}
interface ApiPlan {
  plan_id: number;
  plan_name: string;
  plan_tag: string;
  badge: string | null;
  billing_cycle: string;
  duration_days: number;
  payable_amount: number;
  subject_prices?: SubjectPrice[];
  features: ApiFeature[];
  plan_discount_percent: number;
  base_subject_total: number;
  monthly_divisor: number;
}

interface TransformedFeature {
  name: string;
  plans: Record<number, string>;
}

interface Board {
  id: number;
  name: string;
}

interface School {
  id: number;
  name: string;
}

interface ClassItem {
  id: number;
  name: string;
}

// interface Section {
//   id: number;
//   name: string;
// }

interface AcademicYear {
  year: string;
}

interface DependencyMapItem {
  academic_year: string;
  board_id: number;
  class_id: number;
  school_id: number;
  section_id?: number;
}

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [academicDetails, setAcademicDetails] = useState<{
    board_id: number;
    board_name: string;
    class_id: number;
    class_name: string;
    institute_id?: number;
    institute_name?: string;
    academic_year?: string;
  } | null>(null);

  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);
  const [isPlansLoading, setIsPlansLoading] = useState(false);

  const [hoveredPlanId, setHoveredPlanId] = useState<number | null>(null);
  const [plans, setPlans] = useState<ApiPlan[]>(defaultPlans);
  const [transformedFeatures, setTransformedFeatures] = useState<
    TransformedFeature[]
  >([]);
  const [selectedPlan, setSelectedPlan] = useState<ApiPlan | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sheetCount, setSheetCount] = useState<number>(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentTotalAmount, setCurrentTotalAmount] = useState(0);
  // const activeProfile = JSON.parse(localStorage.getItem("active_profile") || "{}");
  // const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
  // const storedSubId = localStorage.getItem("subscription_id");
  // const hasSubscription =
  //   (activeProfile.subscription_id !== null && activeProfile.subscription_id !== undefined) ||
  //   (userData.subscription_id !== null && userData.subscription_id !== undefined) ||
  //   (storedSubId !== null && storedSubId !== "");

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(" ");

  const [boards, setBoards] = useState<Board[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  // const [sections, setSections] = useState<Section[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [dependencyMap, setDependencyMap] = useState<DependencyMapItem[]>([]);

  const [selectedBoard, setSelectedBoard] = useState<number | "">(
    location.state?.preselectedAcademicDetails?.board_id || "",
  );
  const [selectedSchool, setSelectedSchool] = useState<number | "">(
    location.state?.preselectedAcademicDetails?.institute_id || "",
  );
  const [selectedClass, setSelectedClass] = useState<number | "">(
    location.state?.preselectedAcademicDetails?.class_id || "",
  );
  // const [selectedSection, setSelectedSection] = useState<number | "">("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const [showAddSchoolInput, setShowAddSchoolInput] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [isAddingSchool, setIsAddingSchool] = useState(false);

  const { user: modalUser } = useModal();
  const userName = modalUser?.name || "User";

  const defaultRole =
    modalUser?.roles?.find((role: any) => role.is_default === true) ||
    modalUser?.roles?.[0];

  const licenses_used = defaultRole?.role_id === 1 ? 1 : 0;

  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isStudent = localUser.role === "student";

  // Fetch academic details from backend (JWT based)
  React.useEffect(() => {
    const fetchAcademicDetails = async () => {
      try {
        const response = await ApiServices.getUserAcademicDetails();

        if (response.data?.status === "success") {
          const data = response.data.data[0];

          setAcademicDetails(data);

          // PRESELECT DROPDOWNS FOR STUDENT
          if (isStudent) {
            setSelectedBoard(data.board_id);
            setSelectedClass(data.class_id);
            setSelectedSchool(data.institute_id || "");
            // Academic year is left empty for student to select: "academic year bad e"
            setSelectedYear("");

            // Set selected subjects from API
            if (Array.isArray(data.subjects)) {
              setSelectedSubjects(data.subjects);
            }
          }
          setAcademicDetails(data);
        } else {
          setIsPageLoading(false);
        }
      } catch (error) {
        // console.error("Failed to load academic details", error);
        setIsPageLoading(false);
      }
    };

    fetchAcademicDetails();
    fetchProfileImage();
    fetchAcademicMasterData();
    transformData(defaultPlans);
  }, []);

  const fetchAcademicMasterData = async () => {
    try {
      const response = await ApiServices.getAcademicMasterData();

      if (response.data?.status === "success") {
        const data = response.data.data;

        setBoards(data.boards || []);
        setSchools(data.schools || []);
        setClasses(data.classes || []);
        // setSections(data.sections || []);

        const rawYears = data.academic_years || [];
        const formattedYears = rawYears.map((y: any) => typeof y === "string" ? { year: y } : y);
        setAcademicYears(formattedYears);

        setDependencyMap(data.dependency_map || []);
      }
    } catch (error) {
      // console.error("Failed to load academic master data", error);
    } finally {
      if (selectedSubjects.length === 0) {
        setIsPageLoading(false);
      }
    }
  };

  const handleAddSchool = async () => {
    if (!newSchoolName.trim()) return;

    setIsAddingSchool(true);
    const res = await ApiServices.addInstitute({
      school_name: newSchoolName.trim(),
    });

    if (res.data?.status === "success") {
      const newSchool = res.data.data;
      setSchools((prev) => [...prev, newSchool]);
      setSelectedSchool(newSchool.id);
      setNewSchoolName("");
      setShowAddSchoolInput(false);
      showToast("School added successfully", "success");
    }

    setIsAddingSchool(false);
  };

  React.useEffect(() => {
    if (!selectedPlan) return;
    const updatedPlan = plans.find(
      (plan) => plan.plan_id === selectedPlan.plan_id,
    );
    if (updatedPlan) {
      setSelectedPlan(updatedPlan);
    }
  }, [plans]);

  const fetchProfileImage = async () => {
    try {
      const response = await ApiServices.getUserProfileImage();
      if (response.data?.status === "success" && response.data?.data?.image) {
        setProfileImage(response.data.data.image);
      }
    } catch (error) {
      // console.error("Failed to fetch profile image", error);
    }
  };

  React.useEffect(() => {
    fetchAvailableSubjects();
  }, [selectedBoard, selectedClass, selectedSchool, selectedYear]);

  React.useEffect(() => {
    if (selectedBoard && selectedClass && selectedSubjects.length > 0) {
      // console.log(
      //   "Fetching plans with board:",
      //   selectedBoard,
      //   "class:",
      //   selectedClass,
      // );
      // console.log("Fetching plans with selectedSubjects:", selectedSubjects);
      fetchSubscriptionPlans();
    } else {
      setPlans(defaultPlans);
      transformData(defaultPlans);
      if (boards.length > 0) {
        setIsPageLoading(false);
      }
    }
  }, [selectedBoard, selectedClass, selectedSubjects]);

  const fetchSubscriptionPlans = async () => {
    setIsPlansLoading(true);
    try {
      const payload = {
        board_id: selectedBoard,
        class_id: selectedClass,
        academic_year: selectedYear,
        subject_ids: selectedSubjects.map((s) => s.subject_id),
      };

      const response = await ApiServices.getSubscriptionPlans(payload);

      if (response.data?.status === "success") {
        const fetchedPlans: ApiPlan[] = response.data.data;
        // console.log("Fetched Plans:", fetchedPlans);
        setPlans(fetchedPlans);
        transformData(fetchedPlans);
      }
    } catch (err) {
      // console.error("Failed to fetch plans", err);
    } finally {
      setIsPlansLoading(false);
    }
  };

  const increaseSheet = () => {
    setSheetCount((prev) => prev + 1);
  };

  const decreaseSheet = () => {
    setSheetCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const transformData = (fetchedPlans: ApiPlan[]) => {
    const allFeatureNames = Array.from(
      new Set(
        fetchedPlans.flatMap((p) => p.features.map((f) => f.feature_name)),
      ),
    );

    const transformed = allFeatureNames.map((featureName) => {
      const plansMap: Record<number, string> = {};

      fetchedPlans.forEach((plan) => {
        const feature = plan.features.find(
          (f) => f.feature_name === featureName,
        );

        if (!feature) {
          plansMap[plan.plan_id] = "false";
          return;
        }

        const { feature_type, availability } = feature;
        if (feature_type === "BOOLEAN") {
          plansMap[plan.plan_id] =
            availability === "AVAILABLE" ? "true" : "false";
          return;
        }

        if (availability === "NONE" || availability === "NOT_AVAILABLE") {
          plansMap[plan.plan_id] = "false";
          return;
        }

        if (feature_type === "CONTENT_LEVEL") {
          if (
            feature.feature_name === "Knowledge Hub (Videos & Notes)" &&
            availability === "VIDEOS"
          ) {
            plansMap[plan.plan_id] = "true";
          } else if (availability === "VIDEOS") {
            plansMap[plan.plan_id] = "Videos";
          } else if (availability === "VIDEOS_AND_NOTES") {
            plansMap[plan.plan_id] = "Videos & Notes";
          } else if (availability === "FULL_VIEW") {
            plansMap[plan.plan_id] = "true";
          }
          return;
        }

        if (feature_type === "USAGE_LIMIT") {
          if (feature.feature_name === "Assessments") {
            if (availability === "VIDEOS_AND_NOTES") {
              plansMap[plan.plan_id] = "Videos + Notes";
            } else if (
              availability === "NONE" ||
              availability === "NOT_AVAILABLE"
            ) {
              plansMap[plan.plan_id] = "false";
            } else {
              plansMap[plan.plan_id] =
                availability === "UNLIMITED" ? "Unlimited" : "Limited";
            }
            return;
          }
          plansMap[plan.plan_id] =
            availability === "UNLIMITED" ? "Unlimited" : "Limited";
          return;
        }

        if (feature_type === "ACCESS_LEVEL") {
          if (availability === "BASIC") {
            plansMap[plan.plan_id] = "Basic";
          } else if (availability === "FULL_VIEW") {
            plansMap[plan.plan_id] = "Full View";
          } else if (availability === "AVAILABLE") {
            plansMap[plan.plan_id] = "true";
          }
          return;
        }

        plansMap[plan.plan_id] = "false";
      });

      return { name: featureName, plans: plansMap };
    });

    setTransformedFeatures(transformed);
  };

  const fetchAvailableSubjects = async () => {
    if (!selectedBoard || !selectedClass || !selectedYear) return;

    setIsSubjectsLoading(true);
    try {
      const payload = {
        board_name: selectedBoard,
        class_name: selectedClass,
        institute_name: selectedSchool || null,
        academic_year: selectedYear,
      };

      const response = await ApiServices.getSubjectsByBoards(payload);

      if (response.data?.status === "success") {
        const newSubjects = response.data.data.subjects || [];
        setAvailableSubjects(newSubjects);
        setSelectedSubjects((prev) =>
          prev.filter((s) =>
            newSubjects.some((ns: Subject) => ns.subject_id === s.subject_id),
          ),
        );
      }
    } catch (err) {
      // console.error("Failed to fetch subjects", err);
    } finally {
      setIsSubjectsLoading(false);
    }
  };

  const handleRemoveSubject = (subjectId: number) => {
    const updated = selectedSubjects.filter((s) => s.subject_id !== subjectId);
    setSelectedSubjects(updated);
    localStorage.setItem("selected_subjects_payload", JSON.stringify(updated));
  };

  const handleAddSubject = (subject: Subject) => {
    if (!selectedSubjects.some((s) => s.subject_id === subject.subject_id)) {
      const updated = [...selectedSubjects, subject];
      setSelectedSubjects(updated);
      localStorage.setItem(
        "selected_subjects_payload",
        JSON.stringify(updated),
      );
    }
  };

  const handleOpenPaymentModal = async () => {
    if (!selectedPlan) {
      showToast("Please select a plan first.", "warning");
      return;
    }

    setIsValidating(true);

    try {
      const validatePayload = {
        plan_id: selectedPlan.plan_id,
        board_id: selectedBoard,
        class_id: selectedClass,
        academic_year: selectedYear,
        subject_ids: selectedSubjects.map((s) => s.subject_id),
        ui_total_amount: uiTotalAmount,
        total_licences: sheetCount,
      };

      const response = await ApiServices.validatePlanAmount(validatePayload);

      if (response.data?.status === "success") {
        setCurrentTotalAmount(uiTotalAmount);
        setShowPaymentModal(true);
      } else {
        showToast(response.data?.message || "Plan validation failed", "error");
      }
    } catch (error) {
      // console.error("Validation error", error);
      showToast("Validation failed. Please try again.", "error");
    } finally {
      setIsValidating(false);
    }
  };

  const handlePayNow = async (subscriptionName: string, couponCode: string) => {
    if (!selectedPlan) {
      showToast("Please select a plan first.", "warning");
      return;
    }

    try {
      const paymentData = {
        plan_id: selectedPlan.plan_id,
        board_id: selectedBoard,
        class_id: selectedClass,
        academic_year: selectedYear,
        subject_ids: selectedSubjects.map((s) => s.subject_id),
        institute_id: selectedSchool || null,
        subscription_id: "",
        licenses_used: licenses_used,
        subscription_name: subscriptionName,
        total_licenses: sheetCount,
        ui_total_amount: currentTotalAmount,
        coupon_code: couponCode || undefined,
        // section: selectedSection ? String(selectedSection) : null,
      };

      setShowPaymentModal(false);
      navigate("/payment", {
        state: { paymentData: paymentData, plan: selectedPlan },
      });
    } catch (error) {
      // console.error("Navigation error", error);
      showToast("Failed to navigate to payment. Please try again.", "error");
    }
  };

  const handleApplyCoupon = async (couponCode: string) => {
    if (!couponCode.trim()) {
      showToast("Please enter a coupon code.", "warning");
      return { success: false, message: "" };
    }

    try {
      const payload = {
        plan_id: selectedPlan?.plan_id,
        board_id: selectedBoard,
        class_id: selectedClass,
        academic_year: selectedYear,
        subject_ids: selectedSubjects.map((s) => s.subject_id),
        ui_total_amount: uiTotalAmount,
        total_licenses: sheetCount,
        coupon_code: couponCode,
      };

      const response = await ApiServices.validatePlanAmount(payload);

      if (response.data?.status === "success") {
        const newAmount =
          response.data?.data?.verified_amount ||
          response.data?.data?.db_amount ||
          currentTotalAmount;
        setCurrentTotalAmount(newAmount);
        showToast("Coupon applied successfully!", "success");
        return { success: true, newAmount };
      } else if (response.data?.status === "error") {
        const errorMessage = response.data?.message || "Invalid coupon code";
        showToast(errorMessage, "error");
        return { success: false, message: errorMessage };
      } else {
        showToast(response.data?.message || "Invalid coupon code", "error");
        return {
          success: false,
          message: response.data?.message || "Invalid coupon code",
        };
      }
    } catch (error) {
      // console.error("Coupon error", error);
      showToast("Failed to apply coupon. Please try again.", "error");
      return { success: false, message: "Failed to apply coupon" };
    }
  };

  const renderCell = (value?: string, textColor: string = "text-gray-500") => {
    if (!value) {
      return (
        <div className="w-5 h-5 rounded-full bg-[#C3CFD1] flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[#DE4B3B]">
            close
          </span>
        </div>
      );
    }

    if (value === "true") {
      return (
        <div className="w-5 h-5 rounded-full bg-[#333C5B] flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[#B0CB1F]">
            check
          </span>
        </div>
      );
    }

    if (value === "false") {
      return (
        <div className="w-5 h-5 rounded-full bg-[#C3CFD1] flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[#DE4B3B]">
            close
          </span>
        </div>
      );
    }
    return (
      <span className={`${textColor} font-medium text-sm capitalize`}>
        {String(value).toLowerCase().replace(/_/g, " ")}
      </span>
    );
  };

  const getDurationLabel = (plan: ApiPlan) => {
    const months = Math.round(plan.duration_days / 30);
    switch (plan.billing_cycle) {
      case "trial":
        return `${plan.duration_days / 7} Week`;
      case "quarterly":
      case "half_yearly":
        return `${months} mth`;
      case "yearly":
        return "Yrly";
      default:
        return "";
    }
  };

  const calculatePlanDisplayPrice = (plan: ApiPlan, licenses: number) => {
    if (!plan.subject_prices || selectedSubjects.length === 0) return 0;
    const subjectTotal = plan.subject_prices.reduce(
      (sum, sp) => sum + (sp.price || 0),
      0,
    );
    const discountPercent = plan.plan_discount_percent || 0;
    const afterDiscount = subjectTotal - (subjectTotal * discountPercent) / 100;
    const total = afterDiscount * licenses;
    return total;
  };

  const uiTotalAmount = React.useMemo(() => {
    if (
      !selectedPlan ||
      !selectedPlan.subject_prices ||
      selectedSubjects.length === 0
    )
      return 0;
    const subjectTotal = selectedPlan.subject_prices.reduce(
      (sum, sp) => sum + (sp.price || 0),
      0,
    );
    const discountPercent = selectedPlan.plan_discount_percent || 0;
    const afterDiscount = subjectTotal - (subjectTotal * discountPercent) / 100;
    const total = afterDiscount * sheetCount;
    return total;
  }, [selectedPlan, sheetCount]);

  const handleSave = async () => {
    if (!selectedPlan) {
      showToast("Please select a plan first.", "warning");
      return;
    }

    setIsSaving(true);

    try {
      const validatePayload = {
        plan_id: selectedPlan.plan_id,
        board_id: selectedBoard,
        class_id: selectedClass,
        academic_year: selectedYear,
        subject_ids: selectedSubjects.map((s) => s.subject_id),
        ui_total_amount: uiTotalAmount,
        total_licenses: sheetCount,
      };

      const validateResponse =
        await ApiServices.validatePlanAmount(validatePayload);

      if (validateResponse.data?.status !== "success") {
        showToast(
          validateResponse.data?.message || "Amount validation failed",
          "error",
        );
        return;
      }

      const savePayload = {
        plan_id: selectedPlan.plan_id,
        board_id: selectedBoard,
        class_id: selectedClass,
        academic_year: selectedYear,
        subject_ids: selectedSubjects.map((s) => s.subject_id),
        institute_id: selectedSchool || null,
        ui_total_amount: uiTotalAmount,
        total_licenses: sheetCount,
        licenses_used: licenses_used,
        subscription_name: "",
      };

      const saveResponse = await ApiServices.saveSubscriptionDraft(savePayload);

      if (saveResponse.data?.status === "success") {
        showToast(
          saveResponse.data?.message || "Draft saved successfully",
          "success",
        );
      } else {
        showToast(
          saveResponse.data?.message || "Failed to save draft",
          "error",
        );
      }
    } catch (error) {
      // console.error("Save error", error);
      showToast("Something went wrong.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitial = () => {
    return userName?.charAt(0).toUpperCase();
  };

  const handleSetupConfirm = (data: {
    selectedBoard: number;
    selectedSchool: number | "";
    selectedClass: number;
    selectedYear: string;
    sheetCount: number;
    selectedSubjects: Subject[];
    availableSubjects: Subject[];
    boards: Board[];
    schools: School[];
    classes: ClassItem[];
    academicYears: AcademicYear[];
  }) => {
    setSelectedBoard(data.selectedBoard);
    setSelectedSchool(data.selectedSchool);
    setSelectedClass(data.selectedClass);
    setSelectedYear(data.selectedYear);
    setSheetCount(data.sheetCount);
    setSelectedSubjects(data.selectedSubjects);
    setAvailableSubjects(data.availableSubjects);
    setBoards(data.boards);
    setSchools(data.schools);
    setClasses(data.classes);
    setAcademicYears(data.academicYears);

    const boardName =
      data.boards.find((b) => b.id === data.selectedBoard)?.name || "";
    const className =
      data.classes.find((c) => c.id === data.selectedClass)?.name || "";

    setAcademicDetails({
      board_id: data.selectedBoard,
      board_name: boardName,
      class_id: data.selectedClass,
      class_name: className,
      institute_id: data.selectedSchool || undefined,
      institute_name:
        data.schools.find((s) => s.id === data.selectedSchool)?.name || "",
      academic_year: data.selectedYear,
    });

    setShowSetupModal(false);
  };

  return (
    <div className="min-h-screen relative px-2 sm:px-4">
      {/* Setup Modal */}
      <SubscriptionSetupModal
        isOpen={showSetupModal}
        initialData={location.state?.preselectedAcademicDetails}
        onConfirm={handleSetupConfirm}
      />

      {isPageLoading && !showSetupModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 font-medium">
              Loading subscription...
            </span>
          </div>
        </div>
      )}

      {/* ─── TOP HEADER ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-6">
        {/* User Info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-100 shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                alt="User"
                className="w-full h-full object-cover"
                onError={() => setProfileImage("")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#BADA55] to-lime-500 text-white">
                <span className="text-xl sm:text-2xl font-bold">
                  {getInitial()}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-teal-600 text-xs sm:text-sm font-medium">
              Subscription
            </p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              Hi {userName} !
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full sm:flex-1 sm:max-w-full lg:max-w-[74%]">
          {/* Dropdowns + Seat Counter — all in one row */}
          {(() => {
            // Filter logic based on dependency_map
            const validDependencies = dependencyMap.filter(dep => {
              if (selectedBoard && dep.board_id !== Number(selectedBoard)) return false;
              if (selectedSchool && dep.school_id !== Number(selectedSchool)) return false;
              if (selectedClass && dep.class_id !== Number(selectedClass)) return false;
              if (selectedYear && dep.academic_year !== selectedYear) return false;
              return true;
            });

            // Extract valid options if filtered, otherwise show all
            const useFilter = selectedBoard !== "" || selectedSchool !== "" || selectedClass !== "" || selectedYear !== "";

            const validBoards = useFilter ? Array.from(new Set(validDependencies.map(d => d.board_id))) : boards.map(b => b.id);
            const validSchools = useFilter ? Array.from(new Set(validDependencies.map(d => d.school_id))) : schools.map(s => s.id);
            const validClasses = useFilter ? Array.from(new Set(validDependencies.map(d => d.class_id))) : classes.map(c => c.id);
            const validYears = useFilter ? Array.from(new Set(validDependencies.map(d => d.academic_year))) : academicYears.map(y => y.year);

            const filteredBoards = useFilter ? boards.filter(b => validBoards.includes(b.id)) : boards;
            const filteredSchools = useFilter ? schools.filter(s => validSchools.includes(s.id)) : schools;
            const filteredClasses = useFilter ? classes.filter(c => validClasses.includes(c.id)) : classes;
            const filteredYears = useFilter ? academicYears.filter(y => validYears.includes(y.year)) : academicYears;

            // Automatically clear selections if they are no longer in the valid options
            if (selectedBoard !== "" && !filteredBoards.some(b => b.id === selectedBoard)) {
              setSelectedBoard("");
            }
            if (selectedSchool !== "" && !filteredSchools.some(s => s.id === selectedSchool)) {
              setSelectedSchool("");
            }
            if (selectedClass !== "" && !filteredClasses.some(c => c.id === selectedClass)) {
              setSelectedClass("");
            }
            if (selectedYear !== "" && !filteredYears.some(y => y.year === selectedYear)) {
              setSelectedYear("");
            }

            return (
              <div className="flex flex-wrap items-end gap-2">
                {/* Board */}
                <div className="flex flex-col gap-1 group relative">
                  <label className="text-[10px] tracking-widest text-gray-400 font-semibold px-1">
                    {" "}
                    Select Board
                  </label>
                  <div className="relative w-[200px]">
                    <SearchableSelect
                      value={selectedBoard}
                      onChange={(val) => {
                        if (val === "") {
                          setSelectedBoard("");
                          setSelectedSchool("");
                          setSelectedClass("");
                          setSelectedYear("");
                          setSelectedSubjects([]);
                          setAvailableSubjects([]);
                        } else {
                          setSelectedBoard(Number(val));
                        }
                      }}
                      options={filteredBoards.map((b) => ({ value: b.id, label: b.name }))}
                      placeholder="Board"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium shadow-sm hover:border-[#BADA55] focus:outline-none focus:border-[#BADA55] focus:ring-1 focus:ring-[#BADA55]/30 transition-all"
                      dropdownClassName="min-w-[200px]"
                    />
                  </div>
                  {selectedBoard && (
                    <div className="absolute top-full left-0 mt-1 z-50 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap shadow-lg pointer-events-none">
                      {boards.find((b) => b.id === Number(selectedBoard))?.name}
                    </div>
                  )}
                </div>

                {/* School */}
                <div className="flex flex-col gap-1 group relative">
                  <label className="text-[10px] tracking-widest text-gray-400 font-semibold px-1">
                    {" "}
                    Select School
                  </label>
                  <div className="relative w-[200px]">
                    <SearchableSelect
                      value={selectedSchool}
                      onChange={(val) => {
                        if (val === "ADD_NEW") {
                          setShowAddSchoolInput(true);
                          setSelectedSchool("");
                        } else if (val === "") {
                          setSelectedBoard("");
                          setSelectedSchool("");
                          setSelectedClass("");
                          setSelectedYear("");
                          setSelectedSubjects([]);
                          setAvailableSubjects([]);
                          setShowAddSchoolInput(false);
                        } else {
                          setSelectedSchool(Number(val));
                          setShowAddSchoolInput(false);
                        }
                      }}
                      options={filteredSchools.map((s) => ({ value: s.id, label: s.name }))}
                      placeholder="School"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium shadow-sm hover:border-[#BADA55] focus:outline-none focus:border-[#BADA55] focus:ring-1 focus:ring-[#BADA55]/30 transition-all"
                      dropdownClassName="min-w-[200px]"
                    />
                  </div>
                  {selectedSchool && (
                    <div className="absolute top-full left-0 mt-1 z-50 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap shadow-lg pointer-events-none">
                      {schools.find((s) => s.id === Number(selectedSchool))?.name}
                    </div>
                  )}
                  {showAddSchoolInput && (
                    <div className="flex gap-1.5 mt-1 w-[210px]">
                      <input
                        value={newSchoolName}
                        onChange={(e) => setNewSchoolName(e.target.value)}
                        placeholder="School name"
                        className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#BADA55]"
                      />
                      <button
                        onClick={handleAddSchool}
                        disabled={isAddingSchool}
                        className="px-2.5 py-1.5 bg-[#464646] text-white rounded-xl text-xs font-medium hover:bg-[#333] transition-colors whitespace-nowrap"
                      >
                        {isAddingSchool ? "…" : "Add"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Class */}
                <div className="flex flex-col gap-1 group relative">
                  <label className="text-[10px] tracking-widest text-gray-400 font-semibold px-1">
                    {" "}
                    Select Class
                  </label>
                  <div className="relative w-[200px]">
                    <SearchableSelect
                      value={selectedClass}
                      onChange={(val) => {
                        if (val === "") {
                          setSelectedBoard("");
                          setSelectedSchool("");
                          setSelectedClass("");
                          setSelectedYear("");
                          setSelectedSubjects([]);
                          setAvailableSubjects([]);
                        } else {
                          setSelectedClass(Number(val));
                        }
                      }}
                      options={filteredClasses.map((c) => ({ value: c.id, label: c.name }))}
                      placeholder="Class"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium shadow-sm hover:border-[#BADA55] focus:outline-none focus:border-[#BADA55] focus:ring-1 focus:ring-[#BADA55]/30 transition-all"
                      dropdownClassName="min-w-[200px]"
                    />
                  </div>
                  {selectedClass && (
                    <div className="absolute top-full left-0 mt-1 z-50 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap shadow-lg pointer-events-none">
                      {classes.find((c) => c.id === Number(selectedClass))?.name}
                    </div>
                  )}
                </div>

                {/* Section */}
                {/* <div className="flex flex-col gap-1 group relative">
              <label className="text-[10px] tracking-widest text-gray-400 font-semibold px-1">
                {" "}
                Select Section
              </label>
              <div className="relative w-[200px]">
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(Number(e.target.value))}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2 pr-6 text-xs text-gray-700 font-medium shadow-sm hover:border-[#BADA55] focus:outline-none focus:border-[#BADA55] focus:ring-1 focus:ring-[#BADA55]/30 transition-all cursor-pointer truncate"
                >
                  <option value="">Section</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
                  ▾
                </span>
              </div>
              {selectedSection && (
                <div className="absolute top-full left-0 mt-1 z-50 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap shadow-lg pointer-events-none">
                  {sections.find((s) => s.id === Number(selectedSection))?.name}
                </div>
              )}
            </div> */}

                {/* Academic Year */}
                <div className="flex flex-col gap-1 group relative">
                  <label className="text-[10px] tracking-widest text-gray-400 font-semibold px-1">
                    Acad. Year
                  </label>
                  <div className="relative w-[200px]">
                    <SearchableSelect
                      value={selectedYear}
                      onChange={(val) => {
                        if (val === "") {
                          setSelectedBoard("");
                          setSelectedSchool("");
                          setSelectedClass("");
                          setSelectedYear("");
                          setSelectedSubjects([]);
                          setAvailableSubjects([]);
                        } else {
                          setSelectedYear(String(val));
                        }
                      }}
                      options={filteredYears.map((y) => ({ value: y.year, label: y.year }))}
                      placeholder="Year"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium shadow-sm hover:border-[#BADA55] focus:outline-none focus:border-[#BADA55] focus:ring-1 focus:ring-[#BADA55]/30 transition-all"
                      dropdownClassName="min-w-[200px]"
                    />
                  </div>
                  {selectedYear && (
                    <div className="absolute top-full left-0 mt-1 z-50 hidden group-hover:block bg-gray-800 text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap shadow-lg pointer-events-none">
                      {selectedYear}
                    </div>
                  )}
                </div>
                {/* Clear Selection Button */}
                {useFilter && (
                  <div className="flex flex-col gap-1 pb-[1px]">
                    <button
                      onClick={() => {
                        setSelectedBoard("");
                        setSelectedSchool("");
                        setSelectedClass("");
                        setSelectedYear("");
                        setSelectedSubjects([]);
                        setAvailableSubjects([]);
                      }}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors h-[36px]"
                      title="Clear Filters"
                    >
                      <span className="material-symbols-outlined text-[14px]">refresh</span>
                      Clear
                    </button>
                  </div>
                )}
                {/* Seat Counter — inline in same row */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] tracking-widest text-gray-400 font-semibold px-1">
                    Seats
                  </label>
                  <div
                    className={`inline-flex items-center rounded-xl border px-1 py-1 gap-1 ${isStudent ? "bg-gray-100 border-gray-200" : "bg-[#464646] border-[#464646]"}`}
                  >
                    <button
                      onClick={decreaseSheet}
                      disabled={isStudent}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold transition-colors ${isStudent ? "text-gray-400 cursor-not-allowed" : "text-white hover:bg-white/10"}`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      disabled={isStudent}
                      className={`font-semibold text-xs bg-transparent w-8 text-center outline-none border-none appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isStudent ? "text-gray-500" : "text-white"}`}
                      value={sheetCount === 0 ? "" : sheetCount}
                      onChange={(e) => {
                        if (isStudent) return;
                        const val = e.target.value;
                        if (val === "") {
                          setSheetCount(0);
                        } else {
                          const parsed = parseInt(val);
                          if (!isNaN(parsed)) setSheetCount(parsed);
                        }
                      }}
                      onBlur={() => {
                        if (sheetCount < 1) setSheetCount(1);
                      }}
                    />
                    <button
                      onClick={increaseSheet}
                      disabled={isStudent}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold transition-colors ${isStudent ? "text-gray-400 cursor-not-allowed" : "text-white hover:bg-white/10"}`}
                    >
                      +
                    </button>
                  </div>
                </div>


              </div>
            );
          })()}

          {/* Subject chips */}
          {
            (availableSubjects.length > 0 || isSubjectsLoading) && (
              <div className="flex flex-col gap-2">
                {/* <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-1">
                Subjects
                <span className="ml-2 normal-case tracking-normal font-normal text-gray-400">— tap to select / deselect</span>
              </p> */}

                {isSubjectsLoading ? (
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-4 h-4 border-2 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-400">
                      Loading subjects...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSubjects.map((subject) => {
                      const isSelected = selectedSubjects.some(
                        (s) => s.subject_id === subject.subject_id,
                      );
                      return (
                        <button
                          key={subject.subject_id}
                          onClick={() => {
                            isSelected
                              ? handleRemoveSubject(subject.subject_id)
                              : handleAddSubject(subject);
                          }}
                          className={`relative px-3 py-1.5 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border
                          ${isSelected
                              ? "bg-[#b0cb1f] text-gray-800 border-[#9ab515] shadow-sm shadow-[#b0cb1f]/40"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#b0cb1f] hover:text-gray-800"
                            }`}
                        >
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#464646] rounded-full flex items-center justify-center">
                              <span className="text-white text-[9px] leading-none font-bold">
                                ✓
                              </span>
                            </span>
                          )}
                          {subject.subject_name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )
          }
        </div>
      </div>

      {/* ─── PRICING GRID ───────────────────────────────────────── */}
      <div className="relative mt-6 sm:mt-10 min-h-[300px]">
        {isPlansLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500 font-medium">
                Loading plans...
              </span>
            </div>
          </div>
        )}

        {plans.length === 0 ? (
          <div className="text-center py-16 sm:py-20" />
        ) : (
          <>
            {/* ── DESKTOP TABLE (md+) ── */}
            <div className="hidden md:block">
              <div
                className="grid gap-x-2 lg:gap-x-4"
                style={{
                  gridTemplateColumns: `1.4fr repeat(${plans.length}, 1fr)`,
                  gridTemplateRows: `auto repeat(${transformedFeatures.length}, auto) auto`,
                }}
              >
                {/* Background pills */}
                {plans.map((plan, index) => (
                  <div
                    key={`bg-${plan.plan_id}`}
                    className={`mx-1 lg:mx-2 transition-all duration-300 cursor-pointer ${selectedPlan?.plan_id === plan.plan_id
                      ? "bg-lime-200"
                      : hoveredPlanId === plan.plan_id
                        ? "bg-lime-100"
                        : "bg-[#F7FAE9]"
                      }`}
                    style={{
                      gridColumn: index + 2,
                      gridRow: "1 / -1",
                      borderRadius: "9999px",
                      zIndex: 1,
                    }}
                  />
                ))}

                {/* Click overlay */}
                {plans.map((plan, index) => (
                  <div
                    key={`click-${plan.plan_id}`}
                    onMouseEnter={() => setHoveredPlanId(plan.plan_id)}
                    onMouseLeave={() => setHoveredPlanId(null)}
                    onClick={() => {
                      if (selectedSubjects.length > 0) {
                        setSelectedPlan((prev) =>
                          prev?.plan_id === plan.plan_id ? null : plan,
                        );
                      } else {
                        showToast(
                          "Please select a subject to view pricing and enable selection.",
                          "warning",
                        );
                      }
                    }}
                    className={
                      selectedSubjects.length > 0
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    }
                    style={{
                      gridColumn: index + 2,
                      gridRow: "1 / -1",
                      zIndex: 20,
                    }}
                  />
                ))}

                {/* Header label */}
                <div
                  className="p-4 pt-5 pl-6 lg:pl-10 relative"
                  style={{ gridColumn: 1, gridRow: 1 }}
                >
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                    Choose a Plan
                  </h2>
                  <p className="text-teal-600 text-sm">
                    That fits your learning goals
                  </p>
                </div>
                <div
                  className="border-b-2 border-gray-100 w-full h-px z-10 pointer-events-none"
                  style={{ gridColumn: "1 / -1", gridRow: 1, alignSelf: "end" }}
                />

                {/* Plan header cells */}
                {plans.map((plan, index) => (
                  <div
                    key={plan.plan_id}
                    onMouseEnter={() => setHoveredPlanId(plan.plan_id)}
                    onMouseLeave={() => setHoveredPlanId(null)}
                    onClick={() => {
                      if (selectedSubjects.length > 0) {
                        setSelectedPlan((prev) =>
                          prev?.plan_id === plan.plan_id ? null : plan,
                        );
                      } else {
                        showToast(
                          "Please select at least one subject to enable plan selection.",
                          "warning",
                        );
                      }
                    }}
                    className={`mx-1 lg:mx-2 text-center z-10 pb-3 pt-7 lg:pt-9 px-2 transition-all rounded-t-full duration-200 ${selectedSubjects.length > 0
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                      } ${selectedPlan?.plan_id === plan.plan_id
                        ? "bg-lime-200"
                        : selectedSubjects.length > 0
                          ? "hover:bg-red-100"
                          : ""
                      }`}
                    style={{ gridColumn: index + 2, gridRow: 1 }}
                  >
                    <p className="text-black text-xs lg:text-xl font-thin uppercase tracking-tight leading-none mb-2">
                      {plan.plan_name.replace(" Plan", "")} <br /> PLAN
                    </p>
                    <div className="flex flex-col justify-center items-center gap-1 lg:gap-2">
                      <div className="text-center">
                        {plan.plan_tag && (
                          <p className="text-lg lg:text-2xl font-bold text-[#5C5082] leading-tight">
                            {plan.plan_tag.split(" ")[0]}
                          </p>
                        )}
                        {plan.plan_tag &&
                          plan.plan_tag.split(" ").length > 1 && (
                            <p className="text-[#5C5082] font-semibold text-xs lg:text-sm">
                              {plan.plan_tag.split(" ").slice(1).join(" ")}
                            </p>
                          )}
                      </div>
                      <div className="text-center">
                        {plan.billing_cycle === "trial" ? (
                          <>
                            <p className="text-teal-500 text-[10px] lg:text-xs font-semibold">
                              ₹ 0 / {getDurationLabel(plan)}
                            </p>
                            <div className="text-gray-400 text-[10px] lg:text-xs">
                              (NA)
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-teal-500 text-[10px] lg:text-xs font-semibold">
                              ₹{" "}
                              {calculatePlanDisplayPrice(
                                plan,
                                sheetCount,
                              ).toFixed(2)}{" "}
                              / {getDurationLabel(plan)}
                            </p>
                            <div className="text-gray-400 text-[10px] lg:text-xs">
                              {(
                                calculatePlanDisplayPrice(plan, sheetCount) /
                                (plan.monthly_divisor || 1)
                              ).toFixed(2)}{" "}
                              / month
                              {plan.plan_discount_percent > 0 && (
                                <span className="ml-1">
                                  (Less {plan.plan_discount_percent}%)
                                </span>
                              )}
                              {plan.badge && (
                                <span className="ml-1">({plan.badge})</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Feature rows */}
                {transformedFeatures.map((feature, index) => {
                  const row = index + 2;
                  return (
                    <React.Fragment key={feature.name}>
                      <div
                        className="border-b border-gray-200 w-full h-px z-20 pointer-events-none"
                        style={{
                          gridColumn: "1 / -1",
                          gridRow: row,
                          alignSelf: "end",
                        }}
                      />
                      <div
                        className="px-3 lg:px-5 py-2 lg:py-3 text-gray-700 font-bold text-xs lg:text-sm flex items-center z-10 pointer-events-none"
                        style={{ gridColumn: 1, gridRow: row }}
                      >
                        {feature.name}
                      </div>
                      {plans.map((plan, planIndex) => (
                        <div
                          key={`${feature.name}-${plan.plan_id}`}
                          className="px-2 lg:px-4 py-2 lg:py-3 flex items-center justify-center z-10"
                          style={{ gridColumn: planIndex + 2, gridRow: row }}
                        >
                          {renderCell(
                            feature.plans[plan.plan_id],
                            plan.billing_cycle === "yearly"
                              ? "text-teal-500 font-semibold"
                              : undefined,
                          )}
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })}

                {/* Bottom spacer */}
                <div
                  className="h-4 z-[-1]"
                  style={{
                    gridColumn: "1 / -1",
                    gridRow: transformedFeatures.length + 2,
                  }}
                />
              </div>
            </div>

            {/* ── MOBILE CARDS (< md) ── */}
            <div className="block md:hidden">
              <div className="mb-4 px-1">
                <h2 className="text-lg font-bold text-gray-800">
                  Choose a Plan
                </h2>
                <p className="text-teal-600 text-sm">
                  that fits Your Learning Goals
                </p>
              </div>
              <div className="flex flex-col gap-6 pb-3">
                {plans.map((plan) => (
                  <div
                    key={plan.plan_id}
                    onClick={() => {
                      if (selectedSubjects.length > 0) {
                        setSelectedPlan((prev) =>
                          prev?.plan_id === plan.plan_id ? null : plan,
                        );
                      } else {
                        showToast(
                          "Please select at least one subject to enable plan selection.",
                          "warning",
                        );
                      }
                    }}
                    className={`w-full rounded-3xl border-2 transition-all duration-200 overflow-hidden ${selectedSubjects.length > 0
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-90"
                      } ${selectedPlan?.plan_id === plan.plan_id
                        ? "border-[#b0cb1f] bg-lime-50"
                        : "border-gray-100 bg-[#F7FAE9]"
                      }`}
                  >
                    {/* Card header */}
                    <div
                      className={`px-5 pt-5 pb-4 ${selectedPlan?.plan_id === plan.plan_id ? "bg-lime-100" : "bg-[#eef5c8]/60"}`}
                    >
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">
                        {plan.plan_name.replace(" Plan", "")} PLAN
                      </p>
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          {plan.plan_tag && (
                            <p className="text-2xl font-bold text-[#5C5082] leading-tight">
                              {plan.plan_tag.split(" ")[0]}
                            </p>
                          )}
                          {plan.plan_tag &&
                            plan.plan_tag.split(" ").length > 1 && (
                              <p className="text-[#5C5082] font-semibold text-sm">
                                {plan.plan_tag.split(" ").slice(1).join(" ")}
                              </p>
                            )}
                        </div>
                        <div className="text-right">
                          {plan.billing_cycle === "trial" ? (
                            <p className="text-teal-500 text-sm font-bold">
                              FREE
                            </p>
                          ) : (
                            <>
                              <p className="text-teal-500 text-sm font-bold">
                                ₹
                                {calculatePlanDisplayPrice(
                                  plan,
                                  sheetCount,
                                ).toFixed(0)}
                                <span className="text-xs font-normal ml-1">
                                  / {getDurationLabel(plan)}
                                </span>
                              </p>
                              <p className="text-gray-400 text-xs">
                                ₹
                                {(
                                  calculatePlanDisplayPrice(plan, sheetCount) /
                                  (plan.monthly_divisor || 1)
                                ).toFixed(0)}
                                /mo
                                {plan.plan_discount_percent > 0 && (
                                  <span className="ml-1 text-[#b0cb1f] font-semibold">
                                    {plan.plan_discount_percent}% off
                                  </span>
                                )}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedPlan?.plan_id === plan.plan_id && (
                        <div className="mt-2 inline-flex items-center gap-1 bg-[#464646] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                          <span>✓</span> Selected
                        </div>
                      )}
                    </div>

                    {/* Feature list */}
                    <div className="px-5 py-3 divide-y divide-gray-100">
                      {transformedFeatures.map((feature) => {
                        const val = feature.plans[plan.plan_id];
                        return (
                          <div
                            key={feature.name}
                            className="flex items-center justify-between py-2 gap-2"
                          >
                            <span className="text-gray-600 font-bold text-xs flex-1 leading-tight">
                              {feature.name}
                            </span>
                            <span className="shrink-0">
                              {val === "true" ? (
                                <span className="w-5 h-5 rounded-full bg-[#333C5B] flex items-center justify-center">
                                  <span className="material-symbols-outlined text-[#B0CB1F] text-xs">
                                    check
                                  </span>
                                </span>
                              ) : val === "false" || !val ? (
                                <span className="w-5 h-5 rounded-full bg-[#C3CFD1] flex items-center justify-center">
                                  <span className="material-symbols-outlined text-[#DE4B3B] text-xs">
                                    close
                                  </span>
                                </span>
                              ) : (
                                <span className="text-teal-600 text-[11px] font-semibold capitalize">
                                  {String(val).toLowerCase().replace(/_/g, " ")}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── ACTION BUTTONS ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8 px-4 sm:px-0">
        <button
          onClick={handleSave}
          disabled={isSaving || selectedSubjects.length === 0}
          className={`w-full sm:w-auto px-8 py-2.5 rounded-full font-medium transition-colors text-sm ${selectedSubjects.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-primary text-white hover:bg-gray-800"
            }`}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleOpenPaymentModal}
          disabled={isValidating || selectedSubjects.length === 0}
          className={`w-full sm:w-auto px-8 py-2.5 rounded-full font-medium transition-colors text-sm ${selectedSubjects.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : selectedPlan
              ? "bg-button-primary text-white hover:bg-[#d4e66e]"
              : "bg-primary text-white hover:bg-gray-400"
            }`}
        >
          {isValidating ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {/* Payment Summary Modal */}
      {
        selectedPlan && (
          <PaymentSummaryModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            selectedPlan={selectedPlan}
            selectedSubjects={selectedSubjects}
            sheetCount={sheetCount}
            uiTotalAmount={uiTotalAmount}
            academicDetails={academicDetails}
            onProceedToPay={handlePayNow}
            onApplyCoupon={handleApplyCoupon}
            isProcessing={isValidating}
          />
        )
      }

      {/* Chat Bot Icon */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <img src={IconChat} alt="Chat" className="w-[95px]" />
      </div>
    </div >
  );
};

export default Subscription;
