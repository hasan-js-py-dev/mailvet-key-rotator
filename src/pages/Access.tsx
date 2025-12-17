import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import { z } from "zod";
import { PasswordStrength } from "@/components/PasswordStrength";
import { FormSkeleton } from "@/components/FormSkeleton";
import { useAuthContext } from "@/components/AuthProvider";

// Validation schemas
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PageType = "login" | "signup" | "forgot" | "reset" | "verify-email" | "email-sent";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

type VerificationState = "idle" | "pending" | "success" | "error";
type EmailSentContext = "verification" | "reset";

export default function AccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const pageParam = searchParams.get("page") || "login";
  const resetToken = searchParams.get("token");
  const verifyToken = searchParams.get("token");

  // Normalize page type: treat both `reset` and legacy `reset-password` as the reset flow
  const isResetPage = (pageParam === "reset" || pageParam === "reset-password") && !!resetToken;
  const allowedPages: PageType[] = ["login", "signup", "forgot", "verify-email", "email-sent"];
  const pageType: PageType = isResetPage
    ? "reset"
    : (allowedPages.includes(pageParam as PageType) ? (pageParam as PageType) : "login");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationState>("idle");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState("");
  const [emailSentContext, setEmailSentContext] = useState<EmailSentContext>("verification");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

  // Firebase ready check
  useEffect(() => {
    // Simulate a brief check for Firebase initialization
    const timer = setTimeout(() => {
      setIsFirebaseReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle email verification when landing on verify-email page
  useEffect(() => {
    if (pageType !== "verify-email") {
      setVerificationStatus("idle");
      setVerificationMessage("");
      return;
    }

    if (!verifyToken) {
      setVerificationStatus("error");
      setVerificationMessage("Verification token is missing.");
      return;
    }

    let isMounted = true;

    const verifyEmail = async () => {
      setIsVerifying(true);
      setVerificationStatus("pending");
      setVerificationMessage("Verifying your email...");

      try {
        const response = await fetch(
          `${apiBaseUrl}/v1/auth/verify-email?token=${verifyToken}`,
          { credentials: 'include' }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Invalid or expired verification link");
        }

        if (data.accessToken) {
          await login(data.accessToken);
        }

        if (isMounted) {
          setVerificationStatus("success");
          setVerificationMessage(
            data.message || "Email verified successfully. Redirecting you to the dashboard."
          );
        }

        toast({
          title: "Email verified",
          description: "Redirecting you to the dashboard.",
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (error) {
        if (!isMounted) return;

        const description =
          error instanceof Error
            ? error.message
            : "Unable to verify email. Please try again.";

        setVerificationStatus("error");
        setVerificationMessage(description);

        toast({
          title: "Verification failed",
          description,
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, navigate, pageType, verifyToken, login]);

  const validateForm = useCallback(() => {
    setFormErrors({});
    
    try {
      if (pageType === "signup") {
        signupSchema.parse(formData);
      } else if (pageType === "login") {
        loginSchema.parse(formData);
      } else if (pageType === "forgot") {
        forgotPasswordSchema.parse(formData);
      } else if (pageType === "reset") {
        resetPasswordSchema.parse(formData);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: FormErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          errors[field] = err.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  }, [formData, pageType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmitting || isLoading) return;
    
    if (!validateForm()) return;

    setIsLoading(true);
    setIsSubmitting(true);

    try {
      if (pageType === "signup") {
        await handleSignup();
      } else if (pageType === "login") {
        await handleLogin();
      } else if (pageType === "forgot") {
        await handleForgotPassword();
      } else if (pageType === "reset") {
        await handleResetPassword();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    if (!auth) {
      toast({
        title: "Configuration error",
        description: "Firebase is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      setNeedsVerification(false);
      setVerificationEmail("");

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const idToken = await userCredential.user.getIdToken();

      // Register with backend
      const response = await fetch(`${apiBaseUrl}/v1/auth/signup`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409 || data.error?.includes("already exists")) {
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please login instead.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(data.error || "Signup failed");
      }

      if (data.accessToken) {
        await login(data.accessToken);
      }

      setEmailSentTo(formData.email);
      setVerificationEmail(formData.email);
      setEmailSentContext("verification");
      navigate("/access?page=email-sent");
      
      toast({
        title: "Check your inbox!",
        description: "We've sent you a verification email. Click the link to activate your account.",
      });
    } catch (error: any) {
      // Handle Firebase specific errors
      if (error.code === "auth/email-already-in-use") {
        toast({
          title: "Email already registered",
          description: "An account with this email already exists. Please login or use a different email.",
          variant: "destructive",
        });
      } else if (error.code === "auth/weak-password") {
        toast({
          title: "Weak password",
          description: "Please choose a stronger password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup failed",
          description: error.message || "Unable to create account. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogin = async () => {
    if (!auth) {
      toast({
        title: "Configuration error",
        description: "Firebase is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      setNeedsVerification(false);
      setVerificationEmail("");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch(`${apiBaseUrl}/v1/auth/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (response.status === 403) {
        setNeedsVerification(true);
        setVerificationEmail(formData.email);
        setEmailSentTo(formData.email);
        toast({
          title: "Email not verified",
          description: data.message || "Please verify your email before logging in.",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.accessToken) {
        await login(data.accessToken);
      }

      toast({
        title: "Welcome back!",
        description: "Redirecting to your dashboard...",
      });

      navigate("/dashboard");
    } catch (error: any) {
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast({
          title: "Invalid credentials",
          description: "The email or password you entered is incorrect.",
          variant: "destructive",
        });
      } else if (error.code === "auth/too-many-requests") {
        toast({
          title: "Too many attempts",
          description: "Account temporarily locked. Please try again later or reset your password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: error.message || "Unable to login. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/v1/auth/password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Unable to send reset email. Please try again.");
      }

      // Always show generic success message to prevent email enumeration
      setEmailSentTo(formData.email);
      setEmailSentContext("reset");
      setResendCooldown(60);
      navigate("/access?page=email-sent");

      toast({
        title: "Reset email sent",
        description: "If an account exists with this email, you'll receive a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error?.message || "Unable to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken) {
      toast({
        title: "Invalid link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/v1/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Password reset failed");
      }

      toast({
        title: "Password updated!",
        description: "Your password has been reset. Please login with your new password.",
      });

      navigate("/access?page=login");
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Unable to reset password. The link may have expired.",
        variant: "destructive",
      });
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || isResending) return;

    if (!auth) {
      toast({
        title: "Configuration error",
        description: "Firebase is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in again before requesting another verification email.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const idToken = await user.getIdToken(true);

      const response = await fetch(`${apiBaseUrl}/v1/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.status === 429) {
        toast({
          title: "Please wait",
          description: data.error || "You can request another verification email in a moment.",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }

      setResendCooldown(60);
      if (!emailSentTo && user.email) {
        setEmailSentTo(user.email);
      }
      if (!verificationEmail && user.email) {
        setVerificationEmail(user.email);
      }

      toast({
        title: "Email sent!",
        description: data.message || "A new verification email has been sent to your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend",
        description: error.message || "Unable to resend verification email.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleResendPasswordReset = async () => {
    if (resendCooldown > 0 || isResending) return;

    const email = emailSentTo || formData.email;
    if (!email) {
      navigate("/access?page=forgot");
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/v1/auth/password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Unable to send reset email. Please try again.");
      }

      setResendCooldown(60);

      toast({
        title: "Email sent!",
        description: "If an account exists with this email, you'll receive a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error?.message || "Unable to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogle = async () => {
    if (isGoogleLoading) return;
    
    try {
      if (!auth || !googleProvider) {
        toast({
          title: "Google sign-in unavailable",
          description: "Add your Firebase web credentials to .env before trying again.",
          variant: "destructive",
        });
        return;
      }
      
      setIsGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${apiBaseUrl}/v1/auth/social/google`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const payload = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(payload?.error || "Google sign-in failed");
      }

      if (payload?.accessToken) {
        await login(payload.accessToken);
      }

      toast({
        title: "Signed in with Google",
        description: "Redirecting to dashboard...",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        // User closed the popup, no need to show error
        return;
      }
      
      const message = error instanceof Error ? error.message : "Unable to use Google sign-in";
      console.error("Google sign-in error", error);
      
      toast({
        title: "Google sign-in failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const renderForm = () => {
    switch (pageType) {
      case "email-sent":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-6">
              {emailSentContext === "verification" ? (
                <>We've sent a verification link to<br /></>
              ) : (
                <>We've sent a password reset link to<br /></>
              )}
              <span className="font-medium text-foreground">{emailSentTo}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {emailSentContext === "verification"
                ? "Click the link in the email to verify your account. If you don't see it, check your spam folder."
                : "Click the link in the email to reset your password. If you don't see it, check your spam folder."}
            </p>

            <Button
              variant="outline"
              onClick={emailSentContext === "verification" ? handleResendVerification : handleResendPasswordReset}
              disabled={isResending || resendCooldown > 0}
              className="w-full"
            >
              {isResending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </span>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : emailSentContext === "verification" ? (
                "Resend verification email"
              ) : (
                "Resend reset email"
              )}
            </Button>

            {emailSentContext === "reset" && (
              <p className="mt-4 text-xs text-muted-foreground">
                Tip: If you signed up with Google, password reset emails won't be sent—use Google Sign-In instead.
              </p>
            )}

            <p className="mt-6 text-sm text-muted-foreground">
              Wrong email?{" "}
              <Link to="/access?page=signup" className="text-primary hover:underline">
                Sign up again
              </Link>
            </p>
          </motion.div>
        );

      case "verify-email":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {isVerifying ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-2">Verifying your email</h1>
                <p className="text-muted-foreground">Please wait while we confirm your email address...</p>
              </>
            ) : verificationStatus === "success" ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-2">Email verified!</h1>
                <p className="text-muted-foreground mb-6">
                  Your account is now active. Redirecting to login...
                </p>
                <Button variant="gradient" onClick={() => navigate("/access?page=login")} className="w-full">
                  Go to Login
                </Button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-2">Verification failed</h1>
                <p className="text-muted-foreground mb-6">
                  This verification link is invalid or has expired.
                </p>
                <Button variant="gradient" onClick={() => navigate("/access?page=signup")} className="w-full">
                  Sign up again
                </Button>
              </>
            )}
          </motion.div>
        );

      case "forgot":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl font-bold mb-2">Forgot password?</h1>
            <p className="text-muted-foreground mb-8">
              No worries! Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`pl-10 h-12 ${formErrors.email ? "border-destructive" : ""}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-destructive">{formErrors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending reset link...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send reset link
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-muted-foreground">
              Remember your password?{" "}
              <Link to="/access?page=login" className="text-primary hover:underline font-medium">
                Back to login
              </Link>
            </p>
          </motion.div>
        );

      case "reset":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl font-bold mb-2">Set new password</h1>
            <p className="text-muted-foreground mb-8">
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`pl-10 pr-10 h-12 ${formErrors.password ? "border-destructive" : ""}`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`pl-10 pr-10 h-12 ${formErrors.confirmPassword ? "border-destructive" : ""}`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{formErrors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating password...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Update password
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        );

      default:
        // Login & Signup forms
        const isLogin = pageType === "login";
        
        // Show skeleton while Firebase initializes
        if (!isFirebaseReady) {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative overflow-hidden"
            >
              <FormSkeleton />
            </motion.div>
          );
        }
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl font-bold mb-2">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {isLogin
                ? "Enter your credentials to access your dashboard"
                : "Start validating emails with 50 free credits"}
            </p>

            {isLogin && needsVerification && (
              <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">Verify your email to continue</p>
                    <p className="text-sm text-muted-foreground">
                      {`We've sent a verification link to ${verificationEmail || emailSentTo || formData.email || "your email"}.`}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={isResending || resendCooldown > 0}
                      >
                        {isResending ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </span>
                        ) : resendCooldown > 0 ? (
                          `Resend in ${resendCooldown}s`
                        ) : (
                          "Resend verification email"
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Need help? Contact support if you can't find the email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`pl-10 h-12 ${formErrors.name ? "border-destructive" : ""}`}
                        required={!isLogin}
                        disabled={isLoading}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-sm text-destructive">{formErrors.name}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`pl-10 h-12 ${formErrors.email ? "border-destructive" : ""}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-destructive">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <Link
                      to="/access?page=forgot"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`pl-10 pr-10 h-12 ${formErrors.password ? "border-destructive" : ""}`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!isLogin && (
                  <AnimatePresence>
                    <PasswordStrength password={formData.password} />
                  </AnimatePresence>
                )}
                {formErrors.password && (
                  <p className="text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? "Sign in" : "Create account"}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <Link
                  to={isLogin ? "/access?page=signup" : "/access?page=login"}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full mt-4 bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98]"
                type="button"
                onClick={handleGoogle}
                disabled={isGoogleLoading || !isFirebaseConfigured}
              >
                {isGoogleLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
              {!isFirebaseConfigured && (
                <p className="mt-2 text-sm text-muted-foreground text-center">
                  Google sign-in is disabled until VITE_FIREBASE_* env vars are configured.
                </p>
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[hsl(270,100%,2%)]">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="inline-block mb-8">
            <Logo size="lg" />
          </Link>

          <div className="[&_h1]:text-white [&_p]:text-[hsl(270,20%,65%)] [&_label]:text-[hsl(270,20%,75%)] [&_.text-muted-foreground]:text-[hsl(270,20%,60%)] [&_.text-foreground]:text-white [&_input]:bg-[hsl(270,50%,8%)] [&_input]:border-[hsl(270,50%,20%)] [&_input]:text-white [&_input]:placeholder:text-[hsl(270,20%,40%)] [&_button[variant='outline']]:border-[hsl(270,50%,20%)] [&_button[variant='outline']]:text-white [&_button[variant='outline']]:bg-transparent [&_.border-border]:border-[hsl(270,50%,15%)] [&_.bg-background]:bg-[hsl(270,100%,2%)] [&_.text-primary]:text-[hsl(267,100%,65%)] [&_a.text-primary]:text-[hsl(267,100%,65%)]">
            {renderForm()}
          </div>
        </div>
      </div>

      {/* Right side - Gradient visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[hsl(267,100%,15%)] via-[hsl(270,80%,10%)] to-[hsl(270,100%,5%)]">
        <div className="absolute inset-0 bg-[hsl(270,100%,2%)]/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(267,100%,50%)]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[hsl(267,100%,60%)]/5 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-16 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="font-display text-4xl font-bold mb-4 text-white">
              Start Validating<br />Emails Today
            </h2>
            <p className="text-xl text-[hsl(270,20%,70%)] max-w-md">
              Join thousands of businesses using MailVet to improve their email deliverability and sender reputation.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">99.9%</div>
                <div className="text-sm text-[hsl(270,20%,60%)]">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">10M+</div>
                <div className="text-sm text-[hsl(270,20%,60%)]">Emails Verified</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">5K+</div>
                <div className="text-sm text-[hsl(270,20%,60%)]">Happy Users</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
