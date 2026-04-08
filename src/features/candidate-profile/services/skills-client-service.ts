import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export type SkillOption = {
  id: string;
  label: string;
};

export type UserSkillsCatalog = {
  suggested: SkillOption[];
  skills: SkillOption[];
};

function parseSkillOption(entry: unknown): SkillOption | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const nestedSkill =
    record.skill && typeof record.skill === "object"
      ? (record.skill as Record<string, unknown>)
      : null;
  const id = nestedSkill?.id ?? record.skill_id ?? record.id;
  const label =
    nestedSkill?.name ??
    nestedSkill?.title ??
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

function mergeSkillOptions(...collections: unknown[][]) {
  const uniqueSkills = new Map<string, SkillOption>();

  collections
    .flat()
    .map(parseSkillOption)
    .filter((skill): skill is SkillOption => Boolean(skill))
    .forEach((skill) => {
      if (!uniqueSkills.has(skill.id)) {
        uniqueSkills.set(skill.id, skill);
      }
    });

  return Array.from(uniqueSkills.values());
}

function getArrayAtPath(value: unknown, path: string[]) {
  let current: unknown = value;

  for (const key of path) {
    if (!current || typeof current !== "object") {
      return [];
    }

    current = (current as Record<string, unknown>)[key];
  }

  return Array.isArray(current) ? current : [];
}

export async function getUserSkills({
  locale = "en",
  token,
}: {
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/user-skills?pagination=on&limit_per_page=100&page=1`,
    {
      method: "GET",
      locale,
      token,
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to load skills.");
  }

  return {
    suggested: mergeSkillOptions(
      getArrayAtPath(data, ["suggested"]),
      getArrayAtPath(data, ["data", "suggested"]),
      getArrayAtPath(data, ["data", "data", "suggested"]),
    ),
    skills: mergeSkillOptions(
      getArrayAtPath(data, ["skills"]),
      getArrayAtPath(data, ["data", "skills"]),
      getArrayAtPath(data, ["data", "data", "skills"]),
      getArrayAtPath(data, ["skills", "original", "data"]),
      getArrayAtPath(data, ["data", "skills", "original", "data"]),
      getArrayAtPath(data, ["data", "data", "skills", "original", "data"]),
      getArrayAtPath(data, ["skills", "original", "data", "data"]),
      getArrayAtPath(data, ["data", "skills", "original", "data", "data"]),
      getArrayAtPath(data, ["data", "data", "skills", "original", "data", "data"]),
    ),
  } satisfies UserSkillsCatalog;
}

export async function addUserSkills({
  skillIds,
  locale = "en",
  token,
}: {
  skillIds: string[];
  locale?: string;
  token: string;
}) {
  if (skillIds.length === 0) {
    return null;
  }

  const formData = new FormData();
  skillIds.forEach((id) => {
    formData.append("skills[]", id);
  });

  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-skills`, {
    method: "POST",
    locale,
    token,
    body: formData,
  });

  if (!ok) {
    throw new Error(message || "Failed to save skills.");
  }

  return data;
}

export async function updateUserSkills({
  skillIds,
  locale = "en",
  token,
}: {
  skillIds: string[];
  locale?: string;
  token: string;
}) {
  const formData = new FormData();
  skillIds.forEach((id) => {
    formData.append("skills[]", id);
  });
  formData.append("_method", "put");

  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-skills/`, {
    method: "POST",
    locale,
    token,
    body: formData,
  });

  if (!ok) {
    throw new Error(message || "Failed to update skills.");
  }

  return data;
}
