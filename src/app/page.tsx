"use client";
import { authPageImage2 } from "@/assets/LoginPage";
import Image from "next/image";
import { blackLogo, whiteLogo } from "@/assets/Logo";
// import dbConnect from "@/lib/dbConnect";
import { useState } from "react";
import SignUpForm from "@/components/AuthForms/SignUpForm";
import SignInForm from "@/components/AuthForms/SignInForm";
import { useTheme } from "next-themes";
// import { Card } from "@/components/ui/card";
// await dbConnect();
type Side = "left" | "right";
type Stage = "idle" | "expanding" | "shrinking";
export default function Home() {
  const [currentSide, setCurrentSide] = useState<Side>("left");
  const [stage, setStage] = useState<Stage>("idle");
  const handleClick = () => {
    if (stage !== "idle") return; // Prevent spamming click
    setStage("expanding");

    setTimeout(() => {
      setStage("shrinking");

      // After shrink, change side
      setTimeout(() => {
        setCurrentSide(currentSide === "left" ? "right" : "left");
        setStage("idle");
      }, 500); // Match duration
    }, 500); // First expand duration
  };
  const getClasses = () => {
    if (stage === "expanding") {
      return `w-full ${currentSide === "left" ? "left-0" : "right-0"}`;
    } else if (stage === "shrinking") {
      return `w-1/2 ${currentSide === "left" ? "right-0" : "left-0"}`;
    } else {
      return `w-1/2 ${currentSide === "left" ? "left-0" : "right-0"}`;
    }
  };
  const { theme } = useTheme();
  return (
    <div
      className="flex flex-row justify-center w-[100vw] h-[100vh] mx-auto my-auto items-center gap-8 font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: `url(${authPageImage2.src})`,
        backgroundSize: "cover",
      }}
    >
      {/* <Card className="flex w-[33%] h-[50%] flex-col justify-center items-center gap-4 rounded-2xl shadow-2xl backdrop-blur-md "> */}
      <div
        className={`flex w-[50%] h-[66%] flex-row relative justify-around items-center rounded-2xl shadow-2xl bg-primary-${theme} overflow-hidden`}
      >
        <div
          // style={{
          //   backgroundImage: `url(${LogoBackground.src})`,
          //   backgroundRepeat: "no-repeat",
          //   backgroundPosition: "center",
          //   backgroundClip: "inherit",
          // }}
          className={`absolute z-10 top-0 h-full transition-all bg-toggle-${theme} duration-500 ease-in-out flex justify-center items-center ${getClasses()}`}
        >
          <Image
            src={theme === "light" ? whiteLogo : blackLogo}
            alt="logo"
            className="w-48 aspect-auto"
            width={2000}
            height={2000}
          />
        </div>
        <div className="relative flex w-full h-full justify-around items-center">
          <SignUpForm changePosition={handleClick} />
          <SignInForm changePosition={handleClick} />
        </div>
      </div>
      {/* </Card> */}
    </div>
  );
}
