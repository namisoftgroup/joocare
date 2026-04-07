import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch, type ApiResult } from "@/shared/lib/fetch-manager";

type ChangePasswordPayload = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export async function changePasswordService(
    payload: ChangePasswordPayload,
    { token }: { token: string },
): Promise<ApiResult> {
    const response = await apiFetch(
        `${getUserApiUrl()}/auth/change-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            token: token,
        }
    );

    if (!response.ok) {
        throw new Error(response.message ?? "Failed to change password");
    }
    return response;
}
