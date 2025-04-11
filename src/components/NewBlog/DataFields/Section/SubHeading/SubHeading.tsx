import React from "react";
import { z } from "zod";
import { useEffect } from "react";
import {
  SubHeadingType,
  SubHeadingProtocol,
} from "@/models/blogs/sections/BlogSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Delta } from "quill";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import QuillEditor from "../../QuillEditior";
import { newBlog } from "@/state/proxies/newBlog";
import SubSectionDropdown from "../SubSectionDropdown";
import { DeleteSubSection } from "../../DeleteSubSection";
import { useTheme } from "next-themes";
const SubHeading = ({
  subSection,
  subSectionIndex,
  deleteSubSection,
  addInBetween,
}: {
  subSection: SubHeadingType;
  subSectionIndex: number;
  deleteSubSection: (index: number) => void;
  addInBetween: {
    body: (index: number) => void;
    subHeading: (index: number) => void;
    imageCarousel: (index: number) => void;
  };
}) => {
  const form = useForm<z.infer<typeof SubHeadingProtocol>>({
    resolver: zodResolver(SubHeadingProtocol),
    mode: "onBlur",
    defaultValues: subSection ?? {
      name: "SubHeading",
      subHeading: new Delta().insert("SubHeading"),
    },
  });
  useEffect(() => {
    form.reset(subSection); // Reset form with new values when subSection changes
  }, [subSection, form]);
  console.log(subSectionIndex);
  const updateSubHeading = <T extends keyof typeof subSection>(
    fieldName: T,
    value: (typeof subSection)[T]
  ) => {
    subSection[fieldName] = value;
    console.log("Value for SubHeading", value);
    console.log("New Blog", newBlog);
  };
  const { theme } = useTheme();
  return (
    <div className="flex relative flex-col w-[100%] mb-4">
      <SubSectionDropdown
        subSectionIndex={subSectionIndex}
        addInBetween={addInBetween}
      />
      <div
        className={`flex relative flex-col w-[100%] px-4 pt-4 bg-datafield-${theme} shadow-md rounded-lg`}
      >
        {subSectionIndex !== 0 && subSectionIndex !== 1 ? (
          <DeleteSubSection
            subSectionIndex={subSectionIndex}
            deleteSubSection={deleteSubSection}
            position="absolute top-5 right-4"
          />
        ) : (
          <></>
        )}
        <Form {...form}>
          <form className="space-y-1">
            <FormField
              control={form.control}
              name="subHeading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">Sub-Heading</FormLabel>
                  <FormControl>
                    <QuillEditor
                      subSection="subHeading"
                      value={field.value}
                      onBlur={async (deltaValue: Delta) => {
                        // const isValid = await form.trigger("heading");
                        // if (isValid) {
                        console.log(
                          "send sub heading for updation",
                          deltaValue
                        );
                        updateSubHeading("subHeading", deltaValue);
                        // }
                      }}
                    />
                  </FormControl>
                  <div className="min-h-4 px-1 !mt-1">
                    <FormMessage className="text-[12px] m-0" />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SubHeading;
