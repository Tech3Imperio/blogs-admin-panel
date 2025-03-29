import { z } from "zod";
import { Delta } from "quill";

export enum ImagePosition {
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  NONE = "NONE",
}

export const ImageProtocol = z.object({
  src: z
    .string({
      required_error: "Image URL is required",
    })
    .min(1, { message: "URL cannot be empty" })
    .url({ message: "Invalid URL: Only Images from Cloudinary are allowed" }),
  altText: z.string({ required_error: "Alt Text is required for SEO" }),
});

export type ImageType = z.infer<typeof ImageProtocol>;

export const ImageCarouselProtocol = z.object({
  name: z.literal("ImageCarousel").default("ImageCarousel"),
  images: z.array(ImageProtocol).min(1),
  position: z.nativeEnum(ImagePosition, {
    message: "Position can be right or left only ",
  }),
});

export type ImageCarouselType = z.infer<typeof ImageCarouselProtocol>;

export const HeadingProtocol = z.object(
  {
    name: z.literal("Heading").default("Heading"),
    heading: z.instanceof(Delta).refine((delta) => delta.ops.length > 0, {
      message: "Heading content cannot be empty",
    }),
    // headingId: z
    //   .string({ required_error: "Heading ID is required" })
    //   .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    //     message: "Invalid format: Only kebab-cased-heading-ids are allowed",
    //   }),
  },
  { required_error: "Heading is missing" }
);

export type HeadingType = z.infer<typeof HeadingProtocol>;

export const SubHeadingProtocol = z.object(
  {
    name: z.literal("SubHeading").default("SubHeading"),
    subHeading: z.instanceof(Delta).refine((delta) => delta.ops.length > 0, {
      message: "Sub-Heading content cannot be empty",
    }),
  },
  { required_error: "Sub-Heading is missing" }
);

export type SubHeadingType = z.infer<typeof SubHeadingProtocol>;

export const BodyProtocol = z.object(
  {
    name: z.literal("Body").default("Body"),
    body: z.instanceof(Delta).refine((delta) => delta.ops.length > 0, {
      message: "Body content cannot be empty",
    }),
    hasImages: z.boolean().default(false),
    bodyImages: ImageCarouselProtocol.nullable(),
  },
  { required_error: "Body is Required" }
);

export type BodyType = z.infer<typeof BodyProtocol>;

export const TableProtocol = z
  .object({
    name: z.literal("Table").default("Table"),
    columns: z
      .array(z.string().min(1, "Column name cannot be empty")) // Columns must have names
      .min(1, "At least one column is required"),
    rows: z
      .array(
        z
          .array(z.string().optional()) // Cells can be empty
          .min(1, "Each row must have at least one cell") // Ensures no empty rows
      )
      .min(1, "At least one row is required"),
  })
  .superRefine((data, ctx) => {
    const columnLength = data.columns.length;

    data.rows.forEach((row, index) => {
      if (row.length !== columnLength) {
        ctx.addIssue({
          code: "custom",
          message: `Row ${index + 1} must have exactly ${columnLength} cells`,
          path: ["rows", index], // Highlights the incorrect row
        });
      }
    });
  });

export type TableType = z.infer<typeof TableProtocol>;

export const SectionProtocol = z.object({
  name: z.string({ required_error: "Section should have a name" }),
  sectionId: z
    .string({ required_error: "Section ID is required" })
    .uuid({ message: "Not uuid" }),
  subSections: z
    .array(
      z.union([
        HeadingProtocol.required(),
        BodyProtocol.required(),
        SubHeadingProtocol,
        // TableProtocol,
        ImageCarouselProtocol,
      ])
    )
    .min(2, { message: "At least one heading and one body are required" })
    .refine((subSections) => subSections.some((s) => s?.name === "Heading"), {
      message: "At least one heading is required",
    })
    .refine((subSections) => subSections.some((s) => s?.name === "Body"), {
      message: "At least one body is required",
    }),
});

export type SectionType = z.infer<typeof SectionProtocol>;
