import dbConnect from "./lib/dbConnect";

export async function register() {
  console.log("In Instrumentation");
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  await dbConnect();
}
