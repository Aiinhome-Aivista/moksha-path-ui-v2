import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useAuth } from "../../../app/providers/AuthProvider";
// import { useModal } from '../../../features/auth/context/AuthContext';
import ApiServices from "../../../services/ApiServices";
import ManageFacultyModal from "../components/ManageFacultyModal";
import {
  Mail,
  Phone,
  Edit3,
  CheckCircle2,
  GraduationCap,
  Lock,
  MapPin,
  X,
} from "lucide-react";

interface Course {
  name: string;
  grade: string;
  progress: number;
}

interface ProfileFormValues {
  address: string;
  academic: string;
  board: string;
  school: string;
  dateOfBirth: string;
  grade: string;
  section: string;
  enrollmentDate: string;
  courses: Course[];
}

const InstituteAdminProfile: React.FC = () => {
  const { user, roleConfig } = useAuth();
  // const { openProfileSelection, setProfilesList } = useModal();
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  // const [isEditingGuardian, setIsEditingGuardian] = useState(false);
  // const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);

  // faculty inline tabs
  const [facultyTab, setFacultyTab] = useState<"assigned" | "available">("assigned");
  const [assignedTeachers, setAssignedTeachers] = useState<any[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);
  const [facultyLoading, setFacultyLoading] = useState(false);

  //for academic info
  const [academicInfo, setAcademicInfo] = useState<any>(null);

  //for basic info
  const [profileInfo, setProfileInfo] = useState<any>(null);

  // ── Fetch faculty lists ─────────────────────────────────────
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setFacultyLoading(true);
        const [assignedRes, availableRes] = await Promise.all([
          ApiServices.getAssignedTeacherList(),
          ApiServices.getAvailableTeachers(),
        ]);
        if (assignedRes.data?.status === "success") setAssignedTeachers(assignedRes.data.data || []);
        if (availableRes.data?.status === "success") setAvailableTeachers(availableRes.data.data || []);
      } catch {
        // silently fail
      } finally {
        setFacultyLoading(false);
      }
    };
    fetchFaculty();
  }, [isFacultyModalOpen]); // refresh when modal closes

  // ── Profile image ──────────────────────────
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await ApiServices.getUserProfileImage();
        if (response.data?.status === "success" && response.data?.data?.image) {
          setProfileImage(response.data.data.image);
        }
      } catch {
        // silently fail
      }
    };
    fetchProfileImage();
  }, []);


  useEffect(() => {
    const fetchAcademicInfo = async () => {
      try {
        const res = await ApiServices.getUserAcademicInfo();

        if (res.data?.status === "success") {
          setAcademicInfo(res.data.data);
        }
      } catch (error) {
        console.error("Academic info fetch failed");
      }
    };

    fetchAcademicInfo();
  }, []);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const res = await ApiServices.getProfileInfo();

        if (res.data?.status === "success") {
          const data = res.data.data;

          setProfileInfo(data);

          // Fill form values
          formik.setValues({
            ...formik.values,
            address: data.address || "",
            dateOfBirth: data.dob || "",
          });
        }
      } catch (error) {
        console.error("Profile fetch failed");
      }
    };

    fetchProfileInfo();
  }, []);



  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
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



  // ── Formik ─────────────────────────────────
  const initialValues: ProfileFormValues = {
    address: "",
    academic: "",
    board: "",
    school: "",
    dateOfBirth: "",
    grade: "",
    section: "",
    enrollmentDate: "",
    courses: [],
  };

  const formik = useFormik<ProfileFormValues>({
    initialValues,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);

        const payload = {
          dob: values.dateOfBirth ? values.dateOfBirth : null,
          address: values.address,
        };

        const response = await ApiServices.updateUserProfile(payload);

        if (response.data?.status === "success") {
          setIsEditingBasic(false);
        }

      } catch (error) {
        console.error("Profile update failed", error);
      } finally {
        setIsSaving(false);
      }
    },
  });

  const handleSave = () => formik.submitForm();

  const handleCancel = (section: "basic" | "guardian") => {
    formik.resetForm();
    if (section === 'basic') setIsEditingBasic(false);
    // if (section === 'guardian') setIsEditingGuardian(false);
  };

  const EditButtons = ({
    isEditing,
    onEdit,
    onCancel,
    onSave,
    isSaving
  }: {
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    isSaving?: boolean;
  }) => (
    <div className="flex gap-1.5">
      {isEditing ? (
        <>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold transition-all"
          >
            <X size={11} />
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all bg-[#b0cb1f] text-white hover:bg-[#a0ba1c] disabled:opacity-60"
            onClick={onSave}
          >
            {isSaving ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle2 size={11} />
            )}
            Save
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
        >
          <Edit3 size={11} />
          Edit
        </button>
      )}
    </div>
  );
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
          <div
            className="relative group shrink-0 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/50 shadow-md select-none">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => setProfileImage("")}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xl font-black text-white"
                  style={{ background: "rgba(255,255,255,0.25)" }}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <button
              type="button"
              disabled={uploading}
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow border border-gray-200 group-hover:scale-110 transition-transform"
              title="Change profile picture"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              {uploading ? (
                <div className="w-3 h-3 border-2 border-gray-300 border-t-[#b0cb1f] rounded-full animate-spin" />
              ) : (
                <span
                  style={{ fontVariationSettings: "'wght' 600, 'opsz' 20" }}
                  className="material-symbols-outlined text-gray-600 text-[11px]"
                >
                  photo_camera
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Upload profile picture"
              disabled={uploading}
            />
          </div>
          <div className="relative flex-1 min-w-0">
            <h1 className="text-lg font-bold text-primary leading-none">
              {user?.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-primary font-medium opacity-90 capitalize">
                {roleConfig?.label}
              </span>
              <span className="text-primary/30 text-[10px]">•</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-primary border border-white/30">
                Active
              </span>
            </div>
          </div>

        {/* ── Action buttons in header ── */}
        <div className="relative flex gap-1.5 shrink-0 pr-2">
          <button
            type="button"
            onClick={() => setIsFacultyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/25 hover:bg-white/40 text-primary text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
            Manage Faculty
          </button>
        </div>

        </div>
        <SectionCard
          icon={<GraduationCap size={14} className="text-primary" />}
          title="Basic Information"
          action={
            <EditButtons
              isEditing={isEditingBasic}
              onEdit={() => setIsEditingBasic(true)}
              onCancel={() => handleCancel('basic')}
              onSave={handleSave}
              isSaving={isSaving}
            />
          }
        >
          <div className="px-5 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              <FormField
                label="Board"
                name="board"
                value={academicInfo?.board_name || ""}
                onChange={formik.handleChange}
                isEditing={false}
              />
              <FormField
                label="School"
                name="school"
                value={academicInfo?.institute_name || ""}
                onChange={formik.handleChange}
                isEditing={false}
              />
              <FormField
                label="Academic Year"
                name="academic"
                value={academicInfo?.academic_year || ""}
                onChange={formik.handleChange}
                isEditing={false}
              />
              <FormField
                label="Enrollment"
                name="enrollmentDate"
                value={academicInfo?.enrollment_date || ""}
                onChange={formik.handleChange}
                isEditing={false}
              />
               <ReadOnlyField
                label="Email Address"
                value={profileInfo?.email || ""}
                icon={<Mail size={10} className="text-primary" />}
              />
              <ReadOnlyField
                label="Mobile Number"
                value={profileInfo?.mobile || ""}
                icon={<Phone size={10} className="text-primary" />}
              />
              <FormField
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                isEditing={isEditingBasic}
                icon={<MapPin size={10} className="text-primary" />}
              />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── Faculty Inline Section ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            <h3 className="text-sm font-bold text-primary">Faculty</h3>
          </div>
          {/* <button
            type="button"
            onClick={() => setIsFacultyModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-[#b0cb1f] text-gray-800 hover:bg-lime-400 transition-all"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
            Manage Faculty
          </button> */}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-50 mx-5 mt-4 p-1 rounded-xl">
          {(["assigned", "available"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFacultyTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${
                facultyTab === tab
                  ? "bg-[#b0cb1f] text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "assigned" ? `Assigned Faculty (${assignedTeachers.length})` : `Available Teachers (${availableTeachers.length})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-5 py-4">
          {facultyLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-[#b0cb1f] rounded-full animate-spin" />
              <span className="text-xs">Loading…</span>
            </div>
          ) : facultyTab === "assigned" ? (
            assignedTeachers.length === 0 ? (
              <p className="text-xs text-center text-gray-400 italic py-6">No teachers assigned yet.</p>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {assignedTeachers.map((t: any) => (
                  <div key={t.teacher_user_id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {(t.name || "T").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{t.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{t.email}</p>
                    </div>
                    <p className="text-[11px] text-gray-400">{t.mobile}</p>
                    {t.section_names?.length > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-700">
                        {t.section_names.join(", ")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            availableTeachers.length === 0 ? (
              <p className="text-xs text-center text-gray-400 italic py-6">No available teachers found.</p>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {availableTeachers.map((t: any) => (
                  <div key={t.teacher_user_id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {(t.name || "T").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{t.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{t.email}</p>
                    </div>
                    <p className="text-[11px] text-gray-400">{t.mobile}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Manage Faculty Modal */}
      <ManageFacultyModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
      />
    </form>
  );
};

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
        <p
          className={`text-xs font-medium text-primary ${highlight ? "text-base font-bold text-[#6b7a0e]" : ""}`}
        >
          {value || <span className="text-gray-300 italic">—</span>}
        </p>
      </div>
    )}
  </div>
);

const ReadOnlyField: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div>
    <label className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
      {label}
      <Lock size={8} className="text-gray-300" />
    </label>
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
      {icon && <span className="shrink-0">{icon}</span>}
      <p className="text-xs font-medium text-primary truncate">{value}</p>
    </div>
  </div>
);

export default InstituteAdminProfile;
