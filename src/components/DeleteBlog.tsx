"use client";
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
// import { Trash } from "lucide-react";
import { deleteBlog } from "@/app/actions/deleteBlog";

export function DeleteBlog({ blogSlug }: { blogSlug: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          {/* <Trash className="!w-[12px] !h-[12px] " /> */}
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-medium">Confirm Delete</DialogTitle>
          <DialogDescription>
            The Blog Will be deleted. It cannot be undone
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
              onClick={async () => {
                await deleteBlog(blogSlug);
                console.log("Reached here after deletion");
                window.location.reload();
              }}
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
