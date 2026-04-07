"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import {
  createEducation,
  getCountryOptions,
  updateEducation,
} from "../../services/education-client-service";
import type { CandidateEducationViewModel } from "../../types/profile.types";

interface EducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  education?: CandidateEducationViewModel | null;
}

type FormState = {
  degree: string;
  university: string;
  countryId: string;
  startDate: string;
  endDate: string;
};

const EMPTY_FORM: FormState = {
  degree: "",
  university: "",
  countryId: "",
  startDate: "",
  endDate: "",
};

function toFormState(education?: CandidateEducationViewModel | null): FormState {
  if (!education) {
    return EMPTY_FORM;
  }

  return {
    degree: education.degree ?? "",
    university: education.university,
    countryId: education.countryId ?? "",
    startDate: education.startDate ?? "",
    endDate: education.endDate ?? "",
  };
}

export function EducationModal({
  open,
  onOpenChange,
  label,
  education,
}: EducationModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const [form, setForm] = useState<FormState>(toFormState(education));
  const [countries, setCountries] = useState<Array<{ label: string; value: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(toFormState(education));
    }
  }, [education, open]);

  useEffect(() => {
    let ignore = false;

    if (!open || countries.length > 0) {
      return;
    }

    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const items = await getCountryOptions(locale);

        if (!ignore) {
          setCountries(items.map((item) => ({ label: item.label, value: item.id })));
        }
      } catch (error) {
        if (!ignore) {
          const message =
            error instanceof Error ? error.message : "Failed to load countries.";
          toast.error(message);
        }
      } finally {
        if (!ignore) {
          setIsLoadingCountries(false);
        }
      }
    };

    void loadCountries();

    return () => {
      ignore = true;
    };
  }, [countries.length, locale, open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.degree.trim() ||
      !form.university.trim() ||
      !form.countryId ||
      !form.startDate ||
      !form.endDate
    ) {
      toast.error("Please complete all education fields.");
      return;
    }

    if (!session?.accessToken) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    if (form.endDate < form.startDate) {
      toast.error("End date must be after start date.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        degree: form.degree.trim(),
        university: form.university.trim(),
        countryId: form.countryId,
        startDate: form.startDate,
        endDate: form.endDate,
        locale,
        token: session.accessToken,
      };

      const response = education?.id
        ? await updateEducation(education.id, payload)
        : await createEducation(payload);

      toast.success(
        response?.message ??
          (education?.id
            ? "Education updated successfully."
            : "Education added successfully."),
      );
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save education.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-175">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-[28px] text-black">{label}</DialogTitle>
          </DialogHeader>

          <InputField
            id="degree"
            label="Degree"
            type="text"
            placeholder="ex: Bachelor's degree, Medicine and Surgery"
            value={form.degree}
            onChange={(event) =>
              setForm((current) => ({ ...current, degree: event.target.value }))
            }
          />

          <InputField
            id="university"
            label="University"
            type="text"
            placeholder="ex: Ain Shams University - Faculty of Medicine"
            value={form.university}
            onChange={(event) =>
              setForm((current) => ({ ...current, university: event.target.value }))
            }
          />

          <SelectInputField
            id="country"
            label="Country"
            placeholder={isLoadingCountries ? "Loading countries..." : "ex: Egypt"}
            options={countries}
            value={form.countryId}
            disabled={isLoadingCountries}
            onChange={(value) =>
              setForm((current) => ({ ...current, countryId: value }))
            }
          />

          <div className="flex items-center justify-between gap-2 max-md:flex-col">
            <InputField
              id="startDate"
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, startDate: event.target.value }))
              }
            />

            <InputField
              id="endDate"
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, endDate: event.target.value }))
              }
            />
          </div>

          <DialogFooter className="flex items-center justify-center!">
            <Button className="w-1/3" size={"pill"} type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : education?.id ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
