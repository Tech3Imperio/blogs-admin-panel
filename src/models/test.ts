import mongoose from "mongoose";

export interface Test extends mongoose.Document {
  title: string;
  description: string;
  urlId: string;
  keywords: string[];
}

const testSchema = new mongoose.Schema<Test>({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [200, "Title cannot be more that 200 characters"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  urlId: {
    type: String,
    required: [true, "url is required"],
  },
  keywords: {
    type: [String],
    required: [true, "keywords are required"],
    validate: {
      validator: function (value: string[]) {
        return Array.isArray(value) && value.length > 0; // ✅ Ensures at least one element
      },
      message: "At least one keyword is required",
    },
  },
});

const TestBlog =
  mongoose.models.TestBlog || mongoose.model("TestBlog", testSchema);

export default TestBlog;
