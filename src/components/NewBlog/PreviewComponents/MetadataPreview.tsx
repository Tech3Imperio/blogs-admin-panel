import React from "react";
import { BlogMetadataType } from "@/models/blogs/metadata/BlogMetadata";
import Image from "next/image";
import { NoImage } from "@/assets/NoImage";

const MetadataPreview = ({ metadata }: { metadata: BlogMetadataType }) => {
  return (
    <div
      className="relative w-full h-[360px] overflow-hidden rounded-br-3xl rounded-bl-3xl shrink-0"
      id="metadata"
    >
      {/* Image as background */}
      <Image
        src={metadata.image.src === "" ? NoImage : metadata.image.src}
        alt={metadata.image.alt}
        width={1200}
        height={360}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-br-3xl rounded-bl-3xl"
        priority
      />

      {/* Overlay with text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/5 p-10">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          {metadata.title}
        </h1>
        <p className="text-lg text-gray-200 drop-shadow-md">
          {metadata.description}
        </p>
      </div>
    </div>
  );
};

export default MetadataPreview;
