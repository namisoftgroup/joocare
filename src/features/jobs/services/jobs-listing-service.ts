import { formatDistanceToNowStrict } from "date-fns";

import { getBaseApiUrl, getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export type LocalizedValue =
  | string
  | {
    ar?: string | null;
    en?: string | null;
  }
  | null
  | undefined;

// export type JobsFilterOption = {
//   value: string;
//   label: string;
// };

// export type JobsFiltersData = {
//   countries: JobsFilterOption[];
//   categories: JobsFilterOption[];
//   domains: JobsFilterOption[];
//   specialties: JobsFilterOption[];
//   experiences: JobsFilterOption[];
//   availabilities: JobsFilterOption[];
//   employmentTypes: JobsFilterOption[];
//   roleCategories: JobsFilterOption[];
//   salaryTypes: JobsFilterOption[];
//   seniorityLevels: JobsFilterOption[];
//   jobTitles: JobsFilterOption[];
// };

// export type JobsSearchFilters = {
//   page: number;
//   search: string;
//   country: string;
//   professionalLicense: string;
//   domain: string;
//   minSalary: string;
//   maxSalary: string;
//   roleCategories: string[];
//   seniorityLevels: string[];
//   specialties: string[];
//   experiences: string[];
//   availabilities: string[];
//   salaryTypes: string[];
//   categories: string[];
//   employmentTypes: string[];
// };

// export type JobListItem = {
//   id: string;
//   slug: string;
//   title: string;
//   company: string;
//   companyLogo: string | null;
//   location: string;
//   employmentType: string;
//   domain: string;
//   experience: string;
//   salary: string;
//   excerpt: string;
//   postedAt: string | null;
//   postedAtLabel: string;
// };

// export type JobsListingResult = {
//   data: JobListItem[];
//   currentPage: number;
//   lastPage: number;
//   perPage: number;
//   total: number;
// };

// type RawLookupItem = {
//   id?: number | string | null;
//   title?: LocalizedValue;
//   name?: LocalizedValue;
//   word?: string | null;
// };

// type RawJobItem = Record<string, unknown>;

// type JobsApiResponse = {
//   code?: number;
//   message?: string;
//   data?:
//   | RawJobItem[]
//   | {
//     data?: RawJobItem[];
//     current_page?: number;
//     last_page?: number;
//     per_page?: number;
//     total?: number;
//   };
//   current_page?: number;
//   last_page?: number;
//   per_page?: number;
//   total?: number;
// };

// const PAGE_SIZE = 10;


// ==============================
// TYPES
// ==============================

export type LocalizedValue =
  | string
  | {
    ar?: string | null;
    en?: string | null;
  }
  | null
  | undefined;

export type JobsFilterOption = {
  value: string;
  label: string;
};

export type JobsFiltersData = {
  countries: JobsFilterOption[];
  categories: JobsFilterOption[];
  domains: JobsFilterOption[];
  specialties: JobsFilterOption[];
  experiences: JobsFilterOption[];
  availabilities: JobsFilterOption[];
  employmentTypes: JobsFilterOption[];
  roleCategories: JobsFilterOption[];
  salaryTypes: JobsFilterOption[];
  seniorityLevels: JobsFilterOption[];
  jobTitles: JobsFilterOption[];
};

export type JobsSearchFilters = {
  page: number;
  search: string;
  country: string;
  professionalLicense: string;
  domain: string;
  minSalary: string;
  maxSalary: string;
  roleCategories: string[];
  seniorityLevels: string[];
  specialties: string[];
  experiences: string[];
  availabilities: string[];
  salaryTypes: string[];
  categories: string[];
  employmentTypes: string[];
};

export type JobListItem = {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  employmentType: string;
  domain: string;
  experience: string;
  salary: string;
  excerpt: string;
  postedAt: string | null;
  postedAtLabel: string;
};

export type JobsListingResult = {
  data: JobListItem[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number,
    nextPageUrl: string | null
    total: number;
  };
};

// ==============================
// API RESPONSE
// ==============================

type JobsApiResponse = {
  message: string;
  code: number;
  data: RawJobItem[];

  current_page: number;
  last_page: number;
  per_page: number;
  total: number;

  next_page_url: string | null;
  prev_page_url: string | null;
};

// ==============================
// RAW TYPES
// ==============================

type RawLookupItem = {
  id?: number | string | null;
  title?: LocalizedValue;
  name?: LocalizedValue;
  word?: string | null;
};

type JobNamedResource = {
  id: number;
  title?: string | null;
  name?: string | null;
  code?: string | null;
  created_at?: string;
  updated_at?: string;
};

type JobCompanyResource = {
  id: number;
  image: string | null;
  cover: string | null;
  name: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  snapchat: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

type JobCountryResource = {
  id: number;
  name: string | null;
  code: string | null;
  created_at: string;
  updated_at: string;
};

type JobCityResource = {
  id: number;
  name: string | null;
  country_id: number | null;
  created_at: string;
  updated_at: string;
};

type JobSpecialtyResource = {
  id: number;
  title: string | null;
  category_id: number | null;
  created_at: string;
  updated_at: string;
};

type RawJobItem = {
  id: number;
  title: string | null;
  slug?: string | null;

  job_title_id: number | null;
  job_title: JobNamedResource | null;

  company: JobCompanyResource | null;
  country: JobCountryResource | null;
  city: JobCityResource | null;

  experience: JobNamedResource | null;
  employment_type: JobNamedResource | null;
  specialty: JobSpecialtyResource | null;

  currency_id: number | null;
  currency: JobNamedResource | null;

  salary_type_id: number | null;
  salary_type: JobNamedResource | null;

  min_salary?: number | string | null;
  max_salary?: number | string | null;


  description: string | null;
  summary?: string | null;
  about?: string | null;
  requirements?: string | null;

  image?: string | null;

  is_applied: boolean;
  is_saved: boolean;

  created_at: string;
  updated_at: string;
  published_at?: string | null;
};

// ==============================

const PAGE_SIZE = 10;

function getSingleParam(
  searchParams: Record<string, string | string[] | undefined>,
  ...keys: string[]
) {
  for (const key of keys) {
    const value = searchParams[key];

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value) && value.length > 0) {
      return value[0] ?? "";
    }
  }

  return "";
}

