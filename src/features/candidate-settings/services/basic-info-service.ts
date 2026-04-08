import "server-only";

import { getLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getBaseApiUrl, getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

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

export type CandidateSettingsPageData = {
  profile: CandidateSettingsProfile;
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

function resolveUserRecord(data: unknown) {
  const root = asRecord(data);
  const nestedData = asRecord(root?.data);

  return (
    asRecord(nestedData?.user) ??
    asRecord(nestedData?.profile) ??
    nestedData ??
    asRecord(root?.user) ??
    asRecord(root?.profile)
  );
}

function resolveNestedId(record: Record<string, unknown>, key: string) {
  const nested = asRecord(record[key]);
  const snakeKey = `${key}_id`;
  const value = nested?.id ?? record[snakeKey];

  return typeof value === "number" || typeof value === "string"
    ? String(value)
    : "";
}

function resolveAsset(value: unknown) {
  if (typeof value === "string" && value) {
    return value;
  }

  const record = asRecord(value);
  const url = record?.url ?? record?.path ?? record?.file;

  return typeof url === "string" && url ? url : null;
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

export async function getCandidateBasicInfoPageData() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    return null;
  }

  const locale = await getLocale();
  const token = String(session.accessToken);

  const [profileResponse, formDataResponse] = await Promise.all([
    apiFetch(`${getUserApiUrl()}/auth/profile`, {
      method: "GET",
      locale,
      token,
    }),
    apiFetch(`${getUserApiUrl()}/auth/update-profile/form-data`, {
      method: "GET",
      locale,
      token,
    }),
  ]);

  const user = resolveUserRecord(profileResponse.data);

  if (!profileResponse.ok || !user) {
    return null;
  }

  const profile: CandidateSettingsProfile = {
    name: typeof user.name === "string" ? user.name : "",
    email: typeof user.email === "string" ? user.email : "",
    phone: typeof user.phone === "string" ? user.phone : "",
    phoneCode: typeof user.phone_code === "string" ? user.phone_code : "",
    jobTitleId: resolveNestedId(user, "job_title"),
    specialtyId: resolveNestedId(user, "specialty"),
    experienceId: resolveNestedId(user, "experience"),
    countryId: resolveNestedId(user, "country"),
    cityId: resolveNestedId(user, "city"),
    birthDate: normalizeDate(user.birth_date ?? user.date_of_birth),
    image: resolveAsset(user.image),
    cv: resolveAsset(user.cv),
  };

  const formData = formDataResponse.data;

  return {
    profile,
    jobTitles: getBestCollection(formData, ["job_title", "jobtitle"]),
    specialties: getBestCollection(formData, ["specialty"]),
    experiences: getBestCollection(formData, ["experience"]),
    countries: getBestCollection(formData, ["country"]),
    cities: await getCountryCities(profile.countryId),
  } satisfies CandidateSettingsPageData;
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
