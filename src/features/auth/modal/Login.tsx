import React, { useState, useRef, useEffect } from "react";
import { useModal } from "../context/AuthContext";
import { useToast } from "../../../app/providers/ToastProvider";
// import { useNavigate } from "react-router-dom";
import ApiServices from "../../../services/ApiServices";

export const LoginModal: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [verifyingType, setVerifyingType] = useState<"email" | "mobile" | null>(
    null,
  );
  const [registerError, setRegisterError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  // OTP Timer Logic
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: any;
    if (showOtp && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [showOtp, resendTimer]);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { showToast } = useToast();
  const {
    isLoginOpen,
    closeLogin,
    openSelectRole,
    initialAuthIdentifier,
    isNewUser,
    setIsNewUser,
    setInitialAuthIdentifier,
    decodeUserToken,
    openProfileSelection,
    setProfilesList,
  } = useModal();
  // const navigate = useNavigate();

  useEffect(() => {
    if (isLoginOpen && initialAuthIdentifier) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(initialAuthIdentifier)) {
        setFormData((prev) => ({ ...prev, email: initialAuthIdentifier }));
      } else if (/^\d{10}$/.test(initialAuthIdentifier)) {
        setFormData((prev) => ({ ...prev, mobile: initialAuthIdentifier }));
      }
    }
  }, [isLoginOpen, initialAuthIdentifier]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, ""); // remove non-digits
      setFormData({
        ...formData,
        mobile: numericValue.slice(0, 10), // limit to 10 digits
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isLoginOpen) {
      const scrollY = window.scrollY;
      document.body.style.setProperty("position", "fixed", "important");
      document.body.style.setProperty("top", `-${scrollY}px`, "important");
      document.body.style.setProperty("width", "100%", "important");
      document.body.style.setProperty("overflow", "hidden", "important");
    }

    return () => {
      if (isLoginOpen) {
        const scrollY = document.body.style.top;
        document.body.style.removeProperty("position");
        document.body.style.removeProperty("top");
        document.body.style.removeProperty("width");
        document.body.style.removeProperty("overflow");
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    };
  }, [isLoginOpen]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last digit
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto verify when 6 digits are reached
    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        setTimeout(() => {
          handleConfirmOtp(fullOtp);
        }, 100);
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Static API replacements
  const handleVerifyEmail = async () => {
    if (!formData.email) {
      showToast("Please enter email first", "error");
      return;
    }

    try {
      setOtpError("");
      const res = await ApiServices.sendOtpV4({
        auth_identifier: formData.email,
        email: formData.email,
        mobile: formData.mobile,
      });

      if (res.data?.status === "success") {
        setVerifyingType("email");
        setShowOtp(true);
        setResendTimer(60);
        setCanResend(false);
        showToast("OTP sent to your email", "success");
      } else {
        showToast(res.data?.message || "Failed to send code", "error");
        setIsSigningUp(false);
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Something went wrong",
        "error",
      );
      setIsSigningUp(false);
    }
  };

  const handleVerifyMobile = async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      showToast("Please enter valid 10-digit mobile first", "error");
      return;
    }

    try {
      setOtpError("");
      const res = await ApiServices.sendOtpV4({
        auth_identifier: formData.mobile,
        email: formData.email,
        mobile: formData.mobile,
      });

      if (res.data?.status === "success") {
        setVerifyingType("mobile");
        setShowOtp(true);
        setResendTimer(60);
        setCanResend(false);
        showToast("OTP sent to your mobile", "success");
      } else {
        showToast(res.data?.message || "Failed to send code", "error");
        setIsSigningUp(false);
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Something went wrong",
        "error",
      );
      setIsSigningUp(false);
    }
  };

  const handleSendRegistrationOtp = async () => {
    if (!formData.email && !formData.mobile) {
      showToast("Please enter email or mobile number", "error");
      setIsSigningUp(false);
      return;
    }

    try {
      setOtpError("");
      const identifier = formData.email || formData.mobile;
      const res = await ApiServices.sendOtpV4({
        auth_identifier: identifier,
        email: formData.email,
        mobile: formData.mobile,
      });

      if (res.data?.status === "success") {
        setVerifyingType(formData.email ? "email" : "mobile");
        setShowOtp(true);
        setResendTimer(60);
        setCanResend(false);
        showToast("OTP sent to your email and mobile", "success");
      } else {
        showToast(res.data?.message || "Failed to send code", "error");
        setIsSigningUp(false);
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Something went wrong",
        "error",
      );
      setIsSigningUp(false);
    }
  };

  const handleConfirmOtp = async (forcedOtp?: string) => {
    const otpValue = forcedOtp || otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Please enter complete 6-digit OTP");
      return;
    }

    const identifier =
      verifyingType === "email" ? formData.email : formData.mobile;

    try {
      setRegisterError(""); // Clear any previous register error
      const res = await ApiServices.verifyAccountV4({
        auth_identifier: identifier,
        otp: otpValue,
        email: formData.email,
        mobile: formData.mobile,
      });

      if (res.data?.status === "success") {
        const { token, refresh_token } = res.data.data;

        localStorage.setItem("auth_token", token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

        setOtpError("");
        // if (verifyingType === "email") {
        //   setEmailVerified(true);
        // } else {
        //   setMobileVerified(true);
        // }
        setShowOtp(false);
        setVerifyingType(null);
        setIsSigningUp(false); // Reset signing up state

        showToast(
          `${verifyingType === "email" ? "Email" : "Mobile"} verified successfully`,
          "success",
        );

        // Refresh context data
        // await decodeUserToken();
        // // Always fetch menu - will handle gracefully if empty

        // // Check if profile setup is incomplete (no user data AND no subscription)
        // if (res.data?.data?.subscription_id === null && !res.data?.data?.user) {
        //   closeLogin();
        //   openSelectRole();
        // } else if (res.data?.data?.subscription_id === null) {
        //   // User has profile but no subscription
        //   closeLogin();
        //   navigate("/subscription", { replace: true });
        // } else {
        //   // User has complete profile with active subscription
        //   closeLogin();
        //   navigate("/dashboard", { replace: true });
        // }
        await decodeUserToken();

        const profileRes = await ApiServices.getUsersByTokenContact();

        const profiles = profileRes?.data?.data ?? [];

        // filter valid profiles (profile created)
        const validProfiles = profiles.filter(
          (p: any) => p.username !== null && p.role_id !== null,
        );

        if (validProfiles.length > 0) {
          // profile exists
          setProfilesList(validProfiles);
          closeLogin();
          openProfileSelection();
        } else {
          // no profile → complete profile
          closeLogin();
          openSelectRole();
        }
      } else {
        setOtpError(res.data?.message || "Failed Verification");
        setIsSigningUp(false);
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Invalid OTP");
      setIsSigningUp(false);
    }
  };

  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setResendTimer(60);
    setCanResend(false);
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 0);
    if (isNewUser) handleSendRegistrationOtp();
    else if (verifyingType === "email") handleVerifyEmail();
    else handleVerifyMobile();
  };

  const handleSignIn = async () => {
    if (showOtp) {
      await handleConfirmOtp();
      return;
    }

    if (isNewUser) {
      setIsSigningUp(true);
      setRegisterError("");

      try {
        await handleSendRegistrationOtp();
        return;
      } catch (err) {
        setIsSigningUp(false);
      }

      const msg = "Please enter and verify Email or Mobile via OTP first";
      setRegisterError(msg);
      showToast(msg, "error");
      setIsSigningUp(false);
      return;
    }

    // Validate at least one OTP verified
    if (!emailVerified && !mobileVerified) {
      const msg = "Please verify at least one (Email or Mobile) via OTP first";
      setRegisterError(msg);
      showToast(msg, "error");
      return;
    }

    setRegisterError("");
    setIsNewUser(false);
    setInitialAuthIdentifier("");

    closeLogin();
    openSelectRole();
  };

  const handleCancel = () => {
    setFormData({ email: "", mobile: "" });
    setEmailVerified(false);
    setMobileVerified(false);
    setShowOtp(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setVerifyingType(null);
    setIsNewUser(false);
    setInitialAuthIdentifier("");
    closeLogin();
  };

  if (!isLoginOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overscroll-contain">
      <div className="absolute inset-0 bg-black/40 touch-none" />
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-[#000000A6] max-w-6xl w-full min-h-0 sm:min-h-[32rem] max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-[38%] bg-[#f5f7fa] items-center justify-center p-6">
          <div className="relative w-full">
            <div className="relative w-full max-w-sm">
              <img
                src="/image84.svg"
                alt="Students Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-[62%] p-5 sm:p-8 overflow-y-auto custom-scrollbar">
          <button
            onClick={closeLogin}
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
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8 pr-8 sm:pr-0">
            New User Setup
          </h1>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Email Section */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  E-mail ID <span className="text-red-500">*</span>
                </label>
                <div className="flex items-end gap-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={emailVerified}
                    className="flex-1 py-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent text-base"
                  />
                  {!emailVerified && !showOtp && !isNewUser && (
                    <button
                      onClick={handleVerifyEmail}
                      disabled={
                        !formData.email ||
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                      }
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors disabled:cursor-not-allowed ${formData.email &&
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                        ? "bg-button-primary text-primary border-button-primary hover:opacity-90"
                        : "bg-primary text-white"
                        }`}
                    >
                      Verify
                    </button>
                  )}
                  {emailVerified && (
                    <span className="px-3 py-2 sm:px-2 sm:py-2 rounded-full text-sm sm:text-xs font-medium bg-green-500 text-white">
                      Verified ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile Section */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex items-end gap-3">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="1234567890"
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={mobileVerified}
                    className="flex-1 py-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent disabled:opacity-60 text-base"
                  />
                  {!mobileVerified && !showOtp && !isNewUser && (
                    <button
                      onClick={handleVerifyMobile}
                      disabled={
                        !formData.mobile || formData.mobile.length !== 10
                      }
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors disabled:cursor-not-allowed ${formData.mobile && formData.mobile.length === 10
                        ? "bg-button-primary text-primary border-button-primary hover:opacity-90"
                        : "bg-primary text-white"
                        }`}
                    >
                      Verify
                    </button>
                  )}
                  {mobileVerified && (
                    <span className="px-3 py-2 sm:px-2 sm:py-2 rounded-full text-sm sm:text-xs font-medium bg-green-500 text-white">
                      Verified ✓
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Common OTP Section */}
            {showOtp && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-primary mb-3">
                  Enter OTP sent to your email or mobile
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el: HTMLInputElement | null) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-10 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg text-primary focus:outline-none focus:border-button-primary transition-all"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  {canResend ? (
                    <button
                      onClick={handleResendOtp}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500 font-medium">
                      Resend in {resendTimer}s
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setShowOtp(false);
                      setIsSigningUp(false);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                  >
                    Cancel Verification
                  </button>
                </div>
                {otpError && (
                  <p className="text-sm text-red-500 mt-2 font-medium">
                    {otpError}
                  </p>
                )}
              </div>
            )}

            <div className="pt-4 sm:pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base sm:text-sm text-primary">
                  I have read and agreed to the application's
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 ml-0 sm:ml-6 mt-3 sm:mt-2 text-base sm:text-sm">
                <span className="text-green-500 text-xs sm:text-xs">✓</span>
                <p className="text-[#3399C2] font-bold hover:underline cursor-pointer">
                  Privacy Policy
                </p>
                <span className="text-gray-400 mx-1">&</span>
                <span className="text-green-500 text-xs sm:text-xs">✓</span>
                <p className="text-[#3399C2] font-bold hover:underline cursor-pointer">
                  Terms of Service
                </p>
              </div>
            </div>

            {registerError && (
              <p className="text-sm sm:text-xs text-red-500 mb-2 font-medium">
                {registerError}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 sm:pt-4 w-full">
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto flex justify-center px-7 py-3 sm:py-2.5 rounded-full bg-primary text-white text-base sm:text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignIn}
                disabled={
                  (!emailVerified && !mobileVerified && !isNewUser) ||
                  isSigningUp
                }
                className={`px-7 py-2.5 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed ${emailVerified || mobileVerified || isNewUser
                  ? "bg-button-primary text-primary hover:opacity-90"
                  : "bg-primary text-white"
                  }`}
              >
                {isSigningUp ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  return <LoginModal />;
};

export default Login;
