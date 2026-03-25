import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useModal } from "../context/AuthContext";
import { useToast } from "../../../app/providers/ToastProvider";
import ApiServices from "../../../services/ApiServices";
import { useAuth } from "../../../app/providers/AuthProvider";
export const SignInModal: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    emailOrMobile: "",
  });

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Loading States
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Resend OTP State
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Recovery State
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<"username" | "otp">(
    "username",
  );
  const [recoveryIdentifier, setRecoveryIdentifier] = useState(""); // Username
  const [recoveryMethod, setRecoveryMethod] = useState<
    "email" | "mobile" | null
  >(null);
  // const [recoveryDetails, setRecoveryDetails] = useState<{
  //   email: string | null;
  //   mobile: string | null;
  // } | null>(null);
  const [recoveryOtp, setRecoveryOtp] = useState(["", "", "", "", "", ""]);
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveredUsernames, setRecoveredUsernames] = useState<string[]>([]);
  const recoveryOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (showOtp && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [showOtp, resendTimer]);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  // const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    isSignInOpen,
    closeSignIn,
    openLogin,
    openSelectRole,
    setInitialAuthIdentifier,
    setIsNewUser,
    // decodeUserToken,
    fetchMenu,
    openProfileSelection,
    setProfilesList,
  } = useModal();
  const { login } = useAuth();
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isSignInOpen) {
      const scrollY = window.scrollY;
      document.body.style.setProperty("position", "fixed", "important");
      document.body.style.setProperty("top", `-${scrollY}px`, "important");
      document.body.style.setProperty("width", "100%", "important");
      document.body.style.setProperty("overflow", "hidden", "important");
    }

    return () => {
      if (isSignInOpen) {
        const scrollY = document.body.style.top;
        document.body.style.removeProperty("position");
        document.body.style.removeProperty("top");
        document.body.style.removeProperty("width");
        document.body.style.removeProperty("overflow");
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    };
  }, [isSignInOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isSignInOpen) {
      setFormData({ username: "", emailOrMobile: "" });

      setShowOtp(false);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setIsVerified(false);
      setIsSendingOtp(false);

      setIsLoggingIn(false);
      setResendTimer(60);
      setCanResend(false);

      // Recovery State Reset
      setShowRecovery(false);
      setRecoveryStep("username");
      setRecoveryIdentifier("");
      setRecoveryMethod(null);
      // setRecoveryDetails(null);
      setRecoveryOtp(["", "", "", "", "", ""]);
      setIsRecoveryLoading(false);
      setRecoveryError("");
      setRecoverySuccess(false);
      setRecoveredUsernames([]);
    }
  }, [isSignInOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (otpError) {
      setOtpError("");
    }
    if (showOtp || isVerified) {
      setShowOtp(false);
      setIsVerified(false);
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
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

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile);
  };

  // Static OTP sending
  const handleSendOtp = async () => {
    if (
      !isValidEmail(formData.emailOrMobile) &&
      !isValidMobile(formData.emailOrMobile)
    ) {
      setOtpError(
        "Please enter a valid email address or 10-digit mobile number",
      );
      showToast(
        "Please enter a valid email address or 10-digit mobile number",
        "error",
      );
      return;
    }

    try {
      setIsSendingOtp(true);
      setOtpError("");

      const res = await ApiServices.sendOtpV4({
        auth_identifier: formData.emailOrMobile,
      });

      if (res.data?.status === "success") {
        if (res.data.data?.new_user === true) {
          setInitialAuthIdentifier(formData.emailOrMobile);
          setIsNewUser(true);
          closeSignIn();
          openLogin();
          return;
        }
        setShowOtp(true);
        setResendTimer(60);
        setCanResend(false);
        showToast("OTP sent successfully", "success");
      } else {
        setOtpError(res.data?.message || "Failed to send OTP");
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSendingOtp(false);
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
    handleSendOtp();
  };

  // Static Recovery Flow
  const handleRecoveryNext = () => {
    if (!recoveryIdentifier) {
      setRecoveryError("Please enter your details");
      showToast("Please enter your details", "error");
      return;
    }

    setRecoveryError("");
    if (isValidEmail(recoveryIdentifier)) {
      setRecoveryMethod("email");
      // setRecoveryDetails({ email: recoveryIdentifier, mobile: null });
    } else if (isValidMobile(recoveryIdentifier)) {
      setRecoveryMethod("mobile");
      // setRecoveryDetails({ email: null, mobile: recoveryIdentifier });
    } else {
      setRecoveryMethod("email");
      // setRecoveryDetails({ email: "static_user@example.com", mobile: null });
    }

    setRecoveryStep("otp");
    showToast("Recovery OTP sent (Static Mode)", "success");
  };

  const handleVerifyRecoveryOtp = () => {
    const otpValue = recoveryOtp.join("");
    if (otpValue.length !== 6) {
      setRecoveryError("Please enter complete 6-digit OTP");
      showToast("Please enter complete 6-digit OTP", "error");
      return;
    }

    setRecoveryError("");
    setRecoveredUsernames(["static_user_1", "static_user_2"]);
    setRecoverySuccess(true);
    showToast("Account verified successfully (Static Mode)", "success");
  };

  const handleRecoveryOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...recoveryOtp];
    newOtp[index] = value.slice(-1);
    setRecoveryOtp(newOtp);
    if (value && index < 5) recoveryOtpRefs.current[index + 1]?.focus();
  };

  const handleRecoveryOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !recoveryOtp[index] && index > 0) {
      recoveryOtpRefs.current[index - 1]?.focus();
    }
  };

  // Static Login
  const handleSignIn = async () => {
    if (!showOtp) {
      setOtpError("Please verify OTP first");
      showToast("Please verify OTP first", "error");
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Please enter complete 6-digit OTP");
      showToast("Please enter complete 6-digit OTP", "error");
      return;
    }

    try {
      setIsLoggingIn(true);
      const res = await ApiServices.verifyAccountV4({
        auth_identifier: formData.emailOrMobile,
        otp: otpValue,
      });

      if (res.data?.status === "success") {
        const { auth_token, refresh_token,subscription_token } = res.data.data;

        if (auth_token) localStorage.setItem("auth_token", auth_token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
        if (subscription_token)
          localStorage.setItem("subscription_token", subscription_token);
        setOtpError("");
        // closeSignIn();
        showToast("Signed in successfully", "success");

        // // Refresh context data
        // await decodeUserToken();
        // // Always fetch menu - will handle gracefully if empty
        // await fetchMenu();
        // const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        // const activeRole = userData?.roles?.[0]?.role_name;
        // login({
        //   id: userData.user_id || "1",
        //   name: userData.name || "User",
        //   email: formData.emailOrMobile,
        //   role: activeRole
        // });

        // closeSignIn();

        // const subscriptionId = res.data?.data?.subscription_id;

        // if (!subscriptionId) {
        //   navigate("/subscription", { replace: true });
        // } else {
        //   const role = activeRole?.toLowerCase();
        //   if (role === "teacher") {
        //     navigate("/teacher/dashboard", { replace: true });
        //   } else if (role === "parent") {
        //     navigate("/parent/dashboard", { replace: true });
        //   } else {
        //     navigate("/dashboard", { replace: true });
        //   }
        // }
        // await decodeUserToken();
        await fetchMenu();

        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        const activeRole = userData?.roles?.[0]?.role_name;

        login({
          id: userData.user_id || "1",
          name: userData.name || "User",
          email: formData.emailOrMobile,
          role: activeRole,
        });

        // 🔹 CHECK PROFILES FIRST
        const profileRes = await ApiServices.getUsersByTokenContact();

        // if (
        //   profileRes.data?.status === "success" &&
        //   profileRes.data?.data?.length > 0
        // ) {
        //   // Profiles exist
        //   openProfileSelection();
        // } else {
        //   // No profiles
        //   openSelectRole();
        // }
        const profiles = profileRes?.data?.data ?? [];

        // valid profiles only (profile created)
        const validProfiles = profiles.filter(
          (p: any) => p.username !== null && p.role_id !== null,
        );

        if (validProfiles.length > 0) {
          // Profiles exist → show selection
          localStorage.setItem("profile_modal_mode", "manage");
          setProfilesList(validProfiles);
          closeSignIn();
          openProfileSelection();
        } else {
          // No profile created → complete profile
          closeSignIn();
          openSelectRole();
        }
        // closeSignIn();
        // // Check if profile setup is incomplete (no user data AND no subscription)
        // if (res.data?.data?.subscription_id === null && !res.data?.data?.user) {
        //   openSelectRole();
        // } else if (res.data?.data?.subscription_id === null) {
        //   // User has profile but no subscription
        //   navigate("/subscription", { replace: true });
        // } else {
        //   // User has complete profile with active subscription
        //   navigate("/dashboard", { replace: true });
        // }
      } else {
        setOtpError(res.data?.message || "Invalid OTP");
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCancel = () => {
    setFormData({ username: "", emailOrMobile: "" });
    setShowOtp(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setIsVerified(false);
    setShowRecovery(false);
    setRecoveryStep("username");
    setRecoveryIdentifier("");
    setRecoveryMethod(null);
    // setRecoveryDetails(null);
    setRecoveryOtp(["", "", "", "", "", ""]);
    setRecoveryError("");
    setRecoverySuccess(false);
    setRecoveredUsernames([]);
    closeSignIn();
  };

  // const handleCreateAccount = () => {
  //   closeSignIn();
  //   openLogin();
  // };

  if (!isSignInOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overscroll-contain">
      <div className="absolute inset-0 bg-black/40 touch-none" />
      <div className="relative bg-white rounded-3xl shadow-[#000000A6] max-w-6xl w-full min-h-[32rem] overflow-hidden flex">
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
        <div className="w-full md:w-[62%] p-8">
          <button
            onClick={closeSignIn}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
          <h1 className="text-3xl font-bold text-primary mb-8">
            {showRecovery ? "Account Recovery" : "Sign in to Your Account"}
          </h1>
          {showRecovery ? (
            <div className="space-y-6">
              {!recoverySuccess ? (
                <>
                  {recoveryStep === "username" ? (
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Enter Username, Email, or Mobile
                      </label>
                      <input
                        type="text"
                        value={recoveryIdentifier}
                        onChange={(e) => setRecoveryIdentifier(e.target.value)}
                        placeholder="Username / Email / Mobile"
                        className="w-full pb-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">
                        Enter OTP sent to your {recoveryMethod}
                      </p>
                      <div className="flex items-center gap-2">
                        {recoveryOtp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el: HTMLInputElement | null) => {
                              recoveryOtpRefs.current[index] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleRecoveryOtpChange(index, e.target.value)
                            }
                            onKeyDown={(e) =>
                              handleRecoveryOtpKeyDown(index, e)
                            }
                            className="w-8 h-9 text-center border border-gray-300 rounded-md text-primary focus:outline-none focus:border-blue-500"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {recoveryError && (
                    <p className="text-xs text-red-500 mt-2">{recoveryError}</p>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        if (recoveryStep === "otp") {
                          setRecoveryStep("username");
                          setRecoveryError("");
                          setRecoveryOtp(["", "", "", "", "", ""]);
                        } else {
                          setShowRecovery(false);
                          setRecoveryError("");
                          setRecoveryIdentifier("");
                        }
                      }}
                      className="px-7 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={
                        recoveryStep === "username"
                          ? handleRecoveryNext
                          : handleVerifyRecoveryOtp
                      }
                      disabled={
                        isRecoveryLoading ||
                        (recoveryStep === "username" && !recoveryIdentifier) ||
                        (recoveryStep === "otp" &&
                          recoveryOtp.join("").length !== 6)
                      }
                      className={`px-7 py-2.5 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                        (recoveryStep === "username" && !recoveryIdentifier) ||
                        (recoveryStep === "otp" &&
                          recoveryOtp.join("").length !== 6) ||
                        isRecoveryLoading
                          ? "bg-primary text-white"
                          : "bg-button-primary text-primary hover:opacity-90"
                      }`}
                    >
                      {isRecoveryLoading
                        ? "Loading..."
                        : recoveryStep === "username"
                          ? "Next"
                          : "Verify"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="mb-4 text-green-500 text-5xl">✓</div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    Success!
                  </h3>

                  {recoveredUsernames.length > 0 ? (
                    <div className="mb-6">
                      <p className="text-gray-500 mb-3">
                        Here are your recovered usernames:
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                        {recoveredUsernames.map((username, idx) => (
                          <div
                            key={idx}
                            className="bg-white border text-primary p-2 mb-2 rounded bg-opacity-70 font-medium select-all"
                          >
                            {username}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-6">
                      Account verified successfully.
                    </p>
                  )}

                  <button
                    onClick={() => {
                      setShowRecovery(false);
                      setRecoverySuccess(false);
                      setRecoveryIdentifier("");
                      setRecoveryStep("username");
                      setRecoveredUsernames([]);
                    }}
                    className="px-7 py-2.5 rounded-full bg-button-primary text-primary text-sm font-medium hover:opacity-90 transition-colors"
                  >
                    Back to Sign in
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  E-mail ID / Mobile Number
                </label>
                <div className="flex items-end gap-3">
                  <input
                    type="text"
                    name="emailOrMobile"
                    value={formData.emailOrMobile}
                    onChange={handleChange}
                    placeholder="Enter your email or mobile"
                    disabled={showOtp}
                    className="flex-1 pb-2 border-b border-gray-300 text-primary placeholder-gray-400 focus:outline-none focus:border-gray-500 bg-transparent disabled:opacity-60"
                  />
                  {!showOtp && !isVerified && (
                    <button
                      onClick={handleSendOtp}
                      disabled={
                        isSendingOtp ||
                        !formData.emailOrMobile ||
                        (!isValidEmail(formData.emailOrMobile) &&
                          !isValidMobile(formData.emailOrMobile))
                      }
                      className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors disabled:cursor-not-allowed ${
                        formData.emailOrMobile &&
                        (isValidEmail(formData.emailOrMobile) ||
                          isValidMobile(formData.emailOrMobile))
                          ? "bg-button-primary text-primary border-button-primary hover:opacity-90"
                          : "bg-primary text-white"
                      }`}
                    >
                      {isSendingOtp ? "Sending..." : "Send OTP"}
                    </button>
                  )}
                </div>

                {/* OTP Input */}
                {showOtp && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Enter OTP sent to your email
                    </p>
                    <div className="flex items-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el: HTMLInputElement | null) => {
                            otpRefs.current[index] = el;
                          }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-8 h-9 text-center border border-gray-300 rounded-md text-primary focus:outline-none focus:border-blue-500"
                        />
                      ))}
                    </div>
                    <div className="flex gap-6 items-center mt-3">
                      <button
                        onClick={() => {
                          setShowOtp(false);
                          setOtp(["", "", "", "", "", ""]);
                          setOtpError("");
                        }}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Change email
                      </button>

                      {canResend ? (
                        <button
                          onClick={handleResendOtp}
                          disabled={isSendingOtp}
                          className="text-xs text-blue-500 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSendingOtp ? "Sending..." : "Resend OTP"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Resend in {resendTimer}s
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {otpError && (
                  <p className="text-xs text-red-500 mt-2">{otpError}</p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="px-7 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignIn}
                  disabled={
                    isLoggingIn ||
                    (showOtp ? otp.join("").length !== 6 : !isVerified)
                  }
                  className={`px-7 py-2.5 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                    (showOtp ? otp.join("").length === 6 : isVerified)
                      ? "bg-button-primary text-primary hover:opacity-90"
                      : "bg-primary text-white"
                  }`}
                >
                  {isLoggingIn ? "Signing in..." : "Sign in"}
                </button>
              </div>

              {/* Create Account Link */}
              {/* <div className="pt-3">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button
                    onClick={handleCreateAccount}
                    className="text-blue-500 font-medium hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SignIn: React.FC = () => {
  return <SignInModal />;
};

export default SignIn;
