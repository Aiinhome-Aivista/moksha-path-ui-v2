import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "../context/AuthContext";
import { useToast } from "../../../app/providers/ToastProvider";
import ApiServices from "../../../services/ApiServices";
import { useAuth } from "../../../app/providers/AuthProvider";
import babaji from "../../../assets/icon/hero.svg"
const isValidIndianMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile);
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const SignInModal: React.FC = () => {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [contactValue, setContactValue] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { fetchMenu, handleSignInSuccess } = useModal();

  useEffect(() => {
    let timer: any;
    if (showOtp && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [showOtp, resendTimer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!contactValue) {
      showToast("Please enter contact details", "error");
      return;
    }
    if (method === "email" && !isValidEmail(contactValue)) {
      showToast("Invalid email address", "error");
      return;
    }
    if (method === "phone" && !isValidIndianMobile(contactValue.replace(/\s/g, ""))) {
      showToast("Invalid mobile number", "error");
      return;
    }

    try {
      setIsSendingOtp(true);
      const res = await ApiServices.sendOtpV4({
        auth_identifier: contactValue,
        [method === "email" ? "email" : "mobile"]: contactValue,
      });

      if (res.data?.status === "success") {
        showToast("OTP sent successfully", "success");
        setShowOtp(true);
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

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
        const { auth_token, refresh_token, subscription_token } = verifyRes.data.data;
        if (auth_token) localStorage.setItem("auth_token", auth_token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
        if (subscription_token) localStorage.setItem("subscription_token", subscription_token);

        showToast("Welcome back!", "success");

        const profileRes = await ApiServices.getUsersByTokenContact();
        const profiles = profileRes?.data?.data ?? [];

        if (profiles.length > 0) {
          await fetchMenu();
          const primary = profiles[0];
          login({
            id: primary.sub,
            name: primary.username || "User",
            email: contactValue,
            role: primary.role_name?.toLowerCase(),
          });
          handleSignInSuccess();
          navigate("/dashboard");
        } else {
          navigate("/register");
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

  return (
    <div className="auth-body">
      <header className="site-header">
        <div className="wrap">
          <Link to="/" className="brand" aria-label="MokshPath home">
            <img src="/logogod.svg" alt="" className="brand-mark" />
            <div>
              <div className="name">MokshPath <span style={{ color: "var(--saffron)" }}>Academia</span></div>
              <div className="tag">सत्यं ज्ञानं · a guided path to true learning</div>
            </div>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link to="/#personas">Who it's for</Link>
            <Link to="/#faq">FAQ</Link>
            <Link to="/#pricing">Pricing</Link>
            <Link to="/register" className="btn btn-primary cta">Create account</Link>
          </nav>
        </div>
      </header>

      <main className="auth-main">
        <img className="auth-mandala" src="/assets/mandala.svg" alt="" aria-hidden="true" />

        <div className="auth-shell">
          <div className="auth-card">
            {!showOtp ? (
              <>
                <div className="auth-card__eyebrow">
                  <span className="accent-sanskrit">पुनरागमन</span>
                  <span className="auth-eb-en">Welcome back</span>
                </div>
                <h1 className="auth-card__title">Continue your path.</h1>
                <p className="auth-card__lede">
                  Enter the email or phone you signed up with. We'll send a one-time code — no password to remember.
                </p>

                <form className="auth-form" onSubmit={handleSendOtp}>
                  <div className="auth-toggle" role="tablist" aria-label="Contact method">
                    <button
                      type="button"
                      className={`auth-toggle__btn ${method === "email" ? "is-active" : ""}`}
                      onClick={() => setMethod("email")}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      className={`auth-toggle__btn ${method === "phone" ? "is-active" : ""}`}
                      onClick={() => setMethod("phone")}
                    >
                      Phone
                    </button>
                  </div>

                  {method === "email" ? (
                    <label className="auth-field">
                      <span className="auth-field__label">Email</span>
                      <input
                        type="email"
                        className="auth-field__input"
                        placeholder="you@school.edu"
                        value={contactValue}
                        onChange={(e) => setContactValue(e.target.value)}
                        required
                      />
                    </label>
                  ) : (
                    <label className="auth-field">
                      <span className="auth-field__label">Phone</span>
                      <div className="auth-field__phone">
                        <span className="auth-field__cc">+91</span>
                        <input
                          type="tel"
                          className="auth-field__input"
                          placeholder="98765 43210"
                          value={contactValue}
                          onChange={(e) => setContactValue(e.target.value)}
                        />
                      </div>
                    </label>
                  )}

                  <button type="submit" className="btn btn-primary btn-block" disabled={isSendingOtp}>
                    {isSendingOtp ? "Sending..." : "Send one-time code →"}
                  </button>

                  <div className="auth-divider"><span>or</span></div>

                  <button type="button" className="btn btn-auth-google btn-block">
                    <span className="google-g" aria-hidden="true">
                      <svg viewBox="0 0 48 48" width="20" height="20">
                        <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                    </span>
                    Continue with Google
                  </button>

                  <p className="auth-footnote">
                    New here? <Link to="/register">Create an account</Link> · it takes 60 seconds.
                  </p>
                </form>
              </>
            ) : (
              <>
                <div className="auth-card__eyebrow">
                  <span className="accent-sanskrit">सत्यापन</span>
                  <span className="auth-eb-en">Verification</span>
                </div>
                <h1 className="auth-card__title">Enter the code.</h1>
                <p className="auth-card__lede">
                  We've sent a 6-digit code to <strong>{contactValue}</strong>.
                </p>

                <form className="auth-form" onSubmit={handleVerifyOtp}>
                  <div className="otp-boxes">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        className="otp-box"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => e.key === "Backspace" && !digit && index > 0 && otpRefs.current[index - 1]?.focus()}
                      />
                    ))}
                  </div>

                  <div className="otp-resend">
                    Didn't get it? {canResend ? (
                      <button type="button" className="link-btn" onClick={handleSendOtp}>Resend code</button>
                    ) : (
                      <span>Resend in {resendTimer}s</span>
                    )}
                    {" or "}
                    <button type="button" className="link-btn" onClick={() => setShowOtp(false)}>change method</button>.
                  </div>

                  {otpError && <p className="auth-error">{otpError}</p>}

                  <button type="submit" className="btn btn-primary btn-block" disabled={isVerifying || otp.join("").length !== 6}>
                    {isVerifying ? "Verifying..." : "Verify and sign in →"}
                  </button>
                </form>
              </>
            )}
          </div>

          <aside className="auth-aside">
            <div className="auth-aside__inner">
              <img src={babaji} alt="" className="auth-aside__logo" aria-hidden="true" />
              <blockquote className="auth-aside__quote">
                "A single stone, dropped in the right pond, changes the direction of every ripple."
              </blockquote>
              <div className="auth-aside__facts">
                <div><span className="aaf-n">4</span><span className="aaf-l">Dashboards</span></div>
                <div><span className="aaf-n">1</span><span className="aaf-l">Adaptive engine</span></div>
                <div><span className="aaf-n">∞</span><span className="aaf-l">Personal paths</span></div>
              </div>
              <div className="auth-aside__trust">
                🔒 GDPR + COPPA compliant · WCAG 2.1 AA
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="auth-footer">
        <div className="wrap">
          <div>© 2026 MokshPath Academia</div>
          <div><Link to="#">Privacy</Link> · <Link to="#">Terms</Link> · <Link to="#">Help</Link></div>
        </div>
      </footer>
    </div>
  );
};

const SignIn: React.FC = () => <SignInModal />;
export default SignIn;
