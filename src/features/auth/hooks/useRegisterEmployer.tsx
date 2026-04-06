import { useMutation } from "@tanstack/react-query";
import { registerEmployer } from "../services/employer-register";
import { toast } from "sonner";

export const useRegisterEmployer = (onSuccess: () => void) => {
    return useMutation({
        mutationFn: registerEmployer,
        onSuccess: (data) => {
            console.log("data", data);
            toast.success("Registration successful! Please verify your email.");
            onSuccess();
        },
        onError: (error: Error) => {
            console.log("error:::::::", error);
            toast.error(error.message ?? "Something went wrong. Please try again.");
        },
    });
};