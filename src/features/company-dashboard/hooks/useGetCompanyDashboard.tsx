import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetCompanyDashboard({ token }: { token: string }) {
    const query = useInfiniteQuery({
        queryKey: ["company-dashboard"],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams({
                page: String(pageParam),
                pagination: "on",
                limit_per_page: "10",
            });

            const res = await apiFetch(`${getCompanyApiUrl()}/dashboard?${params.toString()}`, {
                method: "GET",
                token,
            });
            console.log("res dashboard", res);

            if (!res.ok) {
                throw new Error("Network error");
            }

            const data = await res?.data?.data

            return data;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage?.next_page_url) return undefined;

            const url = new URL(lastPage.next_page_url);
            const page = Number(url.searchParams.get("page"));
            return Number.isNaN(page) ? undefined : page;
        }
    });

    return {
        ...query,
        countries: query.data?.pages.flatMap((page) => page.data) ?? [],
    };
}
