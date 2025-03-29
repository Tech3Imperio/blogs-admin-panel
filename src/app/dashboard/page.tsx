import { redirect } from "next/navigation";

const Page = () => {
  return redirect(`/dashboard/all-blogs`);
};

export default Page;
