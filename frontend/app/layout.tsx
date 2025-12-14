import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InnovaTube - YouTube Video Search",
  description: "Search and save your favorite YouTube videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </GoogleReCaptchaProvider>
      </body>
    </html>
  );
}
