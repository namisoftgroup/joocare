"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { addUserSkills, updateUserSkills } from "../services/skills-client-service";

async function resolveCandidateToken() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.accessToken;
}

export async function saveSkillsAction({
  skillIds,
  locale = "en",
}: {
  skillIds: string[];
  locale?: string;
}) {
  const token = await resolveCandidateToken();

  await addUserSkills({
    skillIds,
    locale,
    token,
  });

  revalidatePath(`/${locale}/candidate/profile`);

  return {
    message: "Skills saved successfully.",
  };
}

export async function updateSkillsAction({
  deletedSkillIds,
  locale = "en",
}: {
  deletedSkillIds: string[];
  locale?: string;
}) {
  const token = await resolveCandidateToken();

  await updateUserSkills({
    skillIds: deletedSkillIds,
    locale,
    token,
  });

  revalidatePath(`/${locale}/candidate/profile`);

  return {
    message: "Skills updated successfully.",
  };
}
