import React from "react";
import { ImageType } from "@/models/blogs/sections/BlogSection";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { NoImage } from "@/assets/NoImage";

interface ImageCarouselPreviewProps {
  images: ImageType[];
  bodyImages: boolean;
}

const ImageCarouselPreview: React.FC<ImageCarouselPreviewProps> = ({
  images,
  bodyImages,
}) => {
  if (bodyImages) {
    return (
      <div className="min-w-max min-h-max max-w-max max-h-max flex flex-wrap gap-2 rounded-lg">
        <Carousel className="w-full max-w-xs rounded-lg">
          <CarouselContent className="rounded-lg">
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-0 rounded-lg overflow-hidden">
                    <Image
                      key={index}
                      src={image.src === "" ? NoImage : image.src}
                      alt={image.altText}
                      width={360} // Adjust width // Adjust height
                      height={360}
                      className="aspect-square"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute flex flex-row h-[32px] w-full gap-2 justify-center items-center bottom-2">
            <div className="relative w-max h-max">
              <CarouselPrevious className="relative top-4 left-0" />
            </div>
            <div className="relative w-max h-max">
              <CarouselNext className="relative top-4 right-0" />
            </div>
          </div>
        </Carousel>
      </div>
    );
  } else {
    return (
      <div className="min-w-full min-h-max max-w-full max-h-max flex flex-wrap gap-2 rounded-lg">
        <Carousel className="w-full rounded-lg">
          <CarouselContent className="rounded-lg w-full">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-7">
                <Card className="w-full h-max">
                  <CardContent className="flex items-center justify-center p-0 w-full h-max rounded-lg overflow-hidden">
                    <div className="relative w-full h-[360px] overflow-hidden rounded-br-lg rounded-bl-lg shrink-0">
                      <Image
                        key={index}
                        src={image.src === "" ? NoImage : image.src}
                        alt={image.altText}
                        width={1200}
                        height={360}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-br-lg rounded-bl-lg"
                        priority
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute flex flex-row h-[32px] w-full gap-2 justify-center items-center bottom-2">
            <div className="relative w-max h-max">
              <CarouselPrevious className="relative top-4 left-0" />
            </div>
            <div className="relative w-max h-max">
              <CarouselNext className="relative top-4 right-0" />
            </div>
          </div>
        </Carousel>
      </div>
    );
  }
};

export default ImageCarouselPreview;

{
  /* {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.altText}
            width={360} // Adjust width // Adjust height
            height={360}
            className="aspect-square"
            style={{ objectFit: "cover" }}
            priority
          />
        ))} */
}
