import { DeezerArtist, DeezerAlbum, DeezerTrack } from './dezzer.type';

const DEEZER_API = process.env.DEEZER_API_BASE_URL;

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

export const deezerService = {
  // Search artists with built-in caching
  searchArtists: async (query: string): Promise<DeezerArtist[]> => {
    if (!query || query.length < 2) return [];
    
    const response = await fetch(
      `${DEEZER_API}/search/artist?q=${encodeURIComponent(query)}&limit=50`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to search artists: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  },

  // Search albums
  searchAlbums: async (query: string): Promise<DeezerAlbum[]> => {
    if (!query || query.length < 2) return [];
    
    const response = await fetch(
      `${DEEZER_API}/search/album?q=${encodeURIComponent(query)}&limit=50`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to search albums: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  },

  // Search tracks
  searchTracks: async (query: string): Promise<DeezerTrack[]> => {
    if (!query || query.length < 2) return [];
    
    const response = await fetch(
      `${DEEZER_API}/search/track?q=${encodeURIComponent(query)}&limit=50`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to search tracks: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  },

  // Get artist by ID (for detail views)
  getArtist: async (id: number): Promise<DeezerArtist | null> => {
    const response = await fetch(`${DEEZER_API}/artist/${id}`);
    if (!response.ok) return null;
    return response.json();
  },

  // Get album by ID
  getAlbum: async (id: number): Promise<DeezerAlbum | null> => {
    const response = await fetch(`${DEEZER_API}/album/${id}`);
    if (!response.ok) return null;
    return response.json();
  },

  // Get track by ID
  getTrack: async (id: number): Promise<DeezerTrack | null> => {
    const response = await fetch(`${DEEZER_API}/track/${id}`);
    if (!response.ok) return null;
    return response.json();
  },

  // Get artist's top tracks
  getArtistTopTracks: async (artistId: number): Promise<DeezerTrack[]> => {
    const response = await fetch(`${DEEZER_API}/artist/${artistId}/top?limit=20`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  },

  // Get album tracks
  getAlbumTracks: async (albumId: number): Promise<DeezerTrack[]> => {
    const response = await fetch(`${DEEZER_API}/album/${albumId}/tracks`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  },
};