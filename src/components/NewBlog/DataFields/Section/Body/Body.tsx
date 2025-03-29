import React from "react";
import { z } from "zod";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import {
  BodyType,
  BodyProtocol,
  ImagePosition,
} from "@/models/blogs/sections/BlogSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Delta } from "quill";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import set from "lodash/set";
import { Plus, Trash } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import SubSectionDropdown from "../SubSectionDropdown";
import { DeleteSubSection } from "../../DeleteSubSection";
// Then use it in your component that renders the editor
const Body = ({
  subSection,
  subSectionIndex,
  deleteSubSection,
  addInBetween,
}: {
  subSection: BodyType;
  subSectionIndex: number;
  deleteSubSection: (index: number) => void;
  addInBetween: {
    subHeading: (index: number) => void;
    body: (index: number) => void;
    imageCarousel: (index: number) => void;
  };
}) => {
  console.log("top subsection", subSection);
  const form = useForm<z.infer<typeof BodyProtocol>>({
    resolver: zodResolver(BodyProtocol),
    mode: "onBlur",
    defaultValues: subSection ?? {
      name: "Body",
      body: new Delta().insert(""),
      hasImages: false,
      bodyImages: null,
    },
  });
  useEffect(() => {
    console.log("Checking body Subsection", subSection);
    form.reset(subSection); // Reset form with new values when subSection changes
  }, [subSection, form]);
  console.log(subSectionIndex);
  const updateBody = (fieldName: string, value: string | Delta) => {
    set(subSection, fieldName, value);
    console.log("Value for Body", value);
    console.log("New Blog", newBlog);
    form.reset(subSection);
  };
  const handleHasImages = (value: boolean) => {
    if (value === false) {
      subSection.hasImages = !subSection.hasImages;
      subSection.bodyImages = {
        name: "ImageCarousel",
        images: [{ src: "", altText: "" }],
        position: ImagePosition.LEFT,
      };
    }
    if (value === true) {
      set(subSection, "hasImages", !subSection.hasImages);
      subSection.bodyImages = null;
    }
    form.reset(subSection);
  };
  const addImage = () => {
    console.log("Adding Images");
    if (subSection.bodyImages) {
      subSection.bodyImages.images.push({ src: "", altText: "" });
      form.reset(subSection);
    } else {
      throw new Error("Cannot Add Image");
    }
  };
  const deleteImage = (index: number) => {
    subSection.bodyImages?.images.splice(index, 1);
    form.reset(subSection);
  };
  return (
    <div className="flex relative flex-col w-[100%] mb-4">
      <SubSectionDropdown
        subSectionIndex={subSectionIndex}
        addInBetween={addInBetween}
      />
      <div className="flex relative flex-col w-[100%] px-4 pt-4 bg-gray-50 rounded-lg shadow-md">
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
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px]">Body</FormLabel>
                  <FormControl>
                    <QuillEditor
                      subSection="body"
                      value={field.value}
                      onBlur={async (deltaValue: Delta) => {
                        console.log(deltaValue);
                        // const isValid = await form.trigger("body");
                        // if (isValid) {
                        console.log("sent for updation", deltaValue);
                        updateBody("body", deltaValue);
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
            <div className="flex flex-row justify-center h-8 flex-grow items-center gap-2 !mb-4 !mt-1">
              <div className="flex flex-row flex-grow gap-2 justify-start items-center">
                <Label htmlFor="add-images" className="text-[13px]">
                  Images
                </Label>
                <FormField
                  control={form.control}
                  name="hasImages"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={subSection.hasImages}
                          onClick={() => handleHasImages(subSection.hasImages)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {subSection.hasImages && (
                <div
                  onClick={addImage}
                  className="px-2 py-2 gap-2 h-min flex flex-row justify-start items-center w-max rounded-md cursor-pointer transition-colors text-xs text-[#3F3F46] text-[14px] hover:bg-[#f4f4f4]"
                >
                  <Plus size={14} />
                  Add Image
                </div>
              )}
            </div>
            {subSection.hasImages && (
              <>
                <FormField
                  control={form.control}
                  name="bodyImages.position"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row gap-4 w-full items-center">
                        <FormLabel className="text-[13px]">
                          Image Position
                        </FormLabel>
                        <FormControl>
                          <ToggleGroup
                            className="flex flex-row gap-1 items-center justify-center w-max"
                            type="single"
                            variant="outline"
                            size="sm"
                            value={field.value}
                            onValueChange={async (value) => {
                              if (value) {
                                const isValid = await form.trigger(
                                  "bodyImages.position"
                                ); // Validate field
                                if (isValid) {
                                  updateBody("bodyImages.position", value);
                                }
                              }
                            }}
                          >
                            <ToggleGroupItem
                              value="LEFT"
                              style={{
                                fontSize: "12px",
                                padding: "2px 16px 2px 16px",
                              }}
                              className={
                                field.value === "LEFT"
                                  ? "!bg-black !text-white px-4 rounded-full"
                                  : "px-4 rounded-full"
                              }
                            >
                              Left
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              style={{
                                fontSize: "12px",
                                padding: "2px 16px 2px 16px",
                              }}
                              value="RIGHT"
                              className={
                                field.value === "RIGHT"
                                  ? "!bg-black !text-white px-4 rounded-full"
                                  : "px-3 rounded-full"
                              }
                            >
                              Right
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                      </div>
                      <div className="min-h-4 px-1 !mt-1">
                        <FormMessage className="text-[12px] m-0" />
                      </div>
                    </FormItem>
                  )}
                />
                {subSection.bodyImages?.images.map((image, index) => {
                  return (
                    <div key={index} className="flex flex-row gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`bodyImages.images.${index}.src`}
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
                                    `bodyImages.images.${index}.src`
                                  ); // ✅ Returns `true` if valid

                                  if (isValid) {
                                    updateBody(
                                      `bodyImages.images.${index}.src`,
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
                        name={`bodyImages.images.${index}.altText`}
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
                                      `bodyImages.images.${index}.altText`
                                    ); // ✅ Returns `true` if valid

                                    if (isValid) {
                                      updateBody(
                                        `bodyImages.images.${index}.altText`,
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
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Body;
