import { HeadingType } from "@/models/blogs/sections/BlogSection";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.bubble.css";
// import { Delta } from "quill";
const Quill = dynamic(() => import("react-quill-new"), { ssr: false });
const HeadingPreview = ({ subSection }: { subSection: HeadingType }) => {
  return (
    <div className="w-full h-max flex flex-row justify-start items-center">
      <Quill
        value={subSection.heading} // Directly pass the Delta object
        readOnly={true} // Prevent user editing
        theme="bubble"
        className="no-padding-quill heading-quill"
      />
    </div>
  );
};

export default HeadingPreview;
