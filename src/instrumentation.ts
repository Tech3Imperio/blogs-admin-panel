import dbConnect from "./lib/dbConnect";

export async function register() {
  console.log("In instrumentation");
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  await dbConnect();
}
