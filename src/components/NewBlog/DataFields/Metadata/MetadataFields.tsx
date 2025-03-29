"use client";

import React from "react";
import { newBlog } from "@/state/proxies/newBlog";
import { useSnapshot } from "@/lib/valtio";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BlogMetadataProtocol } from "@/models/blogs/metadata/BlogMetadata";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import set from "lodash/set";
const MetadataFields = () => {
  const blogSnap = useSnapshot(newBlog);
  const form = useForm<z.infer<typeof BlogMetadataProtocol>>({
    resolver: zodResolver(BlogMetadataProtocol),
    mode: "onBlur",
    defaultValues: blogSnap.metadata ?? {
      title: "",
      description: "",
      image: { src: "", alt: "" },
      blogSlug: "",
    },
  });
  const updateMetadata = (fieldName: string, value: string) => {
    set(newBlog.metadata, fieldName, value);
    console.log(newBlog.metadata);
  };
  return (
    <div className="flex flex-col w-auto mx-4 px-4 pt-4 bg-gray-50 shadow-md rounded-lg mt-4">
      <Form {...form}>
        <form className="space-y-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px]">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    type="text"
                    {...field}
                    className="placeholder:text-[12px] !mt-1 max-w-[50%]"
                    onBlur={async (e) => {
                      const isValid = await form.trigger("title"); // ✅ Returns `true` if valid

                      if (isValid) {
                        updateMetadata("title", e.target.value);
                      }
                    }}
                  />
                </FormControl>
                <div className="min-h-4 px-1 !mt-1">
                  <FormMessage className="text-[12px] m-0" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px]">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="placeholder:text-[12px] !mt-1"
                    rows={3}
                    onBlur={async (e) => {
                      const isValid = await form.trigger("description"); // ✅ Returns `true` if valid

                      if (isValid) {
                        updateMetadata("description", e.target.value);
                      }
                    }}
                  />
                </FormControl>
                <div className="min-h-4 px-1 !mt-1">
                  <FormMessage className="text-[12px]" />
                </div>
              </FormItem>
            )}
          />
          <div className="flex flex-row items-end gap-4 w-full">
            <FormField
              control={form.control}
              name="image.src"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel className="text-[13px]">Image</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter URL"
                      type="text"
                      {...field}
                      className="placeholder:text-[12px] !mt-1"
                      onBlur={async (e) => {
                        const isValid = await form.trigger("image.src"); // ✅ Returns `true` if valid

                        if (isValid) {
                          updateMetadata("image.src", e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <div className="min-h-4 px-1 !mt-1">
                    <FormMessage className="text-[12px]" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image.alt"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Alt Text"
                      type="text"
                      {...field}
                      className="placeholder:text-[12px] !mt-1"
                      onBlur={async (e) => {
                        const isValid = await form.trigger("image.alt"); // ✅ Returns `true` if valid

                        if (isValid) {
                          updateMetadata("image.alt", e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <div className="min-h-4 px-1 !mt-1">
                    <FormMessage className="text-[12px]" />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="blogSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px]">Blog Slug</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    readOnly
                    {...field}
                    className="placeholder:text-[12px] !mt-1 max-w-[50%] bg-gray-200 cursor-not-allowed"
                  />
                </FormControl>
                <div className="min-h-4 px-1 !mt-1">
                  <FormMessage className="text-[12px]" />
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default MetadataFields;
