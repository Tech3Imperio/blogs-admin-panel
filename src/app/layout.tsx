"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Set to true when the component is mounted on the client side
  }, []);

  if (!mounted) {
    return (
      <html lang="en">
        <body></body>
      </html>
    ); // Don't render the theme provider until mounted
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="w-full h-full">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
