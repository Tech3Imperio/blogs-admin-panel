import dbConnect from "./lib/dbConnect";

export async function register() {
  console.log("In Instrumentation");
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("Trying dbConnect()");
    await dbConnect();
    console.log("After DB Connect");
  }
  console.log("Instrumentation End");
}
