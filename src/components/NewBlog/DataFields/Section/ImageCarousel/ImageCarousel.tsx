import React from "react";
import { z } from "zod";
import { useEffect } from "react";
import {
  ImageCarouselType,
  ImageCarouselProtocol,
} from "@/models/blogs/sections/BlogSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { newBlog } from "@/state/proxies/newBlog";
import { set } from "lodash";
import { Plus, Trash } from "lucide-react";
import SubSectionDropdown from "../SubSectionDropdown";
import { DeleteSubSection } from "../../DeleteSubSection";
const ImageCarousel = ({
  subSection,
  subSectionIndex,
  deleteSubSection,
  addInBetween,
}: {
  subSection: ImageCarouselType;
  subSectionIndex: number;
  deleteSubSection: (index: number) => void;
  addInBetween: {
    subHeading: (index: number) => void;
    body: (index: number) => void;
    imageCarousel: (index: number) => void;
  };
}) => {
  const form = useForm<z.infer<typeof ImageCarouselProtocol>>({
    resolver: zodResolver(ImageCarouselProtocol),
    mode: "onBlur",
    defaultValues: subSection ?? {
      name: "ImageCarousel",
      images: [
        {
          src: "",
          altText: "",
        },
      ],
      position: "NONE",
    },
  });
  useEffect(() => {
    form.reset(subSection); // Reset form with new values when subSection changes
  }, [subSection, form]);
  console.log(subSectionIndex);
  const updateImageCarousel = (fieldName: string, value: string) => {
    set(subSection, fieldName, value);
    console.log("Value for Heading", value);
    console.log("New Blog", newBlog);
  };
  const addImage = () => {
    console.log("Adding Images");
    try {
      subSection.images.push({ src: "", altText: "" });
      form.reset(subSection);
    } catch {
      throw new Error("Cannot Add Image");
    }
  };
  const deleteImage = (index: number) => {
    subSection.images.splice(index, 1);
    form.reset(subSection);
  };
  return (
    <div className="flex relative flex-col w-[100%] mb-4">
      <SubSectionDropdown
        subSectionIndex={subSectionIndex}
        addInBetween={addInBetween}
      />
      <div className="flex flex-col w-[100%] px-4 pt-4 bg-gray-50 shadow-md rounded-lg">
        <Form {...form}>
          <form className="space-y-1">
            <div className="flex relative flex-row gap-4 items-center justify-between mb-3">
              <FormLabel className="text-[13px]">Image Carousel</FormLabel>
              <div className="flex flex-row gap-4 items-center">
                <div
                  onClick={addImage}
                  className="px-2 py-2 gap-0 h-min flex flex-row justify-start items-center w-max rounded-md cursor-pointer transition-colors text-xs text-[#3F3F46] text-[14px] hover:bg-[#f4f4f4]"
                >
                  <Plus size={14} />
                  Add Image
                </div>
                <div className="w-max h-max">
                  <DeleteSubSection
                    subSectionIndex={subSectionIndex}
                    deleteSubSection={deleteSubSection}
                    position=""
                  />
                </div>
              </div>
            </div>
            {subSection.images.map((image, index) => {
              return (
                <div key={index} className="flex flex-row gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`images.${index}.src`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        {index === 0 ? (
                          <FormLabel className="text-[13px]">
                            Image Data
                          </FormLabel>
                        ) : (
                          <></>
                        )}
                        <FormControl>
                          <Input
                            placeholder="URL"
                            type="text"
                            {...field}
                            className="placeholder:text-[12px] !mt-1 w-[100%]"
                            onBlur={async (e) => {
                              const isValid = await form.trigger(
                                `images.${index}.src`
                              ); // ✅ Returns `true` if valid

                              if (isValid) {
                                updateImageCarousel(
                                  `images.${index}.src`,
                                  e.target.value
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <div className="min-h-4 px-1 !mt-1">
                          <FormMessage className="text-[12px] m-0" />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`images.${index}.altText`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <div className="flex flex-grow flex-row justify-between items-center gap-4">
                          <FormControl>
                            <Input
                              placeholder="ALT"
                              type="text"
                              {...field}
                              className="placeholder:text-[12px] !mt-1 w-[100%]"
                              onBlur={async (e) => {
                                const isValid = await form.trigger(
                                  `images.${index}.altText`
                                ); // ✅ Returns `true` if valid

                                if (isValid) {
                                  updateImageCarousel(
                                    `images.${index}.altText`,
                                    e.target.value
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <div
                            onClick={() => deleteImage(index)}
                            className={
                              index === 0
                                ? "hidden"
                                : "mt-1 h-min flex flex-row justify-start items-center w-max rounded-md cursor-pointer transition-colors text-xs text-[#3F3F46] text-[14px] hover:bg-[#f4f4f4]"
                            }
                          >
                            <Trash size={14} />
                          </div>
                        </div>
                        <div className="min-h-4 px-1 !mt-1">
                          <FormMessage className="text-[12px] m-0" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ImageCarousel;
