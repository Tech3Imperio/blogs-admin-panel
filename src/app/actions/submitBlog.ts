"use server";

import { getAllBlogs } from "@/lib/getBlogsData";
import { BlogType } from "@/models/blogs/Blog";
import SelectiveSystemsBlog from "@/models/blogs/Blog";
import generateSitemap from "./generateSitemap";
export const submitBlog = async (blog: BlogType) => {
  try {
    const existingBlog = await SelectiveSystemsBlog.findOne({
      "metadata.blogSlug": blog.metadata.blogSlug,
    }).lean();
    if (existingBlog) {
      const updatedBlog = await SelectiveSystemsBlog.findOneAndUpdate(
        { "metadata.blogSlug": blog.metadata.blogSlug }, // Find by unique slug
        { ...blog }, // Update with new blog data
        { new: true, overwrite: true } // Return updated document, overwrite the entire object
      );
      console.log("Updated Successfully", updatedBlog);
      const blogsData: BlogType[] = await getAllBlogs();
      return {
        success: true,
        message: "Blog updated successfully!",
        blogs: blogsData,
      };
    } else {
      const newBlog = new SelectiveSystemsBlog(blog);
      const savedBlog = await newBlog.save();
      try {
        await generateSitemap();
      } catch (error) {
        return {
          success: false,
          message: "Error Redeploying",
          error: error,
        };
      }
      console.log("Blog Successfully submitted", savedBlog);
      const blogsData: BlogType[] = await getAllBlogs();
      return {
        success: true,
        message: "Blog submitted successfully!",
        blogs: blogsData,
      };
    }
  } catch (error) {
    console.log("Error saving Blog", JSON.parse(JSON.stringify(error)));
    return { success: false, message: "Failed to save Blog", error: error };
  }
};
