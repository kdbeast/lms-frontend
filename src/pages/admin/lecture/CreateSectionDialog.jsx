import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCreateSectionMutation } from "@/features/api/sectionApi";

const CreateSectionDialog = ({ courseId }) => {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  const [createSection, { isLoading }] = useCreateSectionMutation();

  const handleCreateSection = async () => {
    if (!title) return toast.error("Section title required");

    const res = await createSection({
      sectionTitle: title,
      courseId,
    });

    if (res?.data?.success) {
      toast.success(res.data.message);
      setTitle("");
      setOpen(false);
    } else {
      toast.error(res.error?.data?.message || "Failed to create section");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add Section</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Section</DialogTitle>
        </DialogHeader>

        <Input
          value={title}
          placeholder="Ex. Introduction"
          onChange={(e) => setTitle(e.target.value)}
        />

        <DialogFooter>
          <Button
            disabled={isLoading || !title}
            className="cursor-pointer"
            onClick={handleCreateSection}
          >
            {isLoading ? "Creating..." : "Create Section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSectionDialog;
