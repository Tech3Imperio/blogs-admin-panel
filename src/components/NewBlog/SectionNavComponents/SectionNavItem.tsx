"use client";

import { activeSection } from "@/state/proxies/activeSection";
import { useSnapshot } from "@/lib/valtio";
import { useState } from "react";
import { newBlog } from "@/state/proxies/newBlog";
import { DeleteSection } from "../DeleteSection";
import SectionDropdown from "./SectionDropdown";
import { useSortable } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { useTheme } from "next-themes";
const SectionNavItem: React.FC<{
  label: string;
  sectionIndex: number;
  children: React.ReactElement;
  sectionId?: string;
  addInBetween: (index: number, inBetweenSectionName: string) => void;
}> = ({ label, sectionIndex, children, sectionId, addInBetween }) => {
  const { theme } = useTheme();
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: sectionId as UniqueIdentifier,
  });
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
  console.log("Checking Label", label);
  return (
    <div
      className={`flex relative flex-col w-[100%] bg-primary-${theme}`}
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <SectionDropdown
        SectionIndex={sectionIndex}
        addInBetween={addInBetween}
      />
      <div
        className={`px-2 py-2 h-min flex flex-row justify-between items-center w-[100%] rounded-md cursor-pointer transition-colors text-xs ${
          snap.index === sectionIndex
            ? `bg-${theme} text-${theme} text-[14px]`
            : `text-${theme} text-[14px] hover-bg-${theme}`
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
        <div className="flex flex-row justify-start items-center w-full h-max gap-2">
          {children}
          <div className="w-full truncate">{label}</div>
        </div>
        <div className="w-max h-max flex flex-row gap-2">
          <DeleteSection
            deleteSection={deleteSection}
            isHovered={isHovered}
            hideTrash={hideTrash}
          />
          {sectionIndex !== -1 && (
            <div
              {...attributes}
              {...listeners}
              style={{
                cursor: "grab",
                display: "flex",
                alignItems: "center",
              }}
            >
              <GripVertical size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionNavItem;
