import dbConnect from "./lib/dbConnect";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  await dbConnect();
}
