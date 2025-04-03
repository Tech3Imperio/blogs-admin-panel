import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SectionDropdown = ({
  SectionIndex,
  addInBetween,
}: {
  SectionIndex: number;
  addInBetween: (index: number, inBetweenSectionName: string) => void;
}) => {
  console.log("Section index", SectionIndex);
  const [inBetweenSectionName, setInBetweenSectionName] =
    useState<string>("New Section");
  const handleChange = (newSectionName: string) => {
    setInBetweenSectionName(newSectionName);
  };
  return (
    <>
      {SectionIndex < 1 ? (
        <div className="w-[100%] mb-1 h-[0px]"></div>
      ) : (
        <div className="w-full h-[4px] opacity-0 hover:opacity-100 flex flex-row justify-center items-center relative group">
          {/* Expanding Top Border Effect */}
          <div className="absolute top-0 left-1/2 w-0 h-[1px] bg-black transition-all duration-500 group-hover:w-full group-hover:left-0"></div>
          <Dialog>
            <DialogTrigger className="w-max h-max absolute  left-1/2 translate-x-[-50%] transition-opacity opacity-0 delay-100 group-hover:opacity-100 bg-transparent">
              <PlusCircle size={16} className="bg-white rounded-full" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="!font-thin">Section Name</DialogTitle>
              </DialogHeader>
              <div className="items-center gap-4">
                <Input
                  id="newSection"
                  type="text"
                  value={inBetweenSectionName}
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
                    onClick={() =>
                      addInBetween(SectionIndex, inBetweenSectionName)
                    }
                    type="submit"
                  >
                    Save
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};
export default SectionDropdown;
