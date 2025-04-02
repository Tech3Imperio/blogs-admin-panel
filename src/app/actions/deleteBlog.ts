"use server";

import SelectiveSystemsBlog from "@/models/blogs/Blog";

export const deleteBlog = async (blogSlug: string) => {
  try {
    console.log("Deleting Blog", blogSlug);
    const deletedBlog = await SelectiveSystemsBlog.findOneAndDelete({
      "metadata.blogSlug": blogSlug,
    });
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
