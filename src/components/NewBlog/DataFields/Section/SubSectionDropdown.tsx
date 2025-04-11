import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const SubSectionDropdown = ({
  subSectionIndex,
  addInBetween,
}: {
  subSectionIndex: number;
  addInBetween: {
    subHeading: (index: number) => void;
    body: (index: number) => void;
    imageCarousel: (index: number) => void;
  };
}) => {
  console.log("sub section index", subSectionIndex);
  const { theme } = useTheme();
  return (
    <>
      {subSectionIndex < 2 ? (
        <div className="w-[100%] mb-4 h-[0px]"></div>
      ) : (
        <div className="w-full h-[16px] opacity-0 hover:opacity-100 flex flex-row justify-center items-center relative group">
          {/* Expanding Top Border Effect */}
          <div
            className={`absolute top-0 left-1/2 w-0 h-[1px] bg-toggle-${theme}  transition-all duration-500 group-hover:w-full group-hover:left-0`}
          ></div>

          <Popover>
            <PopoverTrigger className="w-max h-max absolute bottom-1/2 left-1/2 translate-x-[-50%] transition-opacity opacity-0 delay-100 group-hover:opacity-100">
              <PlusCircle
                size={16}
                className={` bg-primary-${theme} text-${theme} rounded-full`}
              />
            </PopoverTrigger>
            <PopoverContent className="bg-none p-0 w-full flex flex-row !justify-center rounded-full">
              <div className="flex flex-row w-max h-max gap-0 shadow-md rounded-full overflow-hidden">
                <Button
                  onClick={() => addInBetween.subHeading(subSectionIndex)}
                  size="sm"
                  className="relative rounded-none pr-3 pl-3 py-3 gap-1 h-min flex flex-row justify-start items-center w-max cursor-pointer transition-colors text-xs after:content-[''] after:absolute after:right-0 after:top-1/2 after:translate-y-[-50%] after:w-[1px] after:h-1/3 after:bg-[#bbbbbb]"
                >
                  <Plus className="!w-[14px] !h-[14px]" />
                  Sub-Heading
                </Button>

                <Button
                  onClick={() => addInBetween.body(subSectionIndex)}
                  size="sm"
                  className="relative rounded-none px-3 py-3 gap-1 h-min flex flex-row justify-start items-center w-max cursor-pointer transition-colors text-xs after:content-[''] after:absolute after:right-0 after:top-1/2 after:translate-y-[-50%] after:w-[1px] after:h-1/3 after:bg-[#bbbbbb]"
                >
                  <Plus className="!w-[14px] !h-[14px]" />
                  Body
                </Button>

                <Button
                  onClick={() => addInBetween.imageCarousel(subSectionIndex)}
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
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
};
export default SubSectionDropdown;
