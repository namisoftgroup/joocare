"use client";

import WizardProgress from "@/features/complete-account/components/wizard-progress";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import useFormPersist from "../hooks/useFormPersist";
import {
  JobFormData,
  jobFormDefaults,
  jobFormSchema,
  StepIndex,
  stepSchemas,
} from "../validation/job-post-schema";
import JobPostStepOne from "./JobPostStepOne";
import JobPostStepTwo from "./JobPostStepTwo";
import JobReviewPanel from "./JobReviewPanel";

const POST_JOB_FORM_STEPS = [
  "Job Details",
  "Job Description & Requirements",
  "Job Preview",
];

export default function PostJobForm() {
  const router = useRouter();
  // Replace with useSearchParams() in real Next.js app
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const methods = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: jobFormDefaults,
    mode: "onChange",
  });

  const { handleSubmit, trigger, getValues } = methods;

  const handleNext = async () => {
    // Validate only current step's fields
    console.log("next ");

    const fieldsToValidate = Object.keys(
      stepSchemas[currentStep as StepIndex].shape,
    );
    console.log(fieldsToValidate);

    const valid = await trigger(fieldsToValidate as (keyof JobFormData)[]);
    console.log(valid);
    if (valid) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => s - 1);

  const onSubmit: SubmitHandler<JobFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // Replace with your API call
      await new Promise((res) => setTimeout(res, 1500));
      console.log("Submitted:", data);

      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Job Posted!</h2>
          <p className="mb-6 text-gray-500">
            Your listing is now live and visible to candidates.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(0);
            }}
            className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700"
          >
            Post Another Job
          </button>
        </div>
      </div>
    );
  }
  return (
    <section className="h-min-dvh mx-auto max-w-7xl py-12">
      <div className="h-full rounded-2xl bg-white p-6">
        <div className="flex gap-6">
          <WizardProgress step={currentStep} steps={POST_JOB_FORM_STEPS} />{" "}
          {currentStep > 0 && (
            <Button variant="outline" size="pill">
              Save as Draft
            </Button>
          )}
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="min-h-80">
              {currentStep === 0 && <JobPostStepOne />}
              {currentStep === 1 && <JobPostStepTwo />}
              {currentStep === 2 && <JobReviewPanel data={getValues()} />}
            </div>{" "}
            <div className="mt-5 flex w-full items-center justify-center gap-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  variant="outline"
                  size="pill"
                  className="w-1/6"
                >
                  Back
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  variant="secondary"
                  size="pill"
                  className="w-1/6"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="secondary"
                  size="pill"
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
    </section>
  );
}
