import { useEffect, useState } from "react";
import { Delta } from "quill";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Import ReactQuill dynamically with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false, // This ensures the component only loads on the client side
});
type QuillEditorProps = {
  value: Delta;
  onBlur: (value: Delta) => void;
  subSection: "body" | "heading" | "subHeading";
};

function QuillEditor(props: QuillEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [deltaValue, setDeltaValue] = useState(props.value);

  useEffect(() => {
    setMounted(true);
    setDeltaValue(props.value);
  }, [props.value]);

  if (!mounted) {
    return null;
  }

  const headingToolbar = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ script: "sub" }, { script: "super" }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    ["link", "clean"],
  ];
  const subHeadingToolbar = [
    [{ header: [2, 3, 4, 5, 6, false] }],
    [{ script: "sub" }, { script: "super" }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    ["link", "clean"],
  ];
  const bodyToolbar = [
    [{ size: ["small", false, "large"] }],
    [{ script: "sub" }, { script: "super" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    ["link", "clean"],
  ];

  const toolbar =
    props.subSection === "heading"
      ? headingToolbar
      : props.subSection === "subHeading"
      ? subHeadingToolbar
      : bodyToolbar;

  const modules = {
    toolbar: toolbar,
  };

  const formats = [
    "header", // Headings (h1, h2, h3, etc.)
    "size", // Font size
    "bold",
    "italic",
    "underline",
    "strike", // Text styles
    "script", // Subscript & Superscript
    "color",
    "background", // Text color & background color
    "align", // Text alignment (left, center, right, justify)
    "list", // Ordered & unordered lists
    "link", // Hyperlinks
  ];

  return (
    <ReactQuill
      value={deltaValue}
      theme="snow"
      onChange={(content, delta, source, editor) => {
        setDeltaValue(editor.getContents()); // Extract Delta from editor
      }}
      onBlur={() => props.onBlur(deltaValue)}
      placeholder="Type Here"
      modules={modules}
      formats={formats}
    />
  );
}

export default QuillEditor;
