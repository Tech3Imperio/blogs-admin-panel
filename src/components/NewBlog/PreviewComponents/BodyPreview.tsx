import { BodyType } from "@/models/blogs/sections/BlogSection";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.bubble.css";
import ImageCarouselPreview from "./ImageCarouselPreview";
const Quill = dynamic(() => import("react-quill-new"), { ssr: false });
const BodyPreview = ({ subSection }: { subSection: BodyType }) => {
  return (
    <>
      {subSection.hasImages ? (
        <div className="body-preview-wrapper w-full h-max">
          {subSection.bodyImages!.position === "LEFT" && (
            <div className="mr-4 mb-4 float-left">
              <ImageCarouselPreview
                images={subSection.bodyImages!.images}
                bodyImages={true}
              />
            </div>
          )}

          {subSection.bodyImages!.position === "RIGHT" && (
            <div className="ml-4 mb-4 float-right">
              <ImageCarouselPreview
                images={subSection.bodyImages!.images}
                bodyImages={true}
              />
            </div>
          )}

          <Quill
            value={subSection.body}
            readOnly={true}
            theme="bubble"
            className="no-padding-quill body-quill"
          />
        </div>
      ) : (
        <div className="w-full h-max">
          <Quill
            value={subSection.body}
            readOnly={true}
            theme="bubble"
            className="no-padding-quill body-quill"
          />
        </div>
      )}
    </>
  );
};

export default BodyPreview;
