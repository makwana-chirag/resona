import { useQuery } from "@tanstack/react-query";
import { searchService } from "./search.service";


const QUERY_KEYS = {
  artists: ['artists'] as const,
  songs: ['songs'] as const,
  albums: ['albums'] as const,
  playlists: ['playlists'] as const,
};

export const useSearchArtists = (search: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.artists,
    queryFn: () => searchService.searchArtists(search),
    enabled: search.length > 2,
  });
};
