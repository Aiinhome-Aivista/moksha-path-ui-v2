import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "../context/AuthContext";
import { useToast } from "../../../app/providers/ToastProvider";
import ApiServices from "../../../services/ApiServices";
import { useAuth } from "../../../app/providers/AuthProvider";

const isValidIndianMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile);
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const PERSONA_COPY = {
  1: {
    sa: "अभ्यासी",
    en: "Student",
    title: "Tell us a little about your studies.",
    lede: "So we can shape a path that actually fits.",
  },
  2: {
    sa: "अभिभावक",
    en: "Parent",
    title: "Tell us a little about your child.",
    lede: "We'll tailor early alerts and conversation-starters.",
  },
  3: {
    sa: "शिक्षक",
    en: "Teacher",
    title: "Tell us about your classroom.",
    lede: "We'll map the right tools to your subjects and grades.",
  },
  4: {
    sa: "संस्था",
    en: "Institution",
    title: "Tell us about your school.",
    lede: "Our academic team will get in touch within a working day.",
  },
} as any;

const TEACHER_SUBJECTS = [
  "Math",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Social Studies",
  "Hindi",
];
const TEACHER_GRADES = ["6", "7", "8", "9", "10", "11", "12"];

export const LoginModal: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [persona, setPersona] = useState<number | null>(null);
  const [roles, setRoles] = useState<any[]>([]);

  // Profile Data
  const [profileData, setProfileData] = useState({
    fullName: "",
    // Student specific
    boardId: "" as number | "",
    classId: "" as number | "",
    // Parent specific
    childName: "",
    childClassId: "" as number | "",
    childBoardId: "" as number | "",
    // Teacher specific
    schoolName: "",
    selectedSubjects: [] as string[],
    selectedGrades: [] as string[],
    // Institution specific
    institutionName: "",
    primaryBoard: "",
    adminRole: "",
    enrollment: "",
  });

  // Contact Data
  const [contactMethod, setContactMethod] = useState<"email" | "phone">(
    "email",
  );
  const [contactValue, setContactValue] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Master Data
  const [boards, setBoards] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { fetchMenu, handleSignInSuccess } = useModal();

  // Load Initial Data
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const rolesRes = await ApiServices.getRoles();
        if (rolesRes.data?.status === "success") setRoles(rolesRes.data.data);

        const academicRes = await ApiServices.getAcademicMasterData();
        if (academicRes.data?.status === "success") {
          setBoards(academicRes.data.data.boards || []);
          setClasses(academicRes.data.data.classes || []);
        }
      } catch (err) {
        console.error("Failed to load master data", err);
      }
    };
    loadMasterData();
  }, []);

  // OTP Timer
  useEffect(() => {
    let timer: any;
    if (currentStep === 4 && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [currentStep, resendTimer]);

  const handleNextStep = () => {
    if (currentStep === 1 && !persona) return;

    // Step 2 Validation
    if (currentStep === 2) {
      if (
        persona === 1 &&
        (!profileData.fullName || !profileData.boardId || !profileData.classId)
      )
        return;
      if (persona === 2 && !profileData.fullName) return;
      if (persona === 3 && (!profileData.fullName || !profileData.schoolName))
        return;
      if (
        persona === 4 &&
        (!profileData.institutionName || !profileData.fullName)
      )
        return;
    }

    if (currentStep === 3) {
      handleSendOtp();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSendOtp = async () => {
    if (!contactValue) {
      showToast("Please enter contact details", "error");
      return;
    }
    if (contactMethod === "email" && !isValidEmail(contactValue)) {
      showToast("Invalid email address", "error");
      return;
    }
    if (
      contactMethod === "phone" &&
      !isValidIndianMobile(contactValue.replace(/\s/g, ""))
    ) {
      showToast("Invalid mobile number", "error");
      return;
    }
    if (!agreedToTerms) {
      showToast("Please agree to terms", "error");
      return;
    }

    try {
      setIsSendingOtp(true);
      const res = await ApiServices.sendOtpV4({
        auth_identifier: contactValue,
        [contactMethod === "email" ? "email" : "mobile"]: contactValue,
      });

      if (res.data?.status === "success") {
        showToast("OTP sent successfully", "success");
        setCurrentStep(4);
        setResendTimer(60);
        setCanResend(false);
      } else {
        showToast(res.data?.message || "Failed to send code", "error");
      }
    } catch (err) {
      showToast("Failed to send code", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndFinish = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Enter 6-digit code");
      return;
    }

    try {
      setIsVerifying(true);
      setOtpError("");
      const verifyRes = await ApiServices.verifyAccountV4({
        auth_identifier: contactValue,
        otp: otpValue,
      });

      if (verifyRes.data?.status === "success") {
        const { auth_token, refresh_token, subscription_token } =
          verifyRes.data.data;
        if (auth_token) localStorage.setItem("auth_token", auth_token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
        if (subscription_token)
          localStorage.setItem("subscription_token", subscription_token);

        // Profile Add Logic (simplified to role-based)
        const profilePayload: any = {
          actual_name: profileData.fullName,
          profile_name: "Primary",
          role_id: persona,
        };

        if (persona === 1) {
          profilePayload.board_id = profileData.boardId;
          profilePayload.class_id = profileData.classId;
        }

        const profileRes = await ApiServices.addProfileV4(profilePayload);

        if (profileRes.data?.status === "success") {
          showToast("Registration successful!", "success");
          await fetchMenu();
          const userData = profileRes.data.data.user;
          login({
            id: userData.sub,
            name: userData.name || profileData.fullName,
            email: contactValue,
            role: roles
              .find((r) => r.role_id === persona)
              ?.role_name.toLowerCase(),
          });

          handleSignInSuccess();
          navigate("/dashboard");
        } else {
          showToast("Account created, but profile setup failed.", "warning");
          navigate("/signin");
        }
      } else {
        setOtpError(verifyRes.data?.message || "Invalid OTP");
      }
    } catch (err) {
      setOtpError("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const toggleChip = (list: string[], item: string) => {
    return list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
  };

  return (
    <div className="auth-body">
      <header className="site-header">
        <div className="wrap">
          <Link to="/" className="brand">
            <img src="/logogod.svg" alt="" className="brand-mark" />
            <div>
              <div className="name">
                MokshPath{" "}
                <span style={{ color: "var(--saffron)" }}>Academia</span>
              </div>
              <div className="tag">
                सत्यं ज्ञानं · a guided path to true learning
              </div>
            </div>
          </Link>
          <nav className="nav">
            <Link to="/#personas">Who it's for</Link>
            <Link to="/#faq">FAQ</Link>
            <Link to="/#pricing">Pricing</Link>
            <Link to="/signin" className="btn btn-ghost">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="wizard-main">
        <img
          className="auth-mandala"
          src="/assets/mandala.svg"
          alt=""
          aria-hidden="true"
        />

        <div className="wizard">
          <div className="wizard__progress">
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`wp-step ${s === currentStep ? "is-active" : s < currentStep ? "is-done" : ""}`}
              />
            ))}
          </div>
          <div className="wizard__counter">
            {currentStep} <span className="wc-sep">of</span> 4
          </div>

          <form className="wizard__form" onSubmit={(e) => e.preventDefault()}>
            <section
              className={`w-step ${currentStep === 1 ? "is-active" : ""}`}
            >
              {currentStep === 1 && (
                <>
                  <div className="w-step__eyebrow">
                    <span className="accent-sanskrit">नमस्ते</span>
                    <span className="wse-en">Let's begin</span>
                  </div>
                  <h1 className="w-step__title">
                    Who walks this path with us?
                  </h1>
                  <p className="w-step__lede">
                    Pick the role that describes you best today. You can always
                    invite others later.
                  </p>

                  <div className="persona-cards">
                    {roles
                      .filter((r) => [1, 2, 3, 4].includes(r.role_id))
                      .map((role) => (
                        <button
                          key={role.role_id}
                          type="button"
                          className={`persona-card ${persona === role.role_id ? "is-selected" : ""}`}
                          onClick={() => setPersona(role.role_id)}
                        >
                          <span className="pc-ico">
                            {role.role_id === 1 && (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                              >
                                <path d="M3 8l9-4 9 4-9 4-9-4z" />
                                <path d="M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5" />
                              </svg>
                            )}
                            {role.role_id === 2 && (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                              >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                            )}
                            {role.role_id === 3 && (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                              >
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="13"
                                  rx="2"
                                />
                                <path d="M8 21h8M12 17v4" />
                                <path d="M7 9h6M7 13h10" />
                              </svg>
                            )}
                            {role.role_id === 4 && (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                              >
                                <path d="M3 21h18M5 21V9l7-5 7 5v12" />
                                <path d="M9 21v-6h6v6" />
                              </svg>
                            )}
                          </span>
                          <span className="pc-name">{role.role_name}</span>
                          <span className="pc-sub">
                            {role.role_id === 1
                              ? "I'm learning — in Class 6 to 12"
                              : role.role_id === 2
                                ? "Supporting a learner at home"
                                : role.role_id === 3
                                  ? "Teaching a class, running diagnostics"
                                  : "School, chain, or academic body"}
                          </span>
                        </button>
                      ))}
                  </div>
                  <div className="w-step__actions">
                    <Link to="/signin" className="w-link">
                      Already have an account? Sign in
                    </Link>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextStep}
                      disabled={!persona}
                    >
                      Continue →
                    </button>
                  </div>
                </>
              )}
            </section>

            <section
              className={`w-step ${currentStep === 2 ? "is-active" : ""}`}
            >
              {currentStep === 2 && persona && (
                <>
                  <div className="w-step__eyebrow">
                    <span className="accent-sanskrit">
                      {PERSONA_COPY[persona].sa}
                    </span>
                    <span className="wse-en">{PERSONA_COPY[persona].en}</span>
                  </div>
                  <h1 className="w-step__title">
                    {PERSONA_COPY[persona].title}
                  </h1>
                  <p className="w-step__lede">{PERSONA_COPY[persona].lede}</p>

                  <div className="profile-fields">
                    {persona === 1 && (
                      <>
                        <label className="auth-field">
                          <span className="auth-field__label">Your name</span>
                          <input
                            type="text"
                            className="auth-field__input"
                            placeholder="e.g. Aarav Mehta"
                            value={profileData.fullName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                fullName: e.target.value,
                              })
                            }
                          />
                        </label>
                        <div className="auth-row">
                          <label className="auth-field">
                            <span className="auth-field__label">Class</span>
                            <select
                              className="auth-field__input"
                              value={profileData.classId}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  classId: Number(e.target.value),
                                })
                              }
                            >
                              <option value="">Select your class…</option>
                              {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="auth-field">
                            <span className="auth-field__label">Board</span>
                            <select
                              className="auth-field__input"
                              value={profileData.boardId}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  boardId: Number(e.target.value),
                                })
                              }
                            >
                              <option value="">Select your board…</option>
                              {boards.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </>
                    )}

                    {persona === 2 && (
                      <>
                        <label className="auth-field">
                          <span className="auth-field__label">Your name</span>
                          <input
                            type="text"
                            className="auth-field__input"
                            placeholder="e.g. Priya Mehta"
                            value={profileData.fullName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                fullName: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="auth-field">
                          <span className="auth-field__label">
                            Your child's name{" "}
                            <span className="muted">(optional)</span>
                          </span>
                          <input
                            type="text"
                            className="auth-field__input"
                            placeholder="e.g. Aarav"
                            value={profileData.childName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                childName: e.target.value,
                              })
                            }
                          />
                        </label>
                        <div className="auth-row">
                          <label className="auth-field">
                            <span className="auth-field__label">
                              Child's class
                            </span>
                            <select
                              className="auth-field__input"
                              value={profileData.childClassId}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  childClassId: Number(e.target.value),
                                })
                              }
                            >
                              <option value="">Select…</option>
                              {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="auth-field">
                            <span className="auth-field__label">
                              Child's board
                            </span>
                            <select
                              className="auth-field__input"
                              value={profileData.childBoardId}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  childBoardId: Number(e.target.value),
                                })
                              }
                            >
                              <option value="">Select…</option>
                              {boards.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </>
                    )}

                    {persona === 3 && (
                      <>
                        <label className="auth-field">
                          <span className="auth-field__label">Your name</span>
                          <input
                            type="text"
                            className="auth-field__input"
                            placeholder="e.g. Anjali Sharma"
                            value={profileData.fullName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                fullName: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="auth-field">
                          <span className="auth-field__label">School name</span>
                          <input
                            type="text"
                            className="auth-field__input"
                            placeholder="e.g. DAV Public School, Pune"
                            value={profileData.schoolName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                schoolName: e.target.value,
                              })
                            }
                          />
                        </label>
                        <div className="auth-field">
                          <span className="auth-field__label">
                            Subjects you teach
                          </span>
                          <div className="chip-select">
                            {TEACHER_SUBJECTS.map((s) => (
                              <label
                                key={s}
                                className={`chip ${profileData.selectedSubjects.includes(s) ? "is-active" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={profileData.selectedSubjects.includes(
                                    s,
                                  )}
                                  onChange={() =>
                                    setProfileData({
                                      ...profileData,
                                      selectedSubjects: toggleChip(
                                        profileData.selectedSubjects,
                                        s,
                                      ),
                                    })
                                  }
                                />
                                {s}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="auth-field">
                          <span className="auth-field__label">
                            Grades you teach
                          </span>
                          <div className="chip-select">
                            {TEACHER_GRADES.map((g) => (
                              <label
                                key={g}
                                className={`chip ${profileData.selectedGrades.includes(g) ? "is-active" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={profileData.selectedGrades.includes(
                                    g,
                                  )}
                                  onChange={() =>
                                    setProfileData({
                                      ...profileData,
                                      selectedGrades: toggleChip(
                                        profileData.selectedGrades,
                                        g,
                                      ),
                                    })
                                  }
                                />
                                {g}
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {persona === 4 && (
                      <>
                        <label className="auth-field">
                          <span className="auth-field__label">
                            School or organisation name
                          </span>
                          <input
                            type="text"
                            className="auth-field__input"
                            placeholder="e.g. DAV Public School, Pune"
                            value={profileData.institutionName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                institutionName: e.target.value,
                              })
                            }
                          />
                        </label>
                        <div className="auth-row">
                          <label className="auth-field">
                            <span className="auth-field__label">
                              Primary board
                            </span>
                            <select
                              className="auth-field__input"
                              value={profileData.primaryBoard}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  primaryBoard: e.target.value,
                                })
                              }
                            >
                              <option value="">Select…</option>
                              {boards.map((b) => (
                                <option key={b.id} value={b.name}>
                                  {b.name}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="auth-field">
                            <span className="auth-field__label">Your role</span>
                            <select
                              className="auth-field__input"
                              value={profileData.adminRole}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  adminRole: e.target.value,
                                })
                              }
                            >
                              <option value="">Select…</option>
                              <option>Principal</option>
                              <option>Vice-Principal</option>
                              <option>Academic Head</option>
                              <option>Administrator</option>
                            </select>
                          </label>
                        </div>
                        <div className="auth-row">
                          <label className="auth-field">
                            <span className="auth-field__label">
                              Approximate students enrolled
                            </span>
                            <select
                              className="auth-field__input"
                              value={profileData.enrollment}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  enrollment: e.target.value,
                                })
                              }
                            >
                              <option value="">Select…</option>
                              <option>&lt; 250</option>
                              <option>250–500</option>
                              <option>500–1,000</option>
                              <option>1,000+</option>
                            </select>
                          </label>
                          <label className="auth-field">
                            <span className="auth-field__label">Your name</span>
                            <input
                              type="text"
                              className="auth-field__input"
                              placeholder="e.g. Dr. Meera Ranganathan"
                              value={profileData.fullName}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  fullName: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="w-step__actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleBackStep}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextStep}
                    >
                      Continue →
                    </button>
                  </div>
                </>
              )}
            </section>

            <section
              className={`w-step ${currentStep === 3 ? "is-active" : ""}`}
            >
              {currentStep === 3 && (
                <>
                  <div className="w-step__eyebrow">
                    <span className="accent-sanskrit">संपर्क</span>
                    <span className="wse-en">Contact</span>
                  </div>
                  <h1 className="w-step__title">How should we reach you?</h1>
                  <p className="w-step__lede">
                    We'll send a one-time code to verify it's really you. No
                    passwords, no spam.
                  </p>

                  <button
                    type="button"
                    className="btn btn-auth-google btn-block"
                  >
                    <span className="google-g" aria-hidden="true">
                      <svg viewBox="0 0 48 48" width="20" height="20">
                        <path
                          fill="#4285F4"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#34A853"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#EA4335"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                      </svg>
                    </span>
                    Continue with Google
                  </button>

                  <div className="auth-divider">
                    <span>or use email / phone</span>
                  </div>

                  <div className="auth-toggle">
                    <button
                      type="button"
                      className={`auth-toggle__btn ${contactMethod === "email" ? "is-active" : ""}`}
                      onClick={() => setContactMethod("email")}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      className={`auth-toggle__btn ${contactMethod === "phone" ? "is-active" : ""}`}
                      onClick={() => setContactMethod("phone")}
                    >
                      Phone
                    </button>
                  </div>

                  <label className="auth-field">
                    <span className="auth-field__label">
                      {contactMethod === "email" ? "Email address" : "Phone"}
                    </span>
                    <div
                      className={
                        contactMethod === "phone" ? "auth-field__phone" : ""
                      }
                    >
                      {contactMethod === "phone" && (
                        <span className="auth-field__cc">+91</span>
                      )}
                      <input
                        type={contactMethod === "email" ? "email" : "tel"}
                        className="auth-field__input"
                        placeholder={
                          contactMethod === "email"
                            ? "you@school.edu"
                            : "98765 43210"
                        }
                        value={contactValue}
                        onChange={(e) => setContactValue(e.target.value)}
                      />
                    </div>
                  </label>

                  <label className="auth-checkbox">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span>
                      I agree to the <Link to="#">terms</Link> and{" "}
                      <Link to="#">data policy</Link>. Student data stays
                      anonymised.
                    </span>
                  </label>

                  <div className="w-step__actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleBackStep}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextStep}
                      disabled={isSendingOtp || !agreedToTerms || !contactValue}
                    >
                      {isSendingOtp ? "Sending..." : "Send code →"}
                    </button>
                  </div>
                </>
              )}
            </section>

            <section
              className={`w-step ${currentStep === 4 ? "is-active" : ""}`}
            >
              {currentStep === 4 && (
                <>
                  <div className="w-step__eyebrow">
                    <span className="accent-sanskrit">स्वागतम्</span>
                    <span className="wse-en">Welcome</span>
                  </div>
                  <h1 className="w-step__title">
                    Verify and step onto your path.
                  </h1>
                  <p className="w-step__lede">
                    We sent a 6-digit code to <strong>{contactValue}.</strong>{" "}
                    Enter it here — you can change contact method if needed.
                  </p>

                  <div className="otp-boxes">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        maxLength={1}
                        className="otp-box"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Backspace" &&
                          !digit &&
                          index > 0 &&
                          otpRefs.current[index - 1]?.focus()
                        }
                      />
                    ))}
                  </div>

                  <div className="otp-resend">
                    Didn't get it?{" "}
                    {canResend ? (
                      <button
                        type="button"
                        className="link-btn"
                        onClick={handleSendOtp}
                      >
                        Resend code
                      </button>
                    ) : (
                      <span>Resend in {resendTimer}s</span>
                    )}
                    {" or "}{" "}
                    <button
                      type="button"
                      className="link-btn"
                      onClick={handleBackStep}
                    >
                      change method
                    </button>
                    .
                  </div>

                  {otpError && <p className="auth-error">{otpError}</p>}

                  <div className="w-step__actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleBackStep}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleVerifyAndFinish}
                      disabled={isVerifying || otp.join("").length !== 6}
                    >
                      {isVerifying ? "Verifying..." : "Begin my path →"}
                    </button>
                  </div>

                  <div className="w-step__reassure">
                    🔒 We never share your data. You can delete your account any
                    time from settings.
                  </div>
                </>
              )}
            </section>
          </form>
        </div>
      </main>

      <footer className="auth-footer">
        <div className="wrap">
          <div>© 2026 MokshPath Academia</div>
          <div>
            <Link to="#">Privacy</Link> · <Link to="#">Terms</Link> ·{" "}
            <Link to="#">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Login: React.FC = () => <LoginModal />;
export default Login;
