import { NativeModules } from 'react-native';

const { YTDLPModule } = NativeModules;

export interface YTSearchResult {
  id: string;
  title: string;
  uploader: string;
  duration: number;
  thumbnail: string;
  type: 'artist' | 'album' | 'song';
  isArtist?: boolean;
  isAlbum?: boolean;
}

// Better check for native module availability
const isNativeModuleAvailable = () => {
  const isAvailable = !!(YTDLPModule && typeof YTDLPModule.search === 'function');
  console.log('📱 Native module check:', {
    exists: !!YTDLPModule,
    hasSearch: YTDLPModule ? typeof YTDLPModule.search : 'no module',
    isAvailable
  });
  return isAvailable;
};

// Test the native module
export const testNativeModule = async () => {
  if (!YTDLPModule) {
    console.log('❌ YTDLPModule is null/undefined');
    return false;
  }
  
  try {
    if (typeof YTDLPModule.test === 'function') {
      const result = await YTDLPModule.test();
      console.log('✅ Native module test result:', result);
      return true;
    }
    console.log('⚠️ YTDLPModule exists but no test method');
    return false;
  } catch (error) {
    console.error('❌ Native module test failed:', error);
    return false;
  }
};

export const ytdlpService = {
  // Search all types (songs, artists, albums)
  searchAll: async (query: string): Promise<{
    songs: YTSearchResult[];
    artists: YTSearchResult[];
    albums: YTSearchResult[];
  }> => {
    if (!query || query.length < 2) {
      return { songs: [], artists: [], albums: [] };
    }

    const nativeAvailable = isNativeModuleAvailable();
    console.log(`🔍 Search for "${query}" - Native available: ${nativeAvailable}`);

    // Try to use real yt-dlp if available
    if (nativeAvailable) {
      try {
        console.log('🎵 Using real yt-dlp for search:', query);
        const result = await YTDLPModule.search(query, 30);
        
        console.log('📊 Raw result length:', result?.length);
        
        const allResults = result
          .split('\n')
          .filter((line: string) => line.trim())
          .map((line: string) => JSON.parse(line))
          .map((video: any) => ({
            id: video.id,
            title: video.title,
            uploader: video.uploader || 'Unknown Artist',
            duration: video.duration || 0,
            thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
            type: 'song' as const,
          }));

        console.log('🎵 Real results count:', allResults.length);
        
        // Filter out topic channels
        const songs = allResults.filter(
          r => !r.uploader.toLowerCase().includes('topic') && r.type === 'song'
        );
        
        // Extract unique artists
        const artistMap = new Map();
        songs.forEach(song => {
          const artistName = song.uploader;
          if (!artistMap.has(artistName)) {
            artistMap.set(artistName, {
              id: `artist_${artistName.replace(/\s/g, '_')}`,
              title: artistName,
              uploader: artistName,
              duration: 0,
              thumbnail: song.thumbnail,
              type: 'artist' as const,
              isArtist: true,
            });
          }
        });
        const artists = Array.from(artistMap.values()).slice(0, 10);
        
        return { songs, artists, albums: [] };
      } catch (error) {
        console.error('Real yt-dlp failed, using mock:', error);
      }
    }

    // Fallback to mock data
    console.log('📱 Using mock data for search:', query);
    return {
      songs: [
        {
          id: `mock_song_1_${Date.now()}`,
          title: `${query} - Song 1`,
          uploader: 'Artist Name',
          duration: 225,
          thumbnail: 'https://picsum.photos/56/56?random=1',
          type: 'song',
        },
        {
          id: `mock_song_2_${Date.now()}`,
          title: `${query} - Song 2`,
          uploader: 'Artist Name',
          duration: 260,
          thumbnail: 'https://picsum.photos/56/56?random=2',
          type: 'song',
        },
        {
          id: `mock_song_3_${Date.now()}`,
          title: `${query} - Song 3`,
          uploader: 'Another Artist',
          duration: 198,
          thumbnail: 'https://picsum.photos/56/56?random=3',
          type: 'song',
        },
      ],
      artists: [
        {
          id: `mock_artist_1_${Date.now()}`,
          title: 'Artist Name',
          uploader: 'Artist Name',
          duration: 0,
          thumbnail: 'https://picsum.photos/56/56?random=4',
          type: 'artist',
          isArtist: true,
        },
        {
          id: `mock_artist_2_${Date.now()}`,
          title: 'Another Artist',
          uploader: 'Another Artist',
          duration: 0,
          thumbnail: 'https://picsum.photos/56/56?random=5',
          type: 'artist',
          isArtist: true,
        },
      ],
      albums: [],
    };
  },

  // Search only songs
  searchSongs: async (query: string): Promise<YTSearchResult[]> => {
    const results = await ytdlpService.searchAll(query);
    return results.songs;
  },

  // Search only artists
  searchArtists: async (query: string): Promise<YTSearchResult[]> => {
    const results = await ytdlpService.searchAll(query);
    return results.artists;
  },

  // Get stream URL for playing
  getStreamUrl: async (videoId: string): Promise<string> => {
    if (isNativeModuleAvailable()) {
      try {
        return await YTDLPModule.getStreamUrl(videoId);
      } catch (error) {
        console.error('Failed to get stream URL:', error);
      }
    }
    return `https://mock-stream-url.com/stream/${videoId}`;
  },

  // Get video info
  getInfo: async (videoId: string): Promise<any> => {
    if (isNativeModuleAvailable()) {
      try {
        const info = await YTDLPModule.getInfo(videoId);
        return JSON.parse(info);
      } catch (error) {
        console.error('Failed to get video info:', error);
      }
    }
    return {
      id: videoId,
      title: `Mock Video Title`,
      uploader: 'Mock Channel',
      duration: 225,
      upload_date: '20240101',
    };
  },
};