"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  //   BreadcrumbPage,
  //   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbs } from "@/lib/genBreadCrumbs";
import { usePathname } from "next/navigation";

const NavBreadCrumb = () => {
  const pathname = usePathname();
  const [crumbs, setCrumbs] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);

  useEffect(() => {
    const breadCrumbs = generateBreadcrumbs(pathname);
    setLinks(breadCrumbs.links);
    setCrumbs(breadCrumbs.crumbs);
  }, [pathname]);

  const capitalizeFirstLetter = (str: string): string => {
    return str
      .split("-") // Split by hyphen
      .map((segment) => {
        // Capitalize the first letter of each segment if it's a word
        return isNaN(Number(segment))
          ? segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase() // Capitalize letters
          : segment; // Keep numbers unchanged
      })
      .join(" "); // Join the segments with a space
  };

  const breadCrumbs = crumbs.map((crumb: string) => {
    return capitalizeFirstLetter(crumb);
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumbs.map((breadCrumb: string, index: number) => (
          <React.Fragment key={index}>
            {index !== 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`https://blogs-admin-panel.onrender.com/${links[index]}`}
              >
                {breadCrumb}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NavBreadCrumb;
