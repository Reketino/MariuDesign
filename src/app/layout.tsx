import type { Metadata } from "next";
import { Geist, Geist_Mono, Jim_Nightshade } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const jimNightshade = Jim_Nightshade({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ssignature",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mariudesign",
  description: "Buy 3D printed files from Mariudesign",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jimNightshade.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Navbar />

        <div className="flex-1">
        {children}
        </div>
        
        </body>
    </html>
  );
}
