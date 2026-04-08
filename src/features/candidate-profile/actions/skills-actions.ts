"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { addUserSkills, getUserSkills } from "../services/skills-client-service";

async function resolveCandidateToken() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.accessToken;
}

export async function saveSkillsAction({
  skillIds,
  skillLabels,
  locale = "en",
}: {
  skillIds?: string[];
  skillLabels?: string[];
  locale?: string;
}) {
  const token = await resolveCandidateToken();
  let resolvedSkillIds = skillIds ?? [];

  if (resolvedSkillIds.length === 0 && skillLabels && skillLabels.length > 0) {
    const currentSkills = await getUserSkills({
      locale,
      token,
    });

    const labelSet = new Set(skillLabels);
    resolvedSkillIds = currentSkills
      .filter((skill) => labelSet.has(skill.label))
      .map((skill) => skill.skillId);
  }

  await addUserSkills({
    skillIds: resolvedSkillIds,
    locale,
    token,
  });

  revalidatePath(`/${locale}/candidate/profile`);

  return {
    message: "Skills saved successfully.",
  };
}
