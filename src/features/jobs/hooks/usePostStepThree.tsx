import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { jobStepThreeService } from "../services/job-step-three-service";
import { JobStepThreePayload } from "../types/job-steps.types";

export const usePostStepThree = ({ token }: { token: string }) => {
    return useMutation({
        mutationFn: ({ jobId, payload }: { jobId: number; payload: JobStepThreePayload }) =>
            jobStepThreeService(jobId, payload, { token }),
        onSuccess: (res) => {
            // toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};
