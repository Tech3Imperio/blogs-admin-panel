import React, { useEffect, useState } from "react";
import { newBlog } from "@/state/proxies/newBlog";
import Heading from "./Heading/Heading";
import Body from "./Body/Body";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageCarousel from "./ImageCarousel/ImageCarousel";
import {
  BodyType,
  ImageCarouselType,
  ImagePosition,
  SubHeadingType,
} from "@/models/blogs/sections/BlogSection";
import { Delta } from "quill";
import SubHeading from "./SubHeading/SubHeading";
import { useTheme } from "next-themes";
const SectionFields = ({
  activeSectionIndex,
}: {
  activeSectionIndex: number;
}) => {
  const [difference, setDifference] = useState<number>(
    window.innerHeight - 133
  );
  useEffect(() => {
    const handleResize = () => {
      setDifference(window.innerHeight - 133);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { theme } = useTheme();
  const sectionToDisplay = newBlog.sections[activeSectionIndex];
  console.log("Solving last error", sectionToDisplay);
  const [subSectionsCount, setSubSectionsCount] = useState<number>(
    sectionToDisplay.subSections.length
  );
  useEffect(() => {
    console.log(subSectionsCount);
  }, [activeSectionIndex, subSectionsCount]);
  const addSubHeading = () => {
    sectionToDisplay.subSections.push({
      name: "SubHeading",
      subHeading: new Delta().insert("Sub Heading"),
    });
    setSubSectionsCount((prev) => prev + 1);
  };
  const addBody = () => {
    sectionToDisplay.subSections.push({
      name: "Body",
      body: new Delta().insert("Body"),
      hasImages: false,
      bodyImages: null,
    });
    setSubSectionsCount((prev) => prev + 1);
  };

  const addImageCarousel = () => {
    sectionToDisplay.subSections.push({
      name: "ImageCarousel",
      images: [
        {
          src: "",
          altText: "",
        },
      ],
      position: ImagePosition.NONE,
    });
    setSubSectionsCount((prev) => prev + 1);
  };
  const addSubHeadingInBetween = (index: number) => {
    const newHeading: SubHeadingType = {
      name: "SubHeading",
      subHeading: new Delta().insert("Sub Heading"),
    };
    sectionToDisplay.subSections.splice(index, 0, newHeading);
    setSubSectionsCount((prev) => prev + 1);
  };
  const addBodyInBetween = (index: number) => {
    const newBody: BodyType = {
      name: "Body",
      body: new Delta().insert("Body"),
      hasImages: false,
      bodyImages: null,
    };
    sectionToDisplay.subSections.splice(index, 0, newBody);
    setSubSectionsCount((prev) => prev + 1);
  };
  const addImageCarouselInBetween = (index: number) => {
    const newCarousel: ImageCarouselType = {
      name: "ImageCarousel",
      images: [
        {
          src: "",
          altText: "",
        },
      ],
      position: ImagePosition.NONE,
    };
    sectionToDisplay.subSections.splice(index, 0, newCarousel);
    setSubSectionsCount((prev) => prev + 1);
  };
  const deleteSubSection = (index: number) => {
    sectionToDisplay.subSections.splice(index, 1);
    setSubSectionsCount((prev) => prev + 1);
  };
  const addInBetween = {
    subHeading: addSubHeadingInBetween,
    body: addBodyInBetween,
    imageCarousel: addImageCarouselInBetween,
  };
  return (
    <div className="flex flex-col justify-start items-center gap-6 flex-grow w-[100%] h-full mt-4">
      <div
        style={{
          maxHeight: difference,
        }}
        className="flex flex-col justify-start items-center flex-grow w-max-full w-full overflow-auto px-4  scrollbar-none pb-16 rounded-lg"
      >
        {sectionToDisplay.subSections.map((subSection, index) => {
          if (subSection.name === "Heading") {
            return (
              <Heading
                subSection={subSection}
                subSectionIndex={index}
                key={index}
                deleteSubSection={deleteSubSection}
              />
            );
          } else if (subSection.name === "Body") {
            return (
              <Body
                subSection={subSection}
                subSectionIndex={index}
                deleteSubSection={deleteSubSection}
                key={index}
                addInBetween={addInBetween}
              />
            );
          } else if (subSection.name === "ImageCarousel") {
            return (
              <ImageCarousel
                subSection={subSection}
                subSectionIndex={index}
                deleteSubSection={deleteSubSection}
                key={index}
                addInBetween={addInBetween}
              />
            );
          } else if (subSection.name === "SubHeading") {
            return (
              <SubHeading
                subSection={subSection}
                subSectionIndex={index}
                deleteSubSection={deleteSubSection}
                key={index}
                addInBetween={addInBetween}
              />
            );
          }
        })}
      </div>
      <div
        className={`flex flex-row w-max h-max gap-0 shadow-md rounded-full bg-toggle-${theme} overflow-hidden absolute bottom-4`}
      >
        <Button
          onClick={addSubHeading}
          size="sm"
          className="relative rounded-none pr-3 pl-3 py-3 gap-1 h-min flex flex-row justify-start items-center w-max cursor-pointer transition-colors text-xs after:content-[''] after:absolute after:right-0 after:top-1/2 after:translate-y-[-50%] after:w-[1px] after:h-1/3 after:bg-[#bbbbbb]"
        >
          <Plus className="!w-[14px] !h-[14px]" />
          Sub-Heading
        </Button>

        <Button
          onClick={addBody}
          size="sm"
          className="relative rounded-none px-3 py-3 gap-1 h-min flex flex-row justify-start items-center w-max cursor-pointer transition-colors text-xs after:content-[''] after:absolute after:right-0 after:top-1/2 after:translate-y-[-50%] after:w-[1px] after:h-1/3 after:bg-[#bbbbbb]"
        >
          <Plus className="!w-[14px] !h-[14px]" />
          Body
        </Button>

        <Button
          onClick={addImageCarousel}
          size="sm"
          className="relative rounded-none px-3 py-3 gap-1 h-min flex flex-row justify-start items-center w-max cursor-pointer transition-colors text-xs after:content-[''] after:absolute after:right-0 after:top-1/2 after:translate-y-[-50%] after:w-[1px] after:h-1/3 after:bg-[#bbbbbb]"
        >
          <Plus className="!w-[14px] !h-[14px]" />
          Images
        </Button>
        <Button
          size="sm"
          className="relative pl-3 pr-4 rounded-none py-3 gap-1 h-min flex flex-row justify-start items-center w-max cursor-pointer transition-colors text-xs"
        >
          <Plus className="!w-[14px] !h-[14px]" />
          Table
        </Button>
      </div>
    </div>
  );
};

export default SectionFields;
