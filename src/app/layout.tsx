import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "8DTUBE",
  description: "8DTUBE — situs video 3D seperti YouTube.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh bg-black">
        <div className="relative mx-auto min-h-dvh w-full max-w-md border-x border-white/10 bg-[#0f0f0f] shadow-2xl">
          <Navbar />
          <main className="relative z-10 pb-20">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
