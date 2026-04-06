import { apiFetch } from "@/shared/lib/fetch-manager";

export type PasswordResetRole = "candidate" | "employer";

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

export async function requestPasswordReset({
  role,
  email,
  locale,
}: {
  role: PasswordResetRole;
  email: string;
  locale: string;
}) {
  const { ok, message } = await apiFetch(`${getBaseUrl(role)}/auth/forgot-password`, {
    method: "POST",
    locale,
    body: createFormData({ email }),
  });

  if (!ok) {
    throw new Error(message || "Failed to send reset code.");
  }

  return message || "Reset code sent successfully.";
}

export async function verifyPasswordResetOtp({
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
  const { ok, message } = await apiFetch(`${getBaseUrl(role)}/auth/verify-otp`, {
    method: "POST",
    locale,
    body: createFormData({ email, otp }),
  });

  if (!ok) {
    throw new Error(message || "Invalid verification code.");
  }

  return message || "Code verified successfully.";
}

export async function resetPassword({
  role,
  email,
  otp,
  password,
  passwordConfirmation,
  locale,
}: {
  role: PasswordResetRole;
  email: string;
  otp: string;
  password: string;
  passwordConfirmation: string;
  locale: string;
}) {
  const { ok, message } = await apiFetch(`${getBaseUrl(role)}/auth/reset-password`, {
    method: "POST",
    locale,
    body: createFormData({
      email,
      otp,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  if (!ok) {
    throw new Error(message || "Failed to reset password.");
  }

  return message || "Password reset successfully.";
}
