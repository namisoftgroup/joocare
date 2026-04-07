import { z } from "zod";

export const educationModalSchema = z
  .object({
    degree: z.string().trim().min(1, "Degree is required"),
    university: z.string().trim().min(1, "University is required"),
    countryId: z.string().trim().min(1, "Country is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
  });

export type EducationModalFormData = z.infer<typeof educationModalSchema>;
