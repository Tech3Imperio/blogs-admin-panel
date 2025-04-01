// app/api/blogs/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Import the dbConnect function
// GET API to fetch all blogs
export async function GET() {
  try {
    console.log("Entered Try block");
    const status = await dbConnect(); // Ensure MongoDB connection is established
    console.log("Status is", status);
    return NextResponse.json(status);
  } catch (error) {
    console.log(JSON.parse(JSON.stringify(error)));
    return NextResponse.error();
  }
}
