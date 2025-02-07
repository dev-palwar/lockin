import type { Metadata } from "next";
import { Rubik_Glitch } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/Providers/AuthProvider";
import Navbar from "@/components/navbar";

const rubikGlitch = Rubik_Glitch({
  subsets: ["latin"],
  variable: "--font-rubik-glitch",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Lockin",
  description: "task management on steroids",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${rubikGlitch.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
