import { useQuery } from "@tanstack/react-query";
import { fetchAlbums } from "@/services/albumService";

export const useAlbums = () => {
  return useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
