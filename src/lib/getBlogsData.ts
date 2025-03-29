"use server";
import SelectiveSystemsBlog from "@/models/blogs/Blog";
export async function getAllBlogs() {
  try {
    const blogsData = await SelectiveSystemsBlog.find().lean();
    return JSON.parse(JSON.stringify(blogsData));
  } catch (error) {
    console.log("Error connecting to MongoDB here", error);
    return error;
  }
}

// export async function getAllDrafts() {
//   try {
//     const draftsData = await SelectiveSystemsDrafts.find().lean();
//     return JSON.parse(JSON.stringify(draftsData));
//   } catch (error) {
//     console.log("Error connecting to MongoDB", error);
//     return error;
//   }
// }
