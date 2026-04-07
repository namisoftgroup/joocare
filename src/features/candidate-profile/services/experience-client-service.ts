import { apiFetch } from "@/shared/lib/fetch-manager";

type ExperiencePayload = {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  responsibilities: string[];
  locale?: string;
  token: string;
};

function getUserBaseUrl() {
  if (!process.env.NEXT_PUBLIC_BASE_USER_URL) {
    throw new Error("User API endpoint is not configured.");
  }

  return process.env.NEXT_PUBLIC_BASE_USER_URL;
}

function buildExperienceFormData(
  payload: ExperiencePayload,
  includeMethodOverride = false,
) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("company", payload.company);
  formData.append("start_date", payload.startDate);
  formData.append("is_current", payload.isCurrent ? "1" : "0");

  if (!payload.isCurrent && payload.endDate) {
    formData.append("end_date", payload.endDate);
  }

  payload.responsibilities.forEach((responsibility) => {
    formData.append("responsibilities[]", responsibility);
  });

  if (includeMethodOverride) {
    formData.append("_method", "put");
  }

  return formData;
}

export async function createExperience(payload: ExperiencePayload) {
  const { ok, data, message } = await apiFetch(`${getUserBaseUrl()}/user-experiences`, {
    method: "POST",
    locale: payload.locale,
    token: payload.token,
    body: buildExperienceFormData(payload),
  });

  if (!ok) {
    throw new Error(message || "Failed to add experience.");
  }

  return data;
}

export async function updateExperience(id: string, payload: ExperiencePayload) {
  const { ok, data, message } = await apiFetch(`${getUserBaseUrl()}/user-experiences/${id}`, {
    method: "POST",
    locale: payload.locale,
    token: payload.token,
    body: buildExperienceFormData(payload, true),
  });

  if (!ok) {
    throw new Error(message || "Failed to update experience.");
  }

  return data;
}

export async function deleteExperience({
  id,
  locale = "en",
  token,
}: {
  id: string;
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(`${getUserBaseUrl()}/user-experiences/${id}`, {
    method: "DELETE",
    locale,
    token,
    body: new FormData(),
  });

  if (!ok) {
    throw new Error(message || "Failed to delete experience.");
  }

  return data;
}
