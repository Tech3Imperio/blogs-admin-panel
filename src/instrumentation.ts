import dbConnect from "./lib/dbConnect";

export async function register() {
  console.log("In instrumentation");
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("In node js runtime");
    await dbConnect();
  }
}
