import React, { useEffect, useState } from "react";
import SectionNavItem from "./SectionNavComponents/SectionNavItem";
import { Code, Plus } from "lucide-react";
import { newBlog } from "@/state/proxies/newBlog";
import { SectionType } from "@/models/blogs/sections/BlogSection";
import { useSnapshot } from "@/lib/valtio";
import { Delta } from "quill";
import { activeSection } from "@/state/proxies/activeSection";
import { v4 as uuid } from "uuid";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import SectionNavDND from "./SectionNavComponents/SectionNavDND";
import { useTheme } from "next-themes";
const SectionsNavBar = () => {
  const { theme } = useTheme();
  const snap = useSnapshot(newBlog);
  const [newSectionName, setNewSectionName] = useState<string>("New Section");
  useEffect(() => {
    setNewSectionName("New Section");
  }, [snap.sections.length]);
  const newSection: SectionType = {
    name: newSectionName,
    sectionId: uuid(),
    subSections: [
      {
        name: "Heading",
        heading: new Delta().insert("Heading"),
        // headingId: "",
      },
      {
        name: "Body",
        body: new Delta().insert("Body"),
        hasImages: false,
        bodyImages: null,
      },
    ],
  };
  const handleChange = (newSectionName: string) => {
    setNewSectionName(newSectionName);
  };
  const addSection = () => {
    newBlog.sections.push(newSection);
    activeSection.index = newBlog.sections.length - 1;
    activeSection.name = newSectionName;
    setTimeout(() => {
      const sectionId = newBlog.sections[activeSection.index].sectionId;
      if (sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };
  const addSectionInBetween = (index: number, inBetweenSectionName: string) => {
    const newInBetweenSection: SectionType = {
      name: inBetweenSectionName,
      sectionId: uuid(),
      subSections: [
        {
          name: "Heading",
          heading: new Delta().insert("Heading"),
          // headingId: "",
        },
        {
          name: "Body",
          body: new Delta().insert("Body"),
          hasImages: false,
          bodyImages: null,
        },
      ],
    };
    newBlog.sections.splice(index, 0, newInBetweenSection);
    activeSection.index = index;
    activeSection.name = inBetweenSectionName;
    setTimeout(() => {
      const sectionId = newBlog.sections[index].sectionId;
      if (sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };
  return (
    <div className="flex flex-col max-w-[12.5%] min-w-[12.5%] px-4 pt-4 border-r-[0.5px] max-h-[100%]">
      <div
        className={`flex items-center text-[14px] h-[32px] text-${theme} pl-2`}
      >
        Sections
      </div>
      <div className="flex flex-col">
        <SectionNavItem
          label="Metadata"
          sectionIndex={-1}
          sectionId="metadata"
          addInBetween={addSectionInBetween}
        >
          <Code size={14} />
        </SectionNavItem>
        <SectionNavDND
          sections={newBlog.sections}
          addSectionInBetween={addSectionInBetween}
        />
        <Dialog>
          <DialogTrigger asChild>
            <div
              className={`px-2 py-2 gap-2 mt-1 h-min flex flex-row justify-start items-center w-[100%] bg-primary-${theme} rounded-md cursor-pointer transition-colors text-xs text-${theme} text-[14px] hover-bg-${theme}`}
            >
              <Plus size={14} />
              Add Section
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="!font-thin">Section Name</DialogTitle>
            </DialogHeader>
            <div className="items-center gap-4">
              <Input
                id="newSection"
                type="text"
                value={newSectionName}
                onChange={(e) => {
                  handleChange(e.target.value);
                }}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="default"
                  size="sm"
                  onClick={addSection}
                  type="submit"
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SectionsNavBar;
