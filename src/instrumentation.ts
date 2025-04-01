import dbConnect from "./lib/dbConnect";

export async function register() {
  console.log("In instrumentation");
  await dbConnect();
}
