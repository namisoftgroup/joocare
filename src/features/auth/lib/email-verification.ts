import { apiFetch } from "@/shared/lib/fetch-manager";
import { PasswordResetRole } from "./password-reset";

const baseUrlByRole: Record<PasswordResetRole, string | undefined> = {
  candidate: process.env.NEXT_PUBLIC_BASE_USER_URL,
  employer: process.env.NEXT_PUBLIC_BASE_COMPANY_URL,
};

function getBaseUrl(role: PasswordResetRole) {
  const baseUrl = baseUrlByRole[role];

  if (!baseUrl) {
    throw new Error("Authentication endpoint is not configured.");
  }

  return baseUrl;
}

function createFormData(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.append(key, value);
  }

  return formData;
}

export async function requestEmailVerification({
  role,
  email,
  locale,
}: {
  role: PasswordResetRole;
  email: string;
  locale: string;
}) {
  const { ok, message } = await apiFetch(`${getBaseUrl(role)}/auth/email/verify`, {
    method: "POST",
    locale,
    body: createFormData({ email }),
  });

  if (!ok) {
    throw new Error(message || "Failed to send verification code.");
  }

  return message || "Verification code sent successfully.";
}

export async function confirmEmailVerification({
  role,
  email,
  otp,
  locale,
}: {
  role: PasswordResetRole;
  email: string;
  otp: string;
  locale: string;
}) {
  const { ok, message } = await apiFetch(`${getBaseUrl(role)}/auth/email/confirm`, {
    method: "POST",
    locale,
    body: createFormData({ email, otp }),
  });

  if (!ok) {
    throw new Error(message || "Failed to confirm verification code.");
  }

  return message || "Email verified successfully.";
}
