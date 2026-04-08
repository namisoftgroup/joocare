"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { saveSkillsAction } from "../../actions/skills-actions";
import {
  getUserSkills,
  type SkillOption,
} from "../../services/skills-client-service";
import type { CandidateSkillViewModel } from "../../types/profile.types";
import { MultiSelectInputSkills } from "./MultiSelectInputSkills";

interface AddSkillsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: CandidateSkillViewModel[];
  onSave: (skills: CandidateSkillViewModel[]) => void;
}

export function AddSkillsModal({
  open,
  onOpenChange,
  skills,
  onSave,
}: AddSkillsModalProps) {
  const locale = useLocale();
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const [options, setOptions] = useState<SkillOption[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<SkillOption[]>([]);
  const [currentSkills, setCurrentSkills] = useState<CandidateSkillViewModel[]>(
    [],
  );
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
        const skillsResponse = await getUserSkills({
          locale,
          token: session.accessToken,
        });

        if (!ignore) {
          setOptions(skillsResponse.skills);
          setSuggestedSkills(skillsResponse.suggested);
          setCurrentSkills(skills);
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
  }, [locale, open, session?.accessToken, skills]);

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
        .map(
          (label) => options.find((skill) => skill.label === label)?.id ?? null,
        )
        .filter((id): id is string => Boolean(id));

      const existingLabelSet = new Set(
        currentSkills.map((skill) => skill.label),
      );
      const newLabels = selected.filter(
        (label) => !existingLabelSet.has(label),
      );
      const newSkills = newLabels
        .map((label) => options.find((skill) => skill.label === label))
        .filter((skill): skill is SkillOption => Boolean(skill))
        .map((skill) => ({
          id: skill.id,
          label: skill.label,
        }));

      await saveSkillsAction({
        skillIds: selectedIds,
        locale,
      });

      toast.success("Skills added successfully.");
      onSave([...currentSkills, ...newSkills]);
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
          <DialogTitle className="text-2xl font-semibold text-black">
            Add Skills
          </DialogTitle>
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
          <div className="flex flex-wrap gap-2 rounded-xl bg-[#09760A05] p-3">
            {suggestedSkills.map((skill) => {
              const isSelected = selected.includes(skill.label);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggle(skill.label)}
                  className={`border-border rounded-full border px-4 py-2 text-sm transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-muted hover:border-primary hover:text-primary bg-white text-black"
                  }`}
                >
                  {skill.label}
                </button>
              );
            })}
            {suggestedSkills.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No suggested skills available.
              </p>
            ) : null}
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
