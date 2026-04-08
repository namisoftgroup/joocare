import "server-only";

import { getLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getBaseApiUrl, getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import type { CandidateProfileViewModel } from "@/features/candidate-profile/types/profile.types";

export type CandidateSettingsOption = {
  id: string;
  label: string;
};

export type CandidateSettingsProfile = {
  name: string;
  email: string;
  phone: string;
  phoneCode: string;
  jobTitleId: string;
  specialtyId: string;
  experienceId: string;
  countryId: string;
  cityId: string;
  birthDate: string;
  image: string | null;
  cv: string | null;
};

export type CandidateBasicInfoOptions = {
  jobTitles: CandidateSettingsOption[];
  specialties: CandidateSettingsOption[];
  experiences: CandidateSettingsOption[];
  countries: CandidateSettingsOption[];
  cities: CandidateSettingsOption[];
};

function asRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function parseOption(entry: unknown): CandidateSettingsOption | null {
  const record = asRecord(entry);

  if (!record) {
    return null;
  }

  const nestedItem = asRecord(record.item);
  const id = nestedItem?.id ?? record.id ?? record.value;
  const label =
    nestedItem?.name ??
    nestedItem?.title ??
    record.name ??
    record.title ??
    record.label ??
    record.value;

  if ((typeof id === "number" || typeof id === "string") && typeof label === "string") {
    return {
      id: String(id),
      label,
    };
  }

  return null;
}

function findCollections(
  data: unknown,
  keyHints: string[],
  parentKey = "",
): unknown[][] {
  const record = asRecord(data);

  if (!record) {
    return [];
  }

  const matches: unknown[][] = [];

  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = key.toLowerCase();
    const matchedKey = keyHints.some(
      (hint) => normalizedKey.includes(hint) || parentKey.includes(hint),
    );

    if (Array.isArray(value)) {
      if (matchedKey) {
        matches.push(value);
      }

      for (const item of value) {
        matches.push(...findCollections(item, keyHints, normalizedKey));
      }

      continue;
    }

    if (value && typeof value === "object") {
      matches.push(...findCollections(value, keyHints, normalizedKey));
    }
  }

  return matches;
}

function getBestCollection(data: unknown, keyHints: string[]) {
  const collections = findCollections(data, keyHints)
    .map((collection) => collection.map(parseOption).filter((item): item is CandidateSettingsOption => Boolean(item)))
    .filter((collection) => collection.length > 0);

  if (collections.length === 0) {
    return [];
  }

  collections.sort((left, right) => right.length - left.length);
  return collections[0];
}

function normalizeDate(value: unknown) {
  if (typeof value !== "string" || !value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10);
  }

  return parsed.toISOString().slice(0, 10);
}

async function getCountryCities(countryId: string) {
  if (!countryId) {
    return [];
  }

  const { ok, data } = await apiFetch(
    `${getBaseApiUrl()}/cities?pagination=on&limit_per_page=100&page=1&country_id=${countryId}`,
    {
      method: "GET",
    },
  );

  if (!ok) {
    return [];
  }

  const items = Array.isArray(data?.data) ? data.data : [];

  return items
    .map(parseOption)
    .filter((item): item is CandidateSettingsOption => Boolean(item));
}

export function mapCandidateProfileToSettingsProfile(
  profile: CandidateProfileViewModel,
): CandidateSettingsProfile {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? "",
    phoneCode: profile.phoneCode ?? "",
    jobTitleId: profile.jobTitleId ?? "",
    specialtyId: profile.specialtyId ?? "",
    experienceId: profile.experienceId ?? "",
    countryId: profile.countryId ?? "",
    cityId: profile.cityId ?? "",
    birthDate: normalizeDate(profile.birthDate),
    image: profile.image,
    cv: profile.cv,
  };
}

export async function getCandidateBasicInfoOptions(countryId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    return null;
  }

  const locale = await getLocale();
  const token = String(session.accessToken);
  const formDataResponse = await apiFetch(`${getUserApiUrl()}/auth/update-profile/form-data`, {
    method: "GET",
    locale,
    token,
  });

  if (!formDataResponse.ok) {
    return null;
  }

  const formData = formDataResponse.data;

  return {
    jobTitles: getBestCollection(formData, ["job_title", "jobtitle"]),
    specialties: getBestCollection(formData, ["specialty"]),
    experiences: getBestCollection(formData, ["experience"]),
    countries: getBestCollection(formData, ["country"]),
    cities: await getCountryCities(countryId),
  } satisfies CandidateBasicInfoOptions;
}

export async function updateCandidateBasicInfo({
  formData,
  locale = "en",
  token,
}: {
  formData: FormData;
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/auth/update-profile`, {
    method: "POST",
    locale,
    token,
    body: formData,
  });

  if (!ok) {
    throw new Error(message || "Failed to update profile information.");
  }

  return data;
}
