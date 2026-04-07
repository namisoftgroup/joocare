import z from "zod";

export const experienceModalSchema = z
  .object({
    jobTitle: z.string().trim().min(1, "Job title is required"),
    organizationOrHospitalName: z.string().trim().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    workHere: z.boolean().default(false),
    responsibilities: z
      .array(
        z.object({
          value: z.string().trim().min(1, "Required"),
        }),
      )
      .min(1, "At least one responsibility is required"),
  })
  .refine((data) => data.workHere || Boolean(data.endDate), {
    message: "End date is required unless you currently work here.",
    path: ["endDate"],
  })
  .refine(
    (data) => data.workHere || !data.endDate || data.endDate >= data.startDate,
    {
      message: "End date must be after start date.",
      path: ["endDate"],
    },
  );

export type FormData = z.infer<typeof experienceModalSchema>;