function getArrayParam(
  searchParams: Record<string, string | string[] | undefined>,
  ...keys: string[]
) {
  const values = keys.flatMap((key) => {
    const value = searchParams[key];

    if (typeof value === "string") {
      return [value];
    }

    return Array.isArray(value) ? value : [];
  });

  return values.filter((value) => value.trim().length > 0);
}

function resolveLocalizedValue(value: LocalizedValue, locale: string) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return locale === "ar" ? value.ar ?? value.en ?? "" : value.en ?? value.ar ?? "";
}

function readNestedValue(
  input: Record<string, unknown> | null | undefined,
  path: string[],
): unknown {
  return path.reduce<unknown>((currentValue, key) => {
    if (!currentValue || typeof currentValue !== "object") {
      return undefined;
    }

    return (currentValue as Record<string, unknown>)[key];
  }, input);
}

function readLocalizedField(
  input: Record<string, unknown> | null | undefined,
  locale: string,
  paths: string[][],
) {
  for (const path of paths) {
    const value = readNestedValue(input, path);

    if (typeof value === "string") {
      return value;
    }

    if (value && typeof value === "object") {
      const localized = resolveLocalizedValue(value as LocalizedValue, locale);

      if (localized) {
        return localized;
      }
    }
  }

  return "";
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function buildPostedAtLabel(value: string | null) {
  if (!value) {
    return "Recently posted";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently posted";
  }

  return formatDistanceToNowStrict(date, { addSuffix: true });
}

function normalizeSalary(rawJob: RawJobItem) {
  const currency = readLocalizedField(rawJob, "en", [
    ["currency", "code"],

  ]);

  const minSalary =
    rawJob.min_salary ?? readNestedValue(rawJob, ["salary", "min"]);
  const maxSalary =
    rawJob.max_salary ?? readNestedValue(rawJob, ["salary", "max"]);

  const min = minSalary ? String(minSalary) : "";
  const max = maxSalary ? String(maxSalary) : "";

  if (min && max) {
    return `${min} - ${max}${currency ? ` ${currency}` : ""}`;
  }

  if (min || max) {
    return `${min || max}${currency ? ` ${currency}` : ""}`;
  }

  return "Salary not specified";
}

function normalizeLookupItem(item: RawLookupItem, locale: string): JobsFilterOption | null {
  const value = item.id ? String(item.id) : "";
  const label =
    resolveLocalizedValue(item.title, locale) ||
    resolveLocalizedValue(item.name, locale) ||
    item.word ||
    "";

  if (!value || !label) {
    return null;
  }

  return { value, label };
}

async function fetchLookupOptions(
  endpoint: string,
  locale: string,
  extraParams?: Record<string, string>,
) {
  const params = new URLSearchParams({
    pagination: "on",
    limit_per_page: "100",
    page: "1",
  });

  Object.entries(extraParams ?? {}).forEach(([key, value]) => {
    if (value.trim()) {
      params.set(key, value);
    }
  });

  const response = await fetch(`${getBaseApiUrl()}/${endpoint}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}.`);
  }

  const payload = (await response.json()) as { code?: number; data?: RawLookupItem[] };

  if (payload.code !== 200) {
    throw new Error(`Failed to fetch ${endpoint}.`);
  }

  return (payload.data ?? [])
    .map((item) => normalizeLookupItem(item, locale))
    .filter((item): item is JobsFilterOption => Boolean(item));
}

