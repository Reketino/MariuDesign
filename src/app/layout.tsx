import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Jim_Nightshade } from "next/font/google";
import "./globals.css";

const JimNightshade = Jim_Nightshade({
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${JimNightshade.variable}min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
