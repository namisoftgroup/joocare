import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";

type RegisterEmployerPayload = {
    name: string;
    email: string;
    domain_id: number;
    password: string;
    person_name: string;
    person_phone: string;
    person_phone_code: string;
};

export const registerEmployerService = async (data: RegisterEmployerPayload) => {
    const response = await fetch(`${getCompanyApiUrl()}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
};
