"use client";

import WizardProgress from "@/features/complete-account/components/wizard-progress";
import AlertModal from "@/shared/components/modals/AlertModal";
import SuccessModal from "@/shared/components/modals/SuccessModal";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  JobFormData,
  jobFormDefaults,
  jobFormSchema,
  StepIndex,
  stepSchemas,
} from "../validation/job-post-schema";
import { usePostStepOne } from "../hooks/usePostStepOne";
import { usePostStepTwo } from "../hooks/usePostStepTwo";
import { usePostStepThree } from "../hooks/usePostStepThree";
import { JobDetails } from "../types/jobs.types";
import JobPostStepOne from "./JobPostStepOne";
import JobPostStepTwo from "./JobPostStepTwo";
import JobReviewPanel from "./JobReviewPanel";
import { useRouter } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
const STEPS = ["Job Details", "Job Description & Requirements", "Job Preview"];
const LAST_STEP = STEPS.length - 1;

export default function PostJobForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<number | null>(null);
  const [reviewJob, setReviewJob] = useState<JobDetails | null>(null);
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const { mutateAsync: postStepOne, isPending: isPostingStepOne } = usePostStepOne({
    token,
  });
  const { mutateAsync: postStepTwo, isPending: isPostingStepTwo } = usePostStepTwo({
    token,
  });
  const { mutateAsync: postStepThree, isPending: isPostingStepThree } = usePostStepThree({
    token,
  });
  // inside PostJobForm
  const [saveDraftOpen, setSaveDraftOpen] = useState(false);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const router = useRouter()
  const resolveJobId = () => createdJobId ?? reviewJob?.id ?? null;
  const queryClient = useQueryClient()
  const submitStepThreeStatus = async (status: "draft" | "open") => {
    const jobId = resolveJobId();
    if (!jobId) {
      throw new Error("Job id is missing. Please complete previous steps first.");
    }

    const stepThreeResponse = await postStepThree({
      jobId,
      payload: { status },
    });

    const nextReviewJob =
      stepThreeResponse.data?.data?.job ??
      stepThreeResponse.data?.job ??
      null;

    if (nextReviewJob) {
      setReviewJob(nextReviewJob as JobDetails);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await submitStepThreeStatus("draft");
      setSaveDraftOpen(false);
      setSaveSuccessOpen(true);
    } catch {
      // errors are already handled in mutation onError toast
    }
  };
  const methods = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: jobFormDefaults,
    mode: "onChange",
  });

  const { handleSubmit, trigger, getValues } = methods;

  const handleNext = async () => {
    const fields = Object.keys(
      stepSchemas[currentStep as StepIndex].shape,
    ) as (keyof JobFormData)[];
    const valid = await trigger(fields);
    if (!valid) return;

    if (currentStep === 0) {
      const data = getValues();
      const stepOneResponse = await postStepOne({
        job_title_id: data.title === "__other__" ? undefined : Number(data.title),
        title: data.title === "__other__" ? data.otherJobTitle?.trim() ?? "" : undefined,
        professional_license: data.license,
        has_salary: data.addSalary,
        min_salary: Number(data.salary?.min ?? 0),
        max_salary: Number(data.salary?.max ?? 0),
        currency_id: Number(data.salary?.currency ?? 0),
        salary_type_id: Number(data.salary?.type ?? 0),
        category_id: Number(data.category),
        specialty_id: Number(data.specialty),
        employment_type_id: Number(data.employmentType),
        role_category_id: Number(data.roleCategory),
        seniority_level_id: Number(data.seniorityLevel || 0),
        country_id: Number(data.country),
        city_id: Number(data.city),
        experience_id: Number(data.yearsOfExperience),
        mandatory_certifications: data.mandatoryCertifications
          ? [Number(data.mandatoryCertifications)]
          : [],
        eduction_level_id: Number(data.educationLevel),
        availability_id: Number(data.availability),
      });

      const nextCreatedJobId = Number(stepOneResponse.data?.data?.job?.id);

      if (!nextCreatedJobId) {
        throw new Error("Unable to resolve created job id from step one response.");
      }

      setCreatedJobId(nextCreatedJobId);
      setCurrentStep((s) => s + 1);
      return;
    }

    if (currentStep === 1) {
      const data = getValues();
      const effectiveJobId = createdJobId;
      if (!effectiveJobId) {
        throw new Error("Job id is missing. Please complete step one first.");
      }

      const stepTwoResponse = await postStepTwo({
        jobId: effectiveJobId,
        payload: {
          description: data.description,
          skills: (data.skills ?? []).map((skillId) => Number(skillId)),
        },
      });
      const nextReviewJob =
        stepTwoResponse.data?.data?.job ??
        stepTwoResponse.data?.job ??
        null;
      setReviewJob(nextReviewJob as JobDetails | null);
      setCurrentStep((s) => s + 1);
      return;
    }

    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const onSubmit: SubmitHandler<JobFormData> = async () => {
    setIsSubmitting(true);
    try {
      await submitStepThreeStatus("open");
      setSubmitted(true);
      setPostSuccess(true);
      router.push("/company/job-management");
      queryClient.invalidateQueries({ queryKey: ['company-jobs'] })
    } catch {
      // errors are already handled in mutation onError toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="h-min-dvh mx-auto max-w-7xl py-12">
      <div className="h-full rounded-2xl bg-white p-6">
        <div className="flex gap-6">
          <WizardProgress step={currentStep} steps={STEPS} />
          {currentStep !== 0 && (
            <Button
              variant="outline"
              size="pill"
              hoverStyle="slidePrimary"
              onClick={() => setSaveDraftOpen(true)}
            >
              Save as Draft
            </Button>
          )}
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="min-h-80">
              {currentStep === 0 && <JobPostStepOne />}
              {currentStep === 1 && <JobPostStepTwo />}
              {currentStep === 2 && <JobReviewPanel data={getValues()} job={reviewJob} />}
            </div>

            <div className="mt-5 flex w-full items-center justify-center gap-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  hoverStyle="slidePrimary"
                  size="pill"
                  className="w-1/6"
                >
                  Prev
                </Button>
              )}

              {currentStep < LAST_STEP ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isPostingStepOne || isPostingStepTwo || isPostingStepThree}
                  variant="secondary"
                  hoverStyle="slidePrimary"
                  size="pill"
                  className="w-1/6"
                >
                  {isPostingStepOne || isPostingStepTwo || isPostingStepThree
                    ? "Saving..."
                    : "Next"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || isPostingStepThree}
                  variant="secondary"
                  size="pill"
                  hoverStyle="slidePrimary"
                  className="w-1/6"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Posting...
                    </>
                  ) : (
                    "Confirm & Post Job"
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>

      <AlertModal
        open={saveDraftOpen}
        onOpenChange={setSaveDraftOpen}
        title="Save as draft"
        description="All the data you have entered will be saved in the 'Drafts' list. The advertisement will not be published to the public until you complete it and click the publish button."
        confirmLabel="Save as draft"
        cancelLabel="Back"
        onConfirm={handleSaveDraft}
        isLoading={isPostingStepThree}
      />
      <SuccessModal
        open={saveSuccessOpen}
        onOpenChange={setSaveSuccessOpen}
        title="Saved successfully"
        description="You can return to complete the job details and publish them at any time from the 'Job Management' list."
      />
      <SuccessModal
        open={postSuccess}
        onOpenChange={setPostSuccess}
        title="Your advertisement has been successfully published!"
        description="Your advertisement is now available to thousands of medical professionals on the platform. We will notify you as soon as any suitable candidates apply. You can track statistics and applicant interactions through the dashboard."
      />
    </section>
  );
}
