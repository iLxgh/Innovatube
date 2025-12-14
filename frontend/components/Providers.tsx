"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </GoogleReCaptchaProvider>
  );
}
