"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { useEffect, useState } from "react";

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
    console.log("Entered Use Effect");
    const fetchBlogs = async () => {
      console.log("Entered Fetch Blogs");
      const response = await fetch("/api/createConnection");
      console.log("Response", response);
      const data = await response.json();
      console.log("Connection Status", data);
    };
    fetchBlogs();
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
