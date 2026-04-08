"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { saveSkillsAction } from "../../actions/skills-actions";
import {
  getSkillOptions,
  getUserSkills,
  type SkillOption,
} from "../../services/skills-client-service";
import { MultiSelectInputSkills } from "./MultiSelectInputSkills";

interface AddSkillsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (skills: string[]) => void;
}

export function AddSkillsModal({ open, onOpenChange, onSave }: AddSkillsModalProps) {
  const locale = useLocale();
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const [options, setOptions] = useState<SkillOption[]>([]);
  const [currentSkillLabels, setCurrentSkillLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    if (!open || !session?.accessToken) {
      return;
    }

    const loadSkills = async () => {
      try {
        setIsLoading(true);
        const [availableSkills, currentSkills] = await Promise.all([
          getSkillOptions({ locale, token: session.accessToken }),
          getUserSkills({ locale, token: session.accessToken }),
        ]);

        if (!ignore) {
          setOptions(availableSkills);
          setCurrentSkillLabels(currentSkills.map((skill) => skill.label));
          setSelected([]);
        }
      } catch (error) {
        if (!ignore) {
          const message =
            error instanceof Error ? error.message : "Failed to load skills.";
          toast.error(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadSkills();

    return () => {
      ignore = true;
    };
  }, [locale, open, session?.accessToken]);

  const availableLabels = useMemo(
    () => options.map((skill) => skill.label),
    [options],
  );

  const toggle = (skill: string) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const remove = (skill: string) => {
    setSelected((prev) => prev.filter((s) => s !== skill));
  };

  const handleAdd = async () => {
    try {
      setIsSaving(true);
      const selectedIds = selected
        .map((label) => options.find((skill) => skill.label === label)?.id ?? null)
        .filter((id): id is string => Boolean(id));

      const existingLabelSet = new Set(currentSkillLabels);
      const newLabels = selected.filter((label) => !existingLabelSet.has(label));

      await saveSkillsAction({
        skillIds: selectedIds,
        locale,
      });

      toast.success("Skills added successfully.");
      onSave([...currentSkillLabels, ...newLabels]);
      handleClose(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add skills.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setSelected([]);
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-150 gap-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-black">Add Skills</DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <label className="font-semibold">Skill</label>
          <MultiSelectInputSkills
            selected={selected}
            onSelect={toggle}
            onRemove={remove}
            options={availableLabels}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm">Suggested based on your profile</p>
          <div className="bg-[#09760A05] flex flex-wrap gap-2 rounded-xl p-3">
            {availableLabels.map((skill) => {
              const isSelected = selected.includes(skill);
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
          </div>
        </div>

        <div className="flex justify-center pt-1">
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0 || isLoading || isSaving}
            className="rounded-full px-10"
          >
            {isSaving ? "Saving..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
