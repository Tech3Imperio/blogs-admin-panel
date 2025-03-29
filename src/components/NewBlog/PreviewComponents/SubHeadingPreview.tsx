import { SubHeadingType } from "@/models/blogs/sections/BlogSection";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.bubble.css";
const Quill = dynamic(() => import("react-quill-new"), { ssr: false });
const SubHeadingPreview = ({ subSection }: { subSection: SubHeadingType }) => {
  return (
    <div className="w-full h-max flex flex-row justify-start items-center">
      <Quill
        value={subSection.subHeading} // Directly pass the Delta object
        readOnly={true} // Prevent user editing
        theme="bubble"
        className="no-padding-quill heading-quill"
      />
    </div>
  );
};

export default SubHeadingPreview;
