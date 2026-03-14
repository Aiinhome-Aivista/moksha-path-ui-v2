import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useAuth } from "../../../app/providers/AuthProvider";
// import { useModal } from '../../../features/auth/context/AuthContext';
import ApiServices from "../../../services/ApiServices";
import {
  Mail,
  Phone,
  Edit3,
  CheckCircle2,
  GraduationCap,
  Users,
  Lock,
  MapPin,
  PlusCircle,
  X,
} from "lucide-react";

interface Course {
  name: string;
  grade: string;
  progress: number;
}

interface ProfileFormValues {
  // Contact (email & phone always read-only)
  address: string;
  // Academic
  academic: string;
  board: string;
  school: string;
  dateOfBirth: string;
  grade: string;
  section: string;
  enrollmentDate: string;
  // Guardian
  guardianName: string;
  guardianRelation: string;
  guardianEmail: string;
  guardianPhone: string;
  // Lists
  courses: Course[];
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const StudentProfile: React.FC = () => {
  const { user, roleConfig } = useAuth();
  // const { openProfileSelection, setProfilesList } = useModal();
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  // const [isEditingGuardian, setIsEditingGuardian] = useState(false);
  // const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //for academic info
  const [academicInfo, setAcademicInfo] = useState<any>(null);

  //for basic info
  const [profileInfo, setProfileInfo] = useState<any>(null);

  // for active connections (Guardian/Student)
  const [activeConnections, setActiveConnections] = useState<any[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(false);

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

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoadingConnections(true);
        const res = await ApiServices.getActiveUserConnections();
        if (res.data?.status === "success") {
          const connections = res.data.data || [];
          setActiveConnections(connections);

          // removed formik prefilling since we're using ReadOnlyField mapping directly
        }
      } catch (error) {
        console.error("Connections fetch failed", error);
      } finally {
        setLoadingConnections(false);
      }
    };

    fetchConnections();
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

  // ── Role-based Action Button ────────────────
  const getProfileBtnProps = () => {
    const role = user?.role;
    if (role === "student")
      return { label: "Add Parent", show: true, targetRole: "parent" as const };
    if (role === "parent")
      return { label: "Add Child", show: true, targetRole: "student" as const };
    return { label: "", show: false, targetRole: null };
  };

