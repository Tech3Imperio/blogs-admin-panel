"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CuboidIcon } from "lucide-react";
import { useRef, useEffect, useState, RefObject } from "react";
import { useSnapshot } from "@/lib/valtio";
import { SectionType } from "@/models/blogs/sections/BlogSection";
import SectionNavItem from "./SectionNavItem";
import { activeSection } from "@/state/proxies/activeSection";

// Function to reorder elements in place
const reorderInPlace = (
  arr: SectionType[],
  fromIndex: number,
  toIndex: number
) => {
  const item = arr[fromIndex];
  activeSection.index = toIndex;
  activeSection.name = item.name;
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, item);
};

// Custom Auto-Scroll Hook
const useAutoScroll = (
  containerRef: RefObject<HTMLDivElement | null>,
  isDragging: boolean
) => {
  useEffect(() => {
    if (!containerRef.current || !isDragging) return;

    let animationFrame: number;
    const container = containerRef.current;

    const scrollHandler = (e: DragEvent) => {
      if (!container) return;
      const { top, bottom } = container.getBoundingClientRect();
      const y = e.clientY;

      if (y < top + 50) {
        container.scrollBy({ top: -10, behavior: "smooth" });
      } else if (y > bottom - 50) {
        container.scrollBy({ top: 10, behavior: "smooth" });
      }

      animationFrame = requestAnimationFrame(() => scrollHandler(e));
    };

    document.addEventListener("dragover", scrollHandler);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("dragover", scrollHandler);
    };
  }, [containerRef, isDragging]);
};

const SectionNavDND = ({
  sections,
  addSectionInBetween,
}: {
  sections: SectionType[];
  addSectionInBetween: (index: number, inBetweenSectionName: string) => void;
}) => {
  const snap = useSnapshot(sections);
  const containerRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useAutoScroll(containerRef, isDragging);

  const onDragStart = () => {
    setIsDragging(true);
  };
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Find indexes based on sectionId instead of string index
    const oldIndex = snap.findIndex(
      (section) => section.sectionId === active.id
    );
    const newIndex = snap.findIndex((section) => section.sectionId === over.id);

    if (oldIndex === -1 || newIndex === -1) return; // Prevent invalid moves

    reorderInPlace(sections, oldIndex, newIndex);
    setIsDragging(false);
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col !bg-white">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={snap.map((section) => section.sectionId)} // Use sectionId as ID
          strategy={verticalListSortingStrategy}
        >
          {snap.map((section, index) => (
            <SectionNavItem
              label={section.name}
              key={index}
              sectionIndex={index}
              sectionId={section.sectionId}
              addInBetween={addSectionInBetween}
            >
              <div className="w-max">
                <CuboidIcon size={14} />
              </div>
            </SectionNavItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SectionNavDND;
