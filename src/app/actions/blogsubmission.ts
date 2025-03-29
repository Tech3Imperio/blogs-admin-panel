"use server";

import { z } from "zod";
import TestBlog from "@/models/test";
import { redirect } from "next/navigation";

const blogFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title cannot be more than 200 characters" }),
  description: z.string().min(1, { message: "Description is required" }),
  keywords: z
    .array(z.string().min(1, { message: "Keyword cannot be empty" }))
    .min(1, { message: "Atleast one Keyword is required" }),
  urlId: z.string().min(1, "URL ID is required"),
});

type BlogFormData = {
  title: string;
  description: string;
  keywords: string[];
  urlId: string;
};

export const submitBlog = async (formData: BlogFormData) => {
  const validatedFields = blogFormSchema.safeParse({
    title: formData.title,
    description: formData.description,
    urlId: formData.urlId,
    keywords: formData.keywords,
  });
  if (!validatedFields.success) {
    console.log({
      errors: validatedFields.error.flatten().fieldErrors,
    });
  } else {
    console.log("From server for submission", formData);
  }

  const newBlog = new TestBlog({ ...formData });
  await newBlog.save();
  redirect("/");
};
