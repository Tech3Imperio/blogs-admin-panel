"use client";

import { activeSection } from "@/state/proxies/activeSection";
import { useSnapshot } from "@/lib/valtio";
import { useState } from "react";
import { newBlog } from "@/state/proxies/newBlog";
import { DeleteSection } from "./DeleteSection";

const SectionNavItem: React.FC<{
  label: string;
  sectionIndex: number;
  children: React.ReactElement;
  sectionId?: string;
}> = ({ label, sectionIndex, children, sectionId }) => {
  const hideTrash = label === "Metadata" || sectionIndex === 0;
  const changeActiveSection = () => {
    activeSection.index = sectionIndex;
    activeSection.name = label;
  };
  const snap = useSnapshot(activeSection);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const deleteSection = () => {
    const sectionId = newBlog.sections[sectionIndex - 1].sectionId;
    if (sectionId) {
      const targetElement = document.getElementById(sectionId);
      if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      activeSection.index = sectionIndex - 1;
      activeSection.name = newBlog.sections[sectionIndex - 1].name;
      newBlog.sections.splice(sectionIndex, 1);
    }, 0);
  };
  return (
    <div
      className={`px-2 py-2 h-min flex flex-row justify-between items-center w-[100%] rounded-md cursor-pointer transition-colors text-xs ${
        snap.index === sectionIndex
          ? "bg-[#f4f4f4] text-[#3F3F46] text-[14px]"
          : "text-[#3F3F46] text-[14px] hover:bg-[#f4f4f4]"
      }`}
      onClick={() => {
        changeActiveSection();

        if (sectionId) {
          const targetElement = document.getElementById(sectionId);
          if (targetElement)
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-row items-center w-max h-max gap-2">
        {children}
        {label}
      </div>
      <DeleteSection
        deleteSection={deleteSection}
        isHovered={isHovered}
        hideTrash={hideTrash}
      />
    </div>
  );
};

export default SectionNavItem;
