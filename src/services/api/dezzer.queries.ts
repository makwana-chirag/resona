import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { deezerService, deezerKeys } from './dezzer.service';
import { DeezerArtist, DeezerAlbum, DeezerTrack } from './dezzer.type';

// Search Artists - Always enabled if query has 2+ characters
export const useSearchArtists = (
  query: string, 
  options?: UseQueryOptions<DeezerArtist[], Error>
) => {
  return useQuery({
    queryKey: deezerKeys.search('artists', query),
    queryFn: () => deezerService.searchArtists(query),
    enabled: query.length >= 2, // Remove the activeTab condition
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    ...options,
  });
};

// Search Albums - Always enabled if query has 2+ characters
export const useSearchAlbums = (
  query: string, 
  options?: UseQueryOptions<DeezerAlbum[], Error>
) => {
  return useQuery({
    queryKey: deezerKeys.search('albums', query),
    queryFn: () => deezerService.searchAlbums(query),
    enabled: query.length >= 2, // Remove the activeTab condition
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

// Search Tracks - Always enabled if query has 2+ characters
export const useSearchTracks = (
  query: string, 
  options?: UseQueryOptions<DeezerTrack[], Error>
) => {
  return useQuery({
    queryKey: deezerKeys.search('tracks', query),
    queryFn: () => deezerService.searchTracks(query),
    enabled: query.length >= 2, // Remove the activeTab condition
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

// Get Artist
export const useArtist = (
  id: number | null,
  options?: UseQueryOptions<DeezerArtist | null, Error>
) => {
  return useQuery({
    queryKey: deezerKeys.artist(id!),
    queryFn: () => deezerService.getArtist(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

// Get Album
export const useAlbum = (
  id: number | null,
  options?: UseQueryOptions<DeezerAlbum | null, Error>
) => {
  return useQuery({
    queryKey: deezerKeys.album(id!),
    queryFn: () => deezerService.getAlbum(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

// Get Track
export const useTrack = (
  id: number | null,
  options?: UseQueryOptions<DeezerTrack | null, Error>
) => {
  return useQuery({
    queryKey: deezerKeys.track(id!),
    queryFn: () => deezerService.getTrack(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

// Get artist's top tracks
// export const useArtistTopTracks = (
//   artistId: number | null,
//   options?: UseQueryOptions<DeezerTrack[], Error>
// ) => {
//   return useQuery({
//     queryKey: deezerKeys.artistTopTracks(artistId!),
//     queryFn: () => deezerService.getArtistTopTracks(artistId!),
//     enabled: !!artistId,
//     staleTime: 1000 * 60 * 15,
//     ...options,
//   });
// };

// Get album tracks
// export const useAlbumTracks = (
//   albumId: number | null,
//   options?: UseQueryOptions<DeezerTrack[], Error>
// ) => {
//   return useQuery({
//     queryKey: deezerKeys.albumTracks(albumId!),
//     queryFn: () => deezerService.getAlbumTracks(albumId!),
//     enabled: !!albumId,
//     staleTime: 1000 * 60 * 15,
//     ...options,
//   });
// };

// Batch Search Hook - All queries run simultaneously
export const useBatchSearch = (query: string) => {
  const albumsQuery = useSearchAlbums(query);
  const artistsQuery = useSearchArtists(query);
  const tracksQuery = useSearchTracks(query);

  return {
    artists: artistsQuery,
    albums: albumsQuery,
    tracks: tracksQuery,
    isLoading: artistsQuery.isLoading || albumsQuery.isLoading || tracksQuery.isLoading,
    isFetching: artistsQuery.isFetching || albumsQuery.isFetching || tracksQuery.isFetching,
    isError: artistsQuery.isError || albumsQuery.isError || tracksQuery.isError,
    error: artistsQuery.error || albumsQuery.error || tracksQuery.error,
    refetchAll: () => {
      artistsQuery.refetch();
      albumsQuery.refetch();
      tracksQuery.refetch();
    },
  };
};