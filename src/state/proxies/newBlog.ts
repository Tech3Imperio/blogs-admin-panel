import { BlogType } from "@/models/blogs/Blog";
import Delta from "quill-delta";
import { proxy } from "valtio";
import { v4 as uuid } from "uuid";

export const defaultBlog: BlogType = {
  isDraft: true,
  metadata: {
    title: "",
    description: "",
    image: {
      src: "",
      alt: "",
    },
    blogSlug: "",
  },
  sections: [
    {
      name: "Section 1",
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
    },
  ],
};
export const newBlog: BlogType = proxy({ ...defaultBlog });
