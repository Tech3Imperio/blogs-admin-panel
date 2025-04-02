"use server";

import dbConnect from "@/lib/dbConnect";
import { getAllBlogs } from "@/lib/getBlogsData";
import { BlogType } from "@/models/blogs/Blog";
import SelectiveSystemsBlog from "@/models/blogs/Blog";
export const saveDraft = async (draft: BlogType) => {
  await dbConnect();
  try {
    const existingDraft = await SelectiveSystemsBlog.findOne({
      "metadata.blogSlug": draft.metadata.blogSlug,
    }).lean();
    if (existingDraft) {
      const updatedDraft = await SelectiveSystemsBlog.findOneAndUpdate(
        { "metadata.blogSlug": draft.metadata.blogSlug }, // Find by unique slug
        { ...draft }, // Update with new blog data
        { new: true, overwrite: true } // Return updated document, overwrite the entire object
      );
      console.log("Updated Successfully", updatedDraft);
      const blogsData: BlogType[] = await getAllBlogs();
      return {
        success: true,
        message: "Draft updated successfully!",
        blogs: blogsData,
      };
    } else {
      const newDraft = new SelectiveSystemsBlog(draft);
      const savedDraft = await newDraft.save();
      console.log("Draft Successfully Saved", savedDraft);
      const blogsData: BlogType[] = await getAllBlogs();
      return {
        success: true,
        message: "Draft saved successfully!",
        blogs: blogsData,
      };
    }
  } catch (error) {
    console.log("Error saving draft", JSON.parse(JSON.stringify(error)));
    return { success: false, message: "Failed to save draft" };
  }
};
