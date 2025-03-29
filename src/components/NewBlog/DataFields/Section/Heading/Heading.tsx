import React from "react";
import { z } from "zod";
import { useEffect } from "react";
import {
  HeadingType,
  HeadingProtocol,
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
// import { Input } from "@/components/ui/input";
import { newBlog } from "@/state/proxies/newBlog";
import { DeleteSubSection } from "../../DeleteSubSection";
const Heading = ({
  subSection,
  subSectionIndex,
  deleteSubSection,
}: {
  subSection: HeadingType;
  subSectionIndex: number;
  deleteSubSection: (index: number) => void;
}) => {
  const form = useForm<z.infer<typeof HeadingProtocol>>({
    resolver: zodResolver(HeadingProtocol),
    mode: "onBlur",
    defaultValues: subSection,
  });
  useEffect(() => {
    form.reset(subSection); // Reset form with new values when subSection changes
  }, [subSection, form]);
  console.log(subSectionIndex);
  const updateHeading = <T extends keyof typeof subSection>(
    fieldName: T,
    value: (typeof subSection)[T]
  ) => {
    subSection[fieldName] = value;
    console.log("Value for Heading", value);
    console.log("New Blog", newBlog);
  };
  return (
    <div className="flex relative flex-col w-[100%] mb-4">
      <div className="flex relative flex-col w-[100%] px-4 pt-4 bg-gray-50 shadow-md rounded-lg">
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
            {/* <FormField
              control={form.control}
              name="headingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">Heading ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="heading-id"
                      type="text"
                      {...field}
                      className="placeholder:text-[12px] !mt-1 max-w-[50%]"
                      onBlur={async (e) => {
                        const isValid = await form.trigger("headingId"); // ✅ Returns `true` if valid

                        if (isValid) {
                          updateHeading("headingId", e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <div className="min-h-4 px-1 !mt-1">
                    <FormMessage className="text-[12px] m-0" />
                  </div>
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="heading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">Heading</FormLabel>
                  <FormControl>
                    <QuillEditor
                      subSection="heading"
                      value={field.value}
                      onBlur={async (deltaValue: Delta) => {
                        // const isValid = await form.trigger("heading");
                        // if (isValid) {
                        console.log("send heading for updation", deltaValue);
                        updateHeading("heading", deltaValue);
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

export default Heading;