function normalizeJob(rawJob: RawJobItem, locale: string): JobListItem {
  const title =
    readLocalizedField(rawJob, locale, [
      ["title"],
      ["job_title", "title"],
      ["job_title", "name"],
      ["name"],
    ]) || "Untitled role";
  const company =
    readLocalizedField(rawJob, locale, [
      ["company", "name"],
      ["employer", "name"],
      ["company_name"],
    ]) || "Joocare Employer";
  const city = readLocalizedField(rawJob, locale, [
    ["city", "name"],
    ["city_name"],
  ]);
  const country = readLocalizedField(rawJob, locale, [
    ["country", "name"],
    ["country_name"],
  ]);
  const employmentType =
    readLocalizedField(rawJob, locale, [
      ["employment_type", "title"],
      ["employment_type", "name"],
    ]) || "Not specified";
  const domain =
    readLocalizedField(rawJob, locale, [
      ["domain", "title"],
      ["domain", "name"],
      ["category", "title"],
      ["category", "name"],
    ]) || "Healthcare";
  const experience =
    readLocalizedField(rawJob, locale, [
      ["experience", "title"],
      ["experience", "name"],
      ["seniority_level", "title"],
      ["seniority_level", "name"],
    ]) || "Experience not specified";
  const excerptSource =
    readLocalizedField(rawJob, locale, [
      ["description"],
      ["summary"],
      ["about"],
      ["requirements"],
    ]) || "Explore the role details, responsibilities, and employer information on Joocare.";
  const postedAt =
    typeof rawJob.created_at === "string"
      ? rawJob.created_at
      : typeof rawJob.published_at === "string"
        ? rawJob.published_at
        : null;
  const id = String(rawJob.id ?? "");
  const slugSource = rawJob.slug ?? rawJob.id;

  return {
    id,
    slug: String(slugSource ?? id),
    title,
    company,
    companyLogo:
      typeof rawJob.image === "string"
        ? rawJob.image
        : typeof readNestedValue(rawJob, ["company", "image"]) === "string"
          ? (readNestedValue(rawJob, ["company", "image"]) as string)
          : null,
    location: [city, country].filter(Boolean).join(", ") || "Location not specified",
    employmentType,
    domain,
    experience,
    salary: normalizeSalary(rawJob),
    excerpt: stripHtml(excerptSource).slice(0, 180),
    postedAt,
    postedAtLabel: buildPostedAtLabel(postedAt),
  };
}

export function getSiteOrigin() {
  const baseUrl = getBaseApiUrl();

  return baseUrl.replace(/\/api\/?$/, "");
}

export function normalizeJobsSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): JobsSearchFilters {
  const pageValue = Number.parseInt(getSingleParam(searchParams, "page"), 10);

  return {
    page: Number.isNaN(pageValue) || pageValue < 1 ? 1 : pageValue,
    search: getSingleParam(searchParams, "search").trim(),
    country: getSingleParam(searchParams, "country"),
    professionalLicense: getSingleParam(searchParams, "professional_license"),
    domain: getSingleParam(searchParams, "domain"),
    minSalary: getSingleParam(searchParams, "min_salary"),
    maxSalary: getSingleParam(searchParams, "max_salary"),
    roleCategories: getArrayParam(
      searchParams,
      "role_categories[]",
      "role_categories",
    ),
    seniorityLevels: getArrayParam(
      searchParams,
      "seniority_levels[]",
      "seniority_levels",
    ),
    specialties: getArrayParam(searchParams, "specialties[]", "specialties"),
    experiences: getArrayParam(searchParams, "experiences[]", "experiences"),
    availabilities: getArrayParam(searchParams, "availabilities[]", "availabilities"),
    salaryTypes: getArrayParam(searchParams, "salary_types[]", "salary_types"),
    categories: getArrayParam(searchParams, "categories[]", "categories"),
    employmentTypes: getArrayParam(
      searchParams,
      "employment_types[]",
      "employment_types",
    ),
  };
}