  const profileBtn = getProfileBtnProps();

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
    guardianName: "",
    guardianRelation: "",
    guardianEmail: "",
    guardianPhone: "",
    courses: [],
  };

  // const formik = useFormik<ProfileFormValues>({
  //   initialValues,
  //   onSubmit: async () => {
  //     // values
  //     try {
  //       setIsSaving(true);
  //       // API payload — ready to send
  //       // const payload = {
  //       //     address: values.address,
  //       //     academic: values.academic,
  //       //     board: values.board,
  //       //     dateOfBirth: values.dateOfBirth,
  //       //     grade: values.grade,
  //       //     section: values.section,
  //       //     enrollmentDate: values.enrollmentDate,
  //       //     guardianName: values.guardianName,
  //       //     guardianRelation: values.guardianRelation,
  //       //     guardianEmail: values.guardianEmail,
  //       //     guardianPhone: values.guardianPhone,
  //       //     courses: values.courses,
  //       // };
  //       // TODO: await ApiServices.updateStudentProfile(payload);
  //       // console.log('[Profile] API Payload ready:', payload);
  //       setIsEditingBasic(false);
  //       setIsEditingGuardian(false);
  //     } catch {
  //       // silently fail
  //     } finally {
  //       setIsSaving(false);
  //     }
  //   },
  // });

  // ── Helpers ────────────────────────────────

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

  const isTeacher = user?.role === "teacher";
  const isParent = user?.role === "parent";

  const secondSectionConfig = {
    title: isParent ? "Child Info" : "Guardian Info",
    labels: {
      name: isParent ? "Child Name" : "Name",
      email: isParent ? "Child Email" : "Email",
      phone: isParent ? "Child Phone" : "Phone",
    },
  };

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
          {/* Action buttons */}
          <div className="relative flex gap-1.5 shrink-0">
            {profileBtn.show && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/25 hover:bg-white/35 text-primary text-xs font-semibold transition-all"
              >
                <PlusCircle size={11} />
                {profileBtn.label}
              </button>
            )}
          </div>
        </div>
        <SectionCard
          icon={<GraduationCap size={14} className="text-primary" />}
          title="Academic Information"
        >
          <div className="px-5 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              <FormField
                label="Board"
                name="board"
                // value={formik.values.board}
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
                label="Class"
                name="grade"
                value={academicInfo?.class_name || ""}
                onChange={formik.handleChange}
                isEditing={false}
              />
              <FormField
                label="Section"
                name="section"
                value={academicInfo?.section_name || ""}
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
            </div>
          </div>
        </SectionCard>
      </div>
      <div className="space-y-4">
        {/* Row 1: Contact Information + Guardian Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SectionCard
            icon={<Mail size={14} className="text-primary" />}
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
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {user?.role === "student" && (
                  <FormField
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    isEditing={isEditingBasic}
                  />
                )}
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
          {!isTeacher && (
            <SectionCard
              icon={<Users size={14} className="text-primary" />}
              title={secondSectionConfig.title}
            >
              <div className="p-4 space-y-4">
                {loadingConnections ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#b0cb1f] rounded-full animate-spin" />
                  </div>
                ) : activeConnections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                    <Users size={24} className="mb-2 opacity-20" />
                    <p className="text-xs italic">No linked {isParent ? "student" : "guardian"} found</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                    {activeConnections.map((connection: any, index: number) => (
                      <React.Fragment key={connection.link_id || connection.user_id}>
                        <div className="rounded-xl p-4 relative">
                          {/* Optional Number badge like "Child 1" / "Guardian 1" */}
                          <div className="absolute -top-1 left-4 px-2 py-0.5 bg-white text-[10px] font-bold text-primary uppercase tracking-wider border border-gray-100 rounded-full">
                            {isParent ? "Child" : "Guardian"} {index + 1}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <ReadOnlyField
                              label={secondSectionConfig.labels.name}
                              value={connection.name || ""}
                            />
                            {isParent ? (
                              <ReadOnlyField
                                label="Date of Birth"
                                value={connection.dob || "NA"}
                              />
                            ) : (
                              <ReadOnlyField
                                label="Relation"
                                value={connection.role || ""}
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <ReadOnlyField
                              label={secondSectionConfig.labels.email}
                              value={connection.email || ""}
                              icon={<Mail size={10} className="text-primary" />}
                            />
                            <ReadOnlyField
                              label={secondSectionConfig.labels.phone}
                              value={connection.phone || ""}
                              icon={<Phone size={10} className="text-primary" />}
                            />
                            {isParent && (
                              <ReadOnlyField
                                label="Address"
                                value={connection.address || ""}
                                icon={<MapPin size={10} className="text-primary" />}
                              />
                            )}
                          </div>
                        </div>
                        {/* Divider between items */}
                        {index < activeConnections.length - 1 && (
                          <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="flex-shrink-0 mx-4 bg-white text-gray-300">
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 300" }}>
                                link
                              </span>
                            </span>
                            <div className="flex-grow border-t border-gray-100"></div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
      {profileBtn.targetRole && (
        <AddProfileModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          targetRole={profileBtn.targetRole}
        />
      )}
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

const AddProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  targetRole: "parent" | "student";
}> = ({ isOpen, onClose, targetRole }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setIsSearching(true);
      setError("");
      setSearchResults([]);
      const response = await ApiServices.searchUserForMapping(searchQuery);
      if (response.data?.status === "success") {
        setSearchResults(response.data.data || []);
        if (response.data.data?.length === 0) {
          setError("No users found matching your search.");
        }
      } else {
        setError(response.data?.message || "Search failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Please select a user to map.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const payload: any = {};
      if (targetRole === "parent") {
        payload.parent_user_id = selectedUser.user_id;
      } else {
        payload.student_user_id = selectedUser.user_id;
      }

      const response = await ApiServices.addParentStudentMapping(payload);
      if (response.data?.status === "success") {
        setSuccess("Mapping request sent successfully!");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        setError(response.data?.message || "Failed to add mapping");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Add {targetRole === "parent" ? "Parent" : "Child"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Find and link your {targetRole === "parent" ? "guardian" : "child"} by searching their name, email, or phone.
        </p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                Search User
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Name, Email or Phone..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#b0cb1f] focus:ring-2 focus:ring-[#b0cb1f]/20 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="mt-5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              {isSearching ? <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : "Search"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50">
              {searchResults
                .filter((user) => {
                  const query = searchQuery.toLowerCase().trim();
                  return (
                    user.full_name?.toLowerCase().includes(query) ||
                    user.email?.toLowerCase().includes(query) ||
                    user.phone?.includes(query)
                  );
                })
                .map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-3 cursor-pointer transition-colors hover:bg-lime-50/50 ${selectedUser?.user_id === user.user_id ? "bg-lime-50 border-l-4 border-l-[#b0cb1f]" : ""}`}
                  >
                    <p className="text-sm font-bold text-gray-900">{user.full_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-[11px] text-gray-500">{user.email}</p>
                      <p className="text-[11px] text-gray-500">•</p>
                      <p className="text-[11px] text-gray-500">{user.phone}</p>
                      <span className="ml-auto px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold uppercase">{user.role_type}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          {success && <p className="text-xs text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> {success}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !selectedUser}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-[#b0cb1f] hover:bg-[#a0ba1c] rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <PlusCircle size={14} />
                  Add Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
