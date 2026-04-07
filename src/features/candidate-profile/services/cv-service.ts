import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function uploadCv({
  file,
  locale = "en",
  token,
}: {
  file: File;
  locale?: string;
  token: string;
}) {
  const formData = new FormData();
  formData.append("cv", file);

  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/auth/update-cv`, {
    method: "POST",
    locale,
    token,
    body: formData,
  });

  console.log(ok, data, message);


  if (!ok) {
    throw new Error(message || "Failed to upload CV.");
  }

  return {
    data,
    message: data?.message ?? message ?? "CV uploaded successfully.",
  };
}

export async function removeCv({
  locale = "en",
  token,
}: {
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/auth/delete-cv`, {
    method: "DELETE",
    locale,
    token,
    body: new FormData(),
  });

  if (!ok) {
    throw new Error(message || "Failed to delete CV.");
  }

  return {
    data,
    message: data?.message ?? message ?? "CV deleted successfully.",
  };
}
