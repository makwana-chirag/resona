import { deezerClient } from './axios.client';
import type { 
  DeezerArtist, 
  DeezerAlbum, 
  DeezerTrack,
  DeezerSearchResponse 
} from '../api/dezzer.type';

// Cache keys for React Query
export const deezerKeys = {
  all: ['deezer'] as const,
  search: (type: string, query: string) => [...deezerKeys.all, 'search', type, query] as const,
  artist: (id: number) => [...deezerKeys.all, 'artist', id] as const,
  album: (id: number) => [...deezerKeys.all, 'album', id] as const,
  track: (id: number) => [...deezerKeys.all, 'track', id] as const,
  artistTopTracks: (id: number) => [...deezerKeys.all, 'artist', id, 'tracks'] as const,
  albumTracks: (id: number) => [...deezerKeys.all, 'album', id, 'tracks'] as const,
};

// Helper function to handle empty queries
const validateQuery = (query: string): boolean => {
  return !!(query && query.trim().length >= 2);
};

export const deezerService = {
  // Search artists with Axios
  searchArtists: async (query: string): Promise<DeezerArtist[]> => {
    if (!validateQuery(query)) return [];
    
    try {
      const response = await deezerClient.get<DeezerSearchResponse<DeezerArtist>>(
        '/search/artist',
        {
          params: {
            q: query,
            limit: 50,
          },
        }
      );
      
      return response.data.data || [];
    } catch (error) {
      console.error('Search artists error:', error);
      throw error;
    }
  },

  // Search albums
  searchAlbums: async (query: string): Promise<DeezerAlbum[]> => {
    if (!validateQuery(query)) return [];
    
    try {
      const response = await deezerClient.get<DeezerSearchResponse<DeezerAlbum>>(
        '/search/album',
        {
          params: {
            q: query,
            limit: 50,
          },
        }
      );
      
      return response.data.data || [];
    } catch (error) {
      console.error('Search albums error:', error);
      throw error;
    }
  },

  // Search tracks
  searchTracks: async (query: string): Promise<DeezerTrack[]> => {
    if (!validateQuery(query)) return [];
    
    try {
      const response = await deezerClient.get<DeezerSearchResponse<DeezerTrack>>(
        '/search/track',
        {
          params: {
            q: query,
            limit: 50,
          },
        }
      );
      
      return response.data.data || [];
    } catch (error) {
      console.error('Search tracks error:', error);
      throw error;
    }
  },

  // Get artist by ID
  getArtist: async (id: number): Promise<DeezerArtist | null> => {
    if (!id) return null;
    
    try {
      const response = await deezerClient.get<DeezerArtist>(`/artist/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get artist error:', error);
      return null;
    }
  },

  // Get album by ID
  getAlbum: async (id: number): Promise<DeezerAlbum | null> => {
    if (!id) return null;
    
    try {
      const response = await deezerClient.get<DeezerAlbum>(`/album/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get album error:', error);
      return null;
    }
  },

  // Get track by ID
  getTrack: async (id: number): Promise<DeezerTrack | null> => {
    if (!id) return null;
    
    try {
      const response = await deezerClient.get<DeezerTrack>(`/track/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get track error:', error);
      return null;
    }
  },

  // Get artist's top tracks
  getArtistTopTracks: async (artistId: number): Promise<DeezerTrack[]> => {
    if (!artistId) return [];
    
    try {
      const response = await deezerClient.get<DeezerSearchResponse<DeezerTrack>>(
        `/artist/${artistId}/top`,
        {
          params: { limit: 20 }
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Get artist top tracks error:', error);
      return [];
    }
  },

  // Get album tracks
  getAlbumTracks: async (albumId: number): Promise<DeezerTrack[]> => {
    if (!albumId) return [];
    
    try {
      const response = await deezerClient.get<DeezerSearchResponse<DeezerTrack>>(
        `/album/${albumId}/tracks`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Get album tracks error:', error);
      return [];
    }
  },

  // Batch requests (multiple requests in parallel)
  batchSearch: async (query: string) => {
    if (!validateQuery(query)) {
      return { artists: [], albums: [], tracks: [] };
    }

    try {
      const [artists, albums, tracks] = await Promise.all([
        deezerService.searchArtists(query),
        deezerService.searchAlbums(query),
        deezerService.searchTracks(query),
      ]);

      return { artists, albums, tracks };
    } catch (error) {
      console.error('Batch search error:', error);
      throw error;
    }
  },
};