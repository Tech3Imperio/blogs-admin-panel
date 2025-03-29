import mongoose, { Schema, model } from "mongoose";
// import { Delta } from "quill";
import { ImageCarouselType } from "./sections/BlogSection";
import { SectionType } from "./sections/BlogSection";
import { BlogMetadataType } from "./metadata/BlogMetadata";

// Blog Metadata Schema
const BlogMetadataSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title cannot be empty"],
  },
  description: {
    type: String,
    required: [true, "Description cannot be empty"],
  },
  image: {
    src: {
      type: String,
      required: [true, "URL cannot be empty"],
      validate: {
        validator: (url: string) =>
          /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif|svg))$/.test(url),
        message: "Invalid image URL",
      },
    },
    alt: {
      type: String,
      required: [true, "Alt Text cannot be empty"],
    },
  },
  blogSlug: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Invalid format: Only lowercase letters, numbers, and hyphens allowed",
    ],
  },
});

const ImageSchema = new mongoose.Schema({
  src: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: (value: string) => /^https?:\/\/.+/i.test(value), // URL validation regex
      message: "Invalid URL",
    },
  },
  altText: {
    type: String,
    required: [true, "Alt Text is required for SEO"],
  },
});

const ImageCarouselSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "ImageCarousel",
    enum: ["ImageCarousel"], // Enforces only "imagecarousel"
  },
  images: {
    type: [ImageSchema],
    validate: {
      validator: (arr: ImageCarouselType[]) => arr.length > 0,
      message: "At least one image is required",
    },
  },
  position: {
    type: String,
    enum: ["left", "right"], // Matches the ImagePosition enum
    required: [true, "Specify Positioning: Left or Right Only"],
  },
});

// Heading Schema
export const HeadingSchema = new Schema({
  name: {
    type: String,
    default: "Heading",
    enum: ["Heading"],
    required: true,
  },
  heading: {
    type: Schema.Types.Mixed,
    required: [true, "Heading is required"],
  },
  // headingId: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   match: [
  //     /^[a-z0-9]+(-[a-z0-9]+)*$/,
  //     "Invalid format: Only lowercase letters, numbers, and hyphens allowed",
  //   ],
  // },
});

// SubHeading Schema
export const SubHeadingSchema = new Schema({
  name: {
    type: String,
    default: "Subheading",
    enum: ["Subheading"],
    required: true,
  },
  subHeading: {
    type: Schema.Types.Mixed,
    required: [true, "Sub-Heading is required"],
  },
});

// Body Schema
export const BodySchema = new Schema({
  name: {
    type: String,
    default: "Body",
    enum: ["Body"],
    required: true,
  },
  body: {
    type: Schema.Types.Mixed, // Allows both Delta and String
    required: [true, "Body is required"],
  },
  hasImages: {
    type: Boolean,
    required: [true, "Required"],
  },
  bodyImages: {
    type: ImageCarouselSchema, // Can be ImageSchema or ImageCarouselSchema
    required: false,
  },
});

// Table Schema
export const TableSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Table",
    enum: ["Table"],
    required: true,
  },
  columns: {
    type: [String],
    required: true,
    validate: {
      validator: (columns: string[]) => columns.length > 0,
      message: "At least 1 column is required",
    },
  },
  rows: {
    type: [[String]],
    required: true,
    validate: {
      validator: function (this: { columns: string[] }, rows: string[][]) {
        const columnLength: number = this.columns.length;
        return rows.every((row) => row.length === columnLength);
      },
      message: "Each row must have exactly as many elements as columns",
    },
    default: [[]], // Ensures at least one empty row
  },
});

// Section Schema (Supports Multiple Content Types)
const SectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sectionId: {
    type: String,
    required: true,
  },
  subSections: {
    type: [Schema.Types.Mixed],
    required: true,
  },
});

const BlogSchema = new Schema({
  metadata: {
    type: BlogMetadataSchema,
    required: true,
  },
  sections: {
    type: [SectionSchema],
    required: true,
  },
  isDraft: {
    type: Boolean,
    required: true,
  },
});

export type BlogType = {
  metadata: BlogMetadataType;
  sections: SectionType[];
  isDraft: boolean;
};

const SelectiveSystemsBlog =
  mongoose.models.SelectiveSystemsBlog ||
  model("SelectiveSystemsBlog", BlogSchema);

export default SelectiveSystemsBlog;
