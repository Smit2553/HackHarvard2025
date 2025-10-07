"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, KeyRound, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement actual login logic
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement OTP send logic
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement OTP verification logic
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      // Reset states
      setOtpSent(false);
      setOtpCode("");
    }, 1000);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setOtpCode("");
    // TODO: Implement OTP resend logic
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleBackToEmail = () => {
    setOtpSent(false);
    setOtpCode("");
  };

  const handleOAuthLogin = (provider: "google" | "github") => {
    // TODO: Implement OAuth logic
    console.log(`Logging in with ${provider}`);
  };

  const handleModeSwitch = () => {
    setMode(mode === "password" ? "otp" : "password");
    setOtpSent(false);
    setOtpCode("");
  };

  // Reset states when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOtpSent(false);
      setOtpCode("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!otpSent ? (
          <>
            <DialogHeader>
              <DialogTitle>Welcome back</DialogTitle>
              <DialogDescription>
                Sign in to continue practicing
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Email/Password or Email for OTP */}
              <form
                onSubmit={
                  mode === "password" ? handleEmailPasswordLogin : handleSendOTP
                }
                className="space-y-4"
              >
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                  autoFocus
                />

                {mode === "password" && (
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    required
                  />
                )}

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      {mode === "password"
                        ? "Signing in..."
                        : "Sending code..."}
                    </span>
                  ) : mode === "password" ? (
                    "Sign in"
                  ) : (
                    "Send code"
                  )}
                </Button>
              </form>

              {/* Auth mode toggle */}
              <button
                type="button"
                onClick={handleModeSwitch}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center gap-1.5"
              >
                {mode === "password" ? (
                  <>
                    <Mail className="w-3 h-3" />
                    Use one-time code instead
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3 h-3" />
                    Use password instead
                  </>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin("google")}
                  className="w-full"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin("github")}
                  className="w-full"
                  type="button"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>

              {/* Sign up link */}
              <p className="text-center text-sm text-muted-foreground pt-2">
                Don&#39;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    router.push("/signup");
                  }}
                  className="cursor-pointer font-medium text-foreground hover:underline underline-offset-4"
                >
                  Sign up
                </button>
              </p>
            </div>
          </>
        ) : (
          /* OTP Verification Screen */
          <>
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackToEmail}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <DialogTitle>Enter code</DialogTitle>
              </div>
              <DialogDescription>We sent a code to {email}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleVerifyOTP} className="space-y-4 py-4">
              <Input
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-12 text-center text-xl tracking-[0.5em] font-mono"
                maxLength={6}
                required
                autoFocus
              />

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading || otpCode.length !== 6}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify"
                )}
              </Button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="cursor-pointer w-full text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                Didn&#39;t get the code? Send again
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
