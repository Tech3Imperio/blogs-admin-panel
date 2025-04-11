"use server";

import SelectiveSystemsBlog from "@/models/blogs/Blog";
import generateSitemap from "./generateSitemap";

export const deleteBlog = async (blogSlug: string) => {
  try {
    console.log("Deleting Blog", blogSlug);
    const deletedBlog = await SelectiveSystemsBlog.findOneAndDelete({
      "metadata.blogSlug": blogSlug,
    });
    try {
      await generateSitemap();
    } catch (error) {
      return {
        success: false,
        message: "Error Redeploying",
        error: error,
      };
    }
    return {
      success: true,
      message: "Deleted successfully!",
      deletedBlog: JSON.parse(JSON.stringify(deletedBlog)),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error Deleting Blog",
      error: JSON.parse(JSON.stringify(error)),
    };
  }
};
