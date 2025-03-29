"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { submitBlog } from "@/app/actions/blogsubmission";

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

const BlogForm = () => {
  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      urlId: "",
      description: "",
      keywords: ["Aluminium Windows"],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof blogFormSchema>) {
    submitBlog(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 items-center flex flex-col"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title" {...field} className="min-w-72" />
              </FormControl>
              <div className="min-h-4 px-1">
                <FormMessage className="text-[12px]" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="urlId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="URL ID" {...field} className="min-w-72" />
              </FormControl>
              <div className="min-h-4 px-1">
                <FormMessage className="text-[12px]" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  {...field}
                  className="min-w-96"
                />
              </FormControl>
              <div className="min-h-4 px-1">
                <FormMessage className="text-[12px]" />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default BlogForm;
