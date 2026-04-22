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

// Helper function to validate query
const validateQuery = (query: string): boolean => {
  return !!(query && query.trim().length >= 2);
};

export const deezerService = {
  // Search artists
  searchArtists: async (query: string): Promise<DeezerArtist[]> => {
    if (!validateQuery(query)) return [];
    
    try {
      console.log('🔍 Searching artists for:', query);
      const response = await deezerClient.get<DeezerSearchResponse<DeezerArtist>>(
        '/search/artist',
        {
          params: {
            q: query,
            limit: 20, // Reduced limit for faster responses
          },
        }
      );
      
      console.log('✅ Artists found:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error) {
      console.error('Search artists error:', error);
      return [];
    }
  },

  // Search albums
  searchAlbums: async (query: string): Promise<DeezerAlbum[]> => {
    if (!validateQuery(query)) return [];
    
    try {
      console.log('🔍 Searching albums for:', query);
      const response = await deezerClient.get<DeezerSearchResponse<DeezerAlbum>>(
        '/search/album',
        {
          params: {
            q: query,
            limit: 20,
          },
        }
      );
      
      console.log('✅ Albums found:', response.data.data?.length || 0);
      return response.data.data || [];
    } catch (error) {
      console.error('Search albums error:', error);
      return [];
    }
  },

  // Search tracks
  searchTracks: async (query: string): Promise<DeezerTrack[]> => {
    if (!validateQuery(query)) return [];
    
    try {
      console.log('🔍 Searching tracks for:', query);
      const response = await deezerClient.get<DeezerSearchResponse<DeezerTrack>>(
        '/search/track',
        {
          params: {
            q: query,
            limit: 20,
          },
        }
      );
      
      console.log('✅ Tracks found:', response.data.data?.length || 0);
      console.log('📊 Total tracks available:', response.data.total);
      
      // Log first track for debugging
      if (response.data.data && response.data.data.length > 0) {
        console.log('🎵 First track sample:', {
          title: response.data.data[0].title,
          artist: response.data.data[0].artist?.name,
        });
      }
      
      return response.data.data || [];
    } catch (error) {
      console.error('Search tracks error:', error);
      return [];
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
};