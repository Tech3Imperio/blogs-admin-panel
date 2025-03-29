"use server";

import { z } from "zod";
import User from "@/models/user";
const allowedDomains = ["@selectivesystems.in"];
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "./../../lib/session";
import { redirect } from "next/navigation";

const AuthFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .refine(
      (email) => allowedDomains.some((domain) => email.endsWith(domain)),
      { message: `Only emails from ${allowedDomains.join(" or ")} are allowed` }
    ),
  password: z
    .string()
    .min(8, { message: "Password must contain atleast 8 characters" })
    .max(20, { message: "Password must not be more that 20 characters" }),
});

type AuthFormData = {
  email: string;
  password: string;
};

export async function signin(formData: AuthFormData) {
  const validatedFields = AuthFormSchema.safeParse({
    email: formData.email,
    password: formData.password,
  });
  if (!validatedFields.success) {
    console.log({
      errors: validatedFields.error.flatten().fieldErrors,
    });
  } else {
    console.log("From server for Signin", formData);
  }
  const emailId = formData.email;
  const user = await User.findOne({ email: emailId });
  console.log("User is", user);
  if (!user) {
    console.log("User not found");
    return { success: false, message: "User not found" };
  }
  const passwordMatch = await bcrypt.compare(formData.password, user.password);

  if (!passwordMatch) {
    console.log("Invalid password");
    return { success: false, message: "Invalid credentials" };
  }

  console.log("User authenticated successfully", user);

  await createSession(user.id);
  redirect("/dashboard/all-blogs");
  // return { success: true, message: "Login successful", user: user };
}

export async function signup(formData: AuthFormData) {
  const validatedFields = AuthFormSchema.safeParse({
    email: formData.email,
    password: formData.password,
  });

  if (!validatedFields.success) {
    console.log({
      errors: validatedFields.error.flatten().fieldErrors,
    });
  } else {
    console.log("From server for Signup", formData);
  }

  const emailId = formData.email;
  const isUser = (await User.find({ email: emailId }))[0];

  if (isUser) {
    return console.log(isUser, "Email in use");
  } else {
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const newUser = new User({ email: emailId, password: hashedPassword });
    await newUser.save();
    redirect("/dashboard/all-blogs");
  }
}

export async function signout() {
  deleteSession();
  redirect("/");
}
