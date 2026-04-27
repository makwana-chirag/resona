import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { deezerService, deezerKeys } from './dezzer.service';
import { DeezerArtist, DeezerAlbum, DeezerTrack } from './dezzer.type';

// Search Artists with caching
export const useSearchArtists = (query: string, options?: UseQueryOptions<DeezerArtist[]>) => {
  return useQuery({
    queryKey: deezerKeys.search('artists', query),
    queryFn: () => deezerService.searchArtists(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
};

// Search Albums with caching
export const useSearchAlbums = (query: string, options?: UseQueryOptions<DeezerAlbum[]>) => {
  return useQuery({
    queryKey: deezerKeys.search('albums', query),
    queryFn: () => deezerService.searchAlbums(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

// Search Tracks with caching
export const useSearchTracks = (query: string, options?: UseQueryOptions<DeezerTrack[]>) => {
  return useQuery({
    queryKey: deezerKeys.search('tracks', query),
    queryFn: () => deezerService.searchTracks(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

// Get single artist
export const useArtist = (id: number | null, options?: UseQueryOptions<DeezerArtist | null>) => {
  return useQuery({
    queryKey: deezerKeys.artist(id!),
    queryFn: () => deezerService.getArtist(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // 30 minutes for detail views
    ...options,
  });
};

// Get single album
export const useAlbum = (id: number | null, options?: UseQueryOptions<DeezerAlbum | null>) => {
  return useQuery({
    queryKey: deezerKeys.album(id!),
    queryFn: () => deezerService.getAlbum(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};

// Get artist's top tracks
export const useArtistTopTracks = (artistId: number | null, options?: UseQueryOptions<DeezerTrack[]>) => {
  return useQuery({
    queryKey: deezerKeys.artistTopTracks(artistId!),
    queryFn: () => deezerService.getArtistTopTracks(artistId!),
    enabled: !!artistId,
    staleTime: 1000 * 60 * 15,
    ...options,
  });
};

// Get album tracks
export const useAlbumTracks = (albumId: number | null, options?: UseQueryOptions<DeezerTrack[]>) => {
  return useQuery({
    queryKey: deezerKeys.albumTracks(albumId!),
    queryFn: () => deezerService.getAlbumTracks(albumId!),
    enabled: !!albumId,
    staleTime: 1000 * 60 * 15,
    ...options,
  });
};

// Combined search hook for all types
export const useMultiSearch = (query: string) => {
  const artists = useSearchArtists(query);
  const albums = useSearchAlbums(query);
  const tracks = useSearchTracks(query);

  return {
    artists,
    albums,
    tracks,
    isLoading: artists.isLoading || albums.isLoading || tracks.isLoading,
    isError: artists.isError || albums.isError || tracks.isError,
    error: artists.error || albums.error || tracks.error,
  };
};