export function buildJobsQueryString(filters: JobsSearchFilters) {
  const params = new URLSearchParams();
  const arrayFilters: Array<[string, string[]]> = [
    ["role_categories[]", filters.roleCategories],
    ["seniority_levels[]", filters.seniorityLevels],
    ["specialties[]", filters.specialties],
    ["experiences[]", filters.experiences],
    ["availabilities[]", filters.availabilities],
    ["salary_types[]", filters.salaryTypes],
    ["categories[]", filters.categories],
    ["employment_types[]", filters.employmentTypes],
  ];

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.country) {
    params.set("country", filters.country);
  }

  if (filters.professionalLicense) {
    params.set("professional_license", filters.professionalLicense);
  }

  if (filters.domain) {
    params.set("domain", filters.domain);
  }

  if (filters.minSalary) {
    params.set("min_salary", filters.minSalary);
  }

  if (filters.maxSalary) {
    params.set("max_salary", filters.maxSalary);
  }

  arrayFilters.forEach(([key, values]) => {
    values.forEach((value) => {
      if (value.trim()) {
        params.append(key, value);
      }
    });
  });

  return params.toString();
}

export function buildJobsPagePath(locale: string, filters: JobsSearchFilters) {
  const queryString = buildJobsQueryString(filters);

  return `/${locale}/jobs${queryString ? `?${queryString}` : ""}`;
}


export async function getJobsListing(
  locale: string,
  filters: JobsSearchFilters
): Promise<JobsListingResult> {
  const params = new URLSearchParams({
    pagination: "on",
    limit_per_page: String(PAGE_SIZE),
    page: String(filters.page),
  });

  const arrayFilters: Array<[string, string[]]> = [
    ["role_categories[]", filters.roleCategories],
    ["seniority_levels[]", filters.seniorityLevels],
    ["specialties[]", filters.specialties],
    ["experiences[]", filters.experiences],
    ["availabilities[]", filters.availabilities],
    ["salary_types[]", filters.salaryTypes],
    ["categories[]", filters.categories],
    ["employment_types[]", filters.employmentTypes],
  ];

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.country) {
    params.set("country", filters.country);
  }

  if (filters.professionalLicense) {
    params.set("professional_license", filters.professionalLicense);
  }

  if (filters.domain) {
    params.set("domain", filters.domain);
  }

  if (filters.minSalary) {
    params.set("min_salary", filters.minSalary);
  }

  if (filters.maxSalary) {
    params.set("max_salary", filters.maxSalary);
  }

  arrayFilters.forEach(([key, values]) => {
    values.forEach((value) => {
      if (value.trim()) {
        params.append(key, value);
      }
    });
  });

  const session = await getServerSession(authOptions);
  console.log("params :::", params.toString());

  const result = await apiFetch<JobsApiResponse>(
    `${getUserApiUrl()}/jobs?${params.toString()}`,
    {
      method: "GET",
      locale,
      cache: "no-store",
      token: session?.accessToken,
    }
  );

  if (!result.ok || !result.data) {
    throw new Error(
      result.message || `Failed to load jobs from ${getUserApiUrl()}/jobs.`
    );
  }

  const response = result.data;
  console.log(response);


  const jobs = response.data;

  return {
    data: jobs?.map((job) => normalizeJob(job, locale)),
    pagination: {
      currentPage: response.current_page,
      lastPage: response.last_page,
      perPage: response.per_page || PAGE_SIZE,
      nextPageUrl: response.next_page_url,
      total: response.total,
    },
  };
}

export async function getJobsFiltersData(locale: string) {
  const [
    countries,
    categories,
    domains,
    specialties,
    experiences,
    availabilities,
    employmentTypes,
    roleCategories,
    salaryTypes,
    seniorityLevels,
    jobTitles,
  ] = await Promise.all([
    fetchLookupOptions("countries", locale),
    fetchLookupOptions("categories", locale),
    fetchLookupOptions("domains", locale),
    fetchLookupOptions("specialties", locale),
    fetchLookupOptions("experiences", locale),
    fetchLookupOptions("availabilities", locale),
    fetchLookupOptions("employment-types", locale),
    fetchLookupOptions("role-categories", locale),
    fetchLookupOptions("salary-types", locale),
    fetchLookupOptions("seniority-levels", locale),
    fetchLookupOptions("job-titles", locale),
  ]);

  return {
    countries,
    categories,
    domains,
    specialties,
    experiences,
    availabilities,
    employmentTypes,
    roleCategories,
    salaryTypes,
    seniorityLevels,
    jobTitles,
  } satisfies JobsFiltersData;
}
