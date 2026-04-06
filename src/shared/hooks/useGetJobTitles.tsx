import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetJobTitles() {
    const query = useInfiniteQuery({
        queryKey: ["job-titles"],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/job-titles?page=${pageParam}&pagination=on&limit_per_page=5`
            );

            if (!res.ok) {
                throw new Error("Network error");
            }

            const data = await res.json();

            if (data.code !== 200) {
                throw new Error(data.message || "Something went wrong");
            }

            return data;
        },
        getNextPageParam: (lastPage) => {
            const url = lastPage?.next_page_url;
            if (!url) return undefined;
            const match = String(url).match(/[?&]page=(\d+)/);
            const nextPage = match?.[1] ? Number(match[1]) : undefined;
            return nextPage;
        },
    });

    return {
        ...query,
        jobTitles: query.data?.pages.flatMap((page) => page.data) ?? [],
    };
}
