import { z } from "zod";

export const BlogMetadataProtocol = z.object(
  {
    title: z
      .string({ required_error: "Title cannnot be empty" })
      .min(1, { message: "Title is required" }),
    description: z
      .string({ required_error: "Description cannnot be empty" })
      .min(1, { message: "Description is required" }),
    image: z.object({
      src: z
        .string({ required_error: "URL cannnot be empty" })
        .url("Invalid image URL"),
      alt: z
        .string({ required_error: "Alt Text cannnot be empty" })
        .min(1, { message: "Alt Text is required" }),
    }),
    blogSlug: z
      .string({ required_error: "Please add kebab-cased-slugs" })
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
        message:
          "Invalid format: Only lowercase letters, numbers, and hyphens allowed",
      }),
  },
  { required_error: "Metadata is required" }
);

export type BlogMetadataType = z.infer<typeof BlogMetadataProtocol>;

export const BlogSlugProtocol = z.object({
  blogSlug: z
    .string({ required_error: "Please add kebab-cased-slugs" })
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
      message:
        "Invalid format: Only lowercase letters, numbers, and hyphens allowed",
    }),
});

export type BlogSlugType = z.infer<typeof BlogSlugProtocol>;
