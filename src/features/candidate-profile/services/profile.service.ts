import { getLocale } from "next-intl/server";
import { apiFetch, type ApiFetchResponse } from "@/shared/lib/fetch-manager";
import { getNextAuthToken } from "@/shared/util/auth.util";

type NamedValue = {
  title?: string | null;
  name?: string | null;
};

type CandidateProfileApiUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phone_code: string | null;
  job_title?: string | NamedValue | null;
  country?: string | NamedValue | null;
  city?: string | NamedValue | null;
  image?: string | null;
  cv?: string | null;
  experience_id?: number | null;
  age?: number | string | null;
  bio?: string | null;
  qualifications?: unknown[];
  certifications?: unknown[];
  licenses?: unknown[];
  experiences?: unknown[];
  educations?: unknown[];
  skills?: unknown[];
};

export type CandidateProfileViewModel = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phoneCode: string | null;
  fullPhone: string | null;
  image: string | null;
  cv: string | null;
  bio: string | null;
  age: number | null;
  location: string | null;
  jobTitle: string | null;
  skills: string[];
  educations: CandidateEducationViewModel[];
  experiences: CandidateExperienceViewModel[];
};

export type CandidateEducationViewModel = {
  id: string;
  university: string;
  degree: string | null;
  period: string | null;
};

export type CandidateExperienceViewModel = {
  id: string;
  title: string;
  organization: string | null;
  startDate: string | null;
  endDate: string | null;
  bullets: string[];
};

function extractCandidateProfileUser(payload: ApiFetchResponse<CandidateProfileApiUser> | null) {
  const data = payload?.data;

  if (data && typeof data === "object" && "id" in data) {
    return data as CandidateProfileApiUser;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const nestedCandidate = record.user ?? record.profile ?? record.candidate;

    if (nestedCandidate && typeof nestedCandidate === "object" && "id" in nestedCandidate) {
      return nestedCandidate as CandidateProfileApiUser;
    }
  }

  return null;
}

function readNamedValue(value: string | NamedValue | null | undefined) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return value.title ?? value.name ?? null;
}

function normalizeSkillEntry(entry: unknown) {
  if (!entry) {
    return null;
  }

  if (typeof entry === "string") {
    return entry;
  }

  if (typeof entry === "object") {
    const record = entry as Record<string, unknown>;
    const value = record.name ?? record.title ?? record.label ?? record.value;
    return typeof value === "string" ? value : null;
  }

  return null;
}

function readRecordValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string" && Boolean(entry));
}

function normalizeDateLabel(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function normalizeEducationEntry(entry: unknown, index: number): CandidateEducationViewModel | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const university =
    readRecordValue(record, ["university", "university", "school", "name"]) ?? "Education";
  const degree = readRecordValue(record, ["degree", "title", "specialization", "field"]);
  const startYear = normalizeDateLabel(
    readRecordValue(record, ["start_date", "startDate", "start_year", "startYear", "from"]),
  );
  const endYear = normalizeDateLabel(
    readRecordValue(record, ["end_date", "endDate", "end_year", "endYear", "to"]),
  );
  const period =
    startYear && endYear ? `${startYear} - ${endYear}` : startYear ?? endYear ?? null;

  return {
    id: String(record.id ?? `education-${index}`),
    university,
    degree,
    period,
  };
}

function normalizeExperienceEntry(entry: unknown, index: number): CandidateExperienceViewModel | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const title =
    readRecordValue(record, ["title", "job_title", "position", "role"]) ?? "Experience";
  const organization = readRecordValue(record, [
    "organization",
    "company",
    "department",
    "university",
    "employer",
  ]);
  const startDate = normalizeDateLabel(
    readRecordValue(record, ["start_date", "startDate", "from"]),
  );
  const endDate = Boolean(record.is_current)
    ? "Present"
    : normalizeDateLabel(readRecordValue(record, ["end_date", "endDate", "to"])) ?? "Present";
  const bulletsSource = Array.isArray(record.bullets)
    ? record.bullets
    : Array.isArray(record.responsibilities)
      ? record.responsibilities.map((item) => {
          if (item && typeof item === "object") {
            const responsibility = item as Record<string, unknown>;
            return typeof responsibility.description === "string"
              ? responsibility.description
              : null;
          }

          return null;
        })
      : Array.isArray(record.description)
        ? record.description
        : [];

  return {
    id: String(record.id ?? `experience-${index}`),
    title,
    organization,
    startDate,
    endDate,
    bullets: normalizeStringArray(bulletsSource),
  };
}

function buildLocation(country: string | null, city: string | null) {
  if (city && country) {
    return `${city}, ${country}`;
  }

  return city ?? country ?? null;
}

function normalizeAge(age: number | string | null | undefined) {
  if (typeof age === "number") {
    return Number.isNaN(age) ? null : age;
  }

  if (typeof age === "string") {
    const parsed = Number.parseInt(age, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

export async function getCandidateProfile() {
  const sessionToken = await getNextAuthToken();

  if (!sessionToken?.accessToken || sessionToken.authRole !== "candidate") {
    return null;
  }

  const locale = await getLocale();
  const { ok, data } = await apiFetch<CandidateProfileApiUser>(
    `${process.env.NEXT_PUBLIC_BASE_USER_URL}/auth/profile`,
    {
      method: "GET",
      locale,
      token: String(sessionToken.accessToken),
    },
  );

  const user = extractCandidateProfileUser(data);

  if (!ok || !user?.id) {
    return null;
  }
  const country = readNamedValue(user.country);
  const city = readNamedValue(user.city);
  const jobTitle = readNamedValue(user.job_title);
  const fullPhone =
    user.phone && user.phone_code ? `${user.phone_code}${user.phone}` : user.phone;
  const skills = (user.skills ?? user.qualifications ?? [])
    .map(normalizeSkillEntry)
    .filter((skill): skill is string => Boolean(skill));
  const educations = (user.educations ?? [])
    .map(normalizeEducationEntry)
    .filter((education): education is CandidateEducationViewModel => Boolean(education));
  const experiences = (user.experiences ?? [])
    .map(normalizeExperienceEntry)
    .filter((experience): experience is CandidateExperienceViewModel => Boolean(experience));

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phoneCode: user.phone_code,
    fullPhone: fullPhone ?? null,
    image: user.image ?? null,
    cv: user.cv ?? null,
    bio: user.bio ?? null,
    age: normalizeAge(user.age),
    location: buildLocation(country, city),
    jobTitle,
    skills,
    educations,
    experiences,
  } satisfies CandidateProfileViewModel;
}
