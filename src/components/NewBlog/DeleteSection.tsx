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

export function DeleteSection({
  deleteSection,
  hideTrash,
  isHovered,
}: {
  deleteSection: () => void;
  hideTrash: boolean;
  isHovered: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Trash
          size={14}
          className={
            hideTrash
              ? "hidden"
              : isHovered
              ? "opacity-100 hover:bg-gray-300 hover:rounded-sm"
              : "opacity-0"
          }
          onClick={(e: React.MouseEvent<SVGSVGElement>) => {
            e.stopPropagation();
          }}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-medium">Confirm Delete</DialogTitle>
          <DialogDescription>
            The Section Will be deleted. It cannot be undone
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
              onClick={deleteSection}
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
