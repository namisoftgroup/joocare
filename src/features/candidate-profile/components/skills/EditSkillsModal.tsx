"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { saveSkillsAction } from "../../actions/skills-actions";

interface EditSkillsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: string[];
  onSave: (skills: string[]) => void;
}

export function EditSkillsModal({
  open,
  onOpenChange,
  skills,
  onSave,
}: EditSkillsModalProps) {
  const locale = useLocale();
  const [current, setCurrent] = useState<string[]>(skills);
  const [profileSkills, setProfileSkills] = useState<string[]>(skills);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setProfileSkills(skills);
    setCurrent(skills);
  }, [open, skills]);

  const toggle = (skill: string) => {
    setCurrent((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveSkillsAction({
        skillLabels: current,
        locale,
      });

      toast.success("Skills updated successfully.");
      onSave(current);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update skills.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-150 gap-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Skills</DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <label className="font-semibold">Skill</label>
          <div className="bg-[#09760A08] flex min-h-[60px] flex-wrap gap-2 rounded-xl p-3">
            {profileSkills.map((skill) => {
              const isSelected = current.includes(skill);

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggle(skill)}
                  className={`rounded-full border border-border px-4 py-2 text-sm transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-muted bg-white text-black hover:border-primary hover:text-primary"
                  }`}
                >
                  {skill}
                </button>
              );
            })}

            {profileSkills.length === 0 ? (
              <p className="text-muted-foreground text-sm">No skills available to edit.</p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-center pt-1">
          <Button
            onClick={handleSave}
            className="rounded-full px-10"
            disabled={isSaving || profileSkills.length === 0}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
