import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ParaProviders } from "../providers/ParaProviders";
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
  title: "Para Community Hub",
  description: "Claim your community name.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ParaProviders>
          {children}
        </ParaProviders>
      </body>
    </html>
  );
}
