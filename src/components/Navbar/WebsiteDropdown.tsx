"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Values = {
  SELECTIVE_SYSTEMS: string;
  IMPERIO: string;
  RISE_ALLOYS: string;
};

const values: Values = {
  SELECTIVE_SYSTEMS: "Selective Systems",
  IMPERIO: "Imperio",
  RISE_ALLOYS: "Rise Alloys",
};

export function WebsiteDropdown() {
  const [position, setPosition] =
    React.useState<keyof Values>("SELECTIVE_SYSTEMS");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="min-w-44 bg-transparent shadow-none"
      >
        <Button variant="outline" className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            {values[position]}
          </div>
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Website</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={(value) => setPosition(value as keyof Values)}
        >
          <DropdownMenuRadioItem value="SELECTIVE_SYSTEMS">
            Selective Systems
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="IMPERIO">Imperio</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="RISE_ALLOYS">
            Rise Alloys
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
