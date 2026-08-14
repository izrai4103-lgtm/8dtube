import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Background3D from "@/components/Background3D";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "8DTUBE — Video Populer dalam 3D",
  description:
    "8DTUBE adalah website video seperti YouTube dengan tampilan 3D, terhubung langsung dengan eight-dee-tube-clone.lovable.app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh bg-[#07070d] text-white">
        <Background3D />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
