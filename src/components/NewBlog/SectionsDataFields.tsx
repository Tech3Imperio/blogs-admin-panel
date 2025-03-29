import React, { useEffect, useState } from "react";
import { useSnapshot } from "@/lib/valtio";
import { activeSection } from "@/state/proxies/activeSection";
import MetadataFields from "./DataFields/Metadata/MetadataFields";
import SectionFields from "./DataFields/Section/SectionFields";
import { PencilLine } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { newBlog } from "@/state/proxies/newBlog";
const SectionsDataFields = () => {
  const activeSnap = useSnapshot(activeSection);
  const [sectionName, setSectionName] = useState<string>(activeSnap.name);
  useEffect(() => {
    setSectionName(activeSnap.name);
  }, [activeSnap]);
  const handleChange = (newSectionName: string) => {
    setSectionName(newSectionName);
  };
  const saveSectionName = () => {
    activeSection.name = sectionName;
    newBlog.sections[activeSection.index].name = sectionName;
  };
  return (
    <div className="flex flex-col max-w-[30%] min-w-[30%] border-r-[0.5px] h-[100%]">
      <div className="flex flex-row justify-between text-[#3f3f46B5] items-center pt-4 px-4 text-[14px] h-8 box-content">
        {activeSnap.name}
        {activeSnap.name === "Metadata" ? (
          <></>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="px-2 py-0 h-8">
                <PencilLine className="cursor-pointer hover:bg-gray-200 rounded-sm !w-4 !h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="!font-thin">
                  Edit Section Name
                </DialogTitle>
              </DialogHeader>
              <div className="items-center gap-4">
                <Input
                  type="text"
                  value={sectionName}
                  onChange={(e) => {
                    handleChange(e.target.value);
                  }}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="default" size="sm" onClick={saveSectionName}>
                    Save
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {activeSnap.index === -1 ? (
        <MetadataFields />
      ) : (
        <SectionFields activeSectionIndex={activeSnap.index} />
      )}
    </div>
  );
};

export default SectionsDataFields;
