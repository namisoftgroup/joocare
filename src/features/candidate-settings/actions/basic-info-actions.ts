"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { updateCandidateBasicInfo } from "../services/basic-info-service";

async function resolveCandidateToken() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.accessToken;
}

export async function updateCandidateBasicInfoAction(formData: FormData) {
  const token = await resolveCandidateToken();
  const locale = typeof formData.get("locale") === "string" ? String(formData.get("locale")) : "en";

  await updateCandidateBasicInfo({
    formData,
    locale,
    token,
  });

  revalidatePath(`/${locale}/candidate/settings/basic-info`);
  revalidatePath(`/${locale}/candidate/profile`);

  return {
    message: "Profile updated successfully.",
  };
}
