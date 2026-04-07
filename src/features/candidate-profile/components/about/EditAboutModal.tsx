"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateCandidateBio } from "../../services/profile-client-service";

interface EditAboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultVal: string;
}
export function EditAboutModal({
  open,
  onOpenChange,
  defaultVal,
}: EditAboutModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const [bio, setBio] = useState(defaultVal);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setBio(defaultVal);
    }
  }, [defaultVal, open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedBio = bio.trim();

    if (!normalizedBio) {
      toast.error("Please enter your about information.");
      return;
    }

    if (!session?.accessToken) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateCandidateBio({
        bio: normalizedBio,
        locale,
        token: session.accessToken,
      });

      toast.success(response?.message ?? "About updated successfully.");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update about information.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-175 flex-col gap-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-[28px] text-black">
              Edit About
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground -mt-2 text-sm">
            You can write about your years of experience, industry, or skills.
            People also talk about their achievements or previous job
            experiences
          </DialogDescription>

          <Textarea
            className="bg-muted min-h-40 rounded-2xl p-4"
            placeholder="Write a short summary about your experience, skills, and achievements."
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />

          <DialogFooter className="flex justify-center!">
            <Button
              className="w-1/3"
              size={"pill"}
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
