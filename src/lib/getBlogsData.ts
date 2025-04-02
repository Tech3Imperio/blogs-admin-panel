"use server";
import SelectiveSystemsBlog from "@/models/blogs/Blog";
import dbConnect from "./dbConnect";
export async function getAllBlogs() {
  try {
    await dbConnect();
    console.log("Inside getALlBlogs Try");
    const blogsData = await SelectiveSystemsBlog.find().lean();
    console.log("BlogsData in getAllBlogs", blogsData);
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
