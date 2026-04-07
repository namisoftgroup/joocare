import { apiFetch } from "@/shared/lib/fetch-manager";

export async function updateCandidateBio({
  bio,
  locale = "en",
  token,
}: {
  bio: string;
  locale?: string;
  token: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_USER_URL;

  if (!baseUrl) {
    throw new Error("User API endpoint is not configured.");
  }

  const formData = new FormData();
  formData.append("bio", bio);

  const { ok, data, message } = await apiFetch(`${baseUrl}/user-bio`, {
    method: "POST",
    locale,
    token,
    body: formData,
  });

  if (!ok) {
    throw new Error(message || "Failed to update about information.");
  }

  return data;
}
