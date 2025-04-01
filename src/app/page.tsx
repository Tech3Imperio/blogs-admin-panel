// export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { authPageImage } from "@/assets/LoginPage";
import Image from "next/image";
import { blackLogo } from "@/assets/Logo";
import AuthForm from "@/components/AuthForm/AuthForm";
import dbConnect from "@/lib/dbConnect";
// import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blogs Admin Panel",
  description: "CRUD actions Admin Panel for blogs",
};
await dbConnect();
export default async function Home() {
  return (
    <div
      className="flex flex-row justify-center w-[100vw] h-[100vh] mx-auto my-auto items-center gap-8 font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: `url(${authPageImage.src})`,
        backgroundSize: "cover",
      }}
    >
      {/* <Card className="flex w-[33%] h-[50%] flex-col justify-center items-center gap-4 rounded-2xl shadow-2xl backdrop-blur-md "> */}
      <div className="flex w-[33%] h-[50%] flex-col justify-center items-center gap-4 rounded-2xl shadow-2xl backdrop-blur-md">
        <Image src={blackLogo} alt="logo" className="w-48 aspect-auto" />
        <AuthForm />
      </div>
      {/* </Card> */}
    </div>
  );
}
