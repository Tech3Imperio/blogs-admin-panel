import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { useTheme } from "next-themes";

export function DeleteSubSection({
  deleteSubSection,
  subSectionIndex,
  position,
}: {
  deleteSubSection: (index: number) => void;
  subSectionIndex: number;
  position: string;
}) {
  const { theme } = useTheme();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Trash
          size={14}
          className={`${
            theme === "light" ? "hover:bg-gray-300" : "hover:bg-gray-500"
          } rounded-full cursor-pointer ${position}`}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-medium">Confirm Delete</DialogTitle>
          <DialogDescription>
            The Sub Section Will be deleted. It cannot be undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="!justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteSubSection(subSectionIndex)}
              size="sm"
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
