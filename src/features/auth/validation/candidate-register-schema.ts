import { z } from "zod";

const phoneNumberSchema = z
  .string()
  .min(1, { message: "Phone number is required" })
  .regex(/^[\d\s\-\+\(\)]+$/, {
    message: "Phone number contains invalid characters",
  })
  .refine(
    (value) => {
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    },
    { message: "Phone number must be between 7-15 digits" },
  );

// Reusable transforms
const optionalString = z
  .string()
  .optional()
  .transform((val) => (val?.trim() === "" ? undefined : val));

const optionalFileArray = z
  .array(z.instanceof(File))
  .optional()
  .transform((val) => (val && val.length === 0 ? undefined : val));

export const RegisterCandidateSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Full name is required" })
      .min(2, { message: "Full name must be at least 2 characters" }),

    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),

    phoneNumber: phoneNumberSchema,

    jobTitle: z.string().min(1, { message: "Job title is required" }),

    country: z.string().min(1, { message: "Country is required" }),

    city: z.string().min(1, { message: "City is required" }),

    createPassword: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),

    // Sends undefined (omitted) if no files uploaded
    uploadCV: optionalFileArray,

    confirmRegister: z.boolean().default(false),

    // Sends undefined (omitted) if left empty
    licenseTitle: optionalString.refine(
      (value) => !value || value.trim().length > 0,
      { message: "License title cannot be empty if provided" },
    ),

    licenseNumber: optionalString,

    specificCountry: optionalString,

    // Sends undefined (omitted) if no files uploaded
    uploadLicense: optionalFileArray,
  })
  .superRefine((data, ctx) => {
    if (data.confirmRegister) {
      if (!data.specificCountry) {
        ctx.addIssue({
          path: ["specificCountry"],
          message: "License country is required when you have a medical license",
          code: "custom",
        });
      }
    }
  });

export type TRegisterCandidateSchema = z.infer<typeof RegisterCandidateSchema>;