"use server";

import {
  OTPDetails,
  RegistrationDetails,
} from "./../../components/AuthForms/SignUpForm";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import { OTP } from "@/models/user";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tech3@imperiorailing.com",
    pass: "mznm jftq uble qxng",
  },
});

export async function generate6DigitCode(): Promise<number> {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function sendOTP(
  registrationDetails: RegistrationDetails
): Promise<boolean> {
  await dbConnect();
  let code = await generate6DigitCode();
  while (await OTP.findOne({ pin: code })) {
    code = await generate6DigitCode();
  }
  const newOTP = await new OTP({ pin: code }).save();

  console.log("newOTP", newOTP);
  try {
    const info = await transporter.sendMail({
      from: '"Aditya Bhardwaj" <tech3@imperiorailing.com>', // sender address
      to: `${registrationDetails.email}`, // list of receivers
      subject: "Blogs Admin Panel Verification OTP ", // Subject line
      text: `Your One Time Verification Pin is ${newOTP.pin}`, // plain text body
      html: `<p>Your One Time Verification Pin is ${newOTP.pin}. This verification pin will automatically expire in 5 minutes</p>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
    setTimeout(async () => {
      const otp = await OTP.findOne({ pin: code });
      if (otp) {
        await OTP.findOneAndDelete({ pin: code });
      }
    }, 300000);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export const verifyOTP = async (data: OTPDetails) => {
  const valid = await OTP.findOne({ pin: data.pin });
  if (valid) {
    await OTP.findOneAndDelete({ pin: data.pin });
    return true;
  } else {
    return false;
  }
};
