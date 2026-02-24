import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAlbums, fetchSongs } from "@/services/api";

export const useAlbums = () => {
  return useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnect
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};

export const useSearch = (debouncedQuery: string) => {
  return useQuery({
    queryKey: ["searchSongs", debouncedQuery],
    queryFn: () => fetchSongs(debouncedQuery),
    enabled: !!debouncedQuery.trim(),
    staleTime: 30_000,// 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnect
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    placeholderData: keepPreviousData,
  });
};
