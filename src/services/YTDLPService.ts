import { NativeModules, Platform } from 'react-native';

const { YTDLPModule } = NativeModules;

export interface SearchResult {
  id: string;
  title: string;
  uploader: string;
  duration: string;
  url?: string;
  thumbnail?: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  uploader: string;
  duration: string;
  upload_date: string;
  description?: string;
  thumbnail?: string;
}

export interface StreamUrl {
  streamUrl: string;
  format?: string;
  quality?: string;
}

class YTDLPService {
  // Search YouTube videos
  static async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      if (!YTDLPModule) {
        console.log('YTDLP module not available, returning mock results');
        // Return mock results for testing
        return [
          {
            id: 'mock1',
            title: `${query} - Mock Song 1`,
            uploader: 'Mock Artist 1',
            duration: '3:45',
          },
          {
            id: 'mock2',
            title: `${query} - Mock Song 2`,
            uploader: 'Mock Artist 2',
            duration: '4:20',
          },
          {
            id: 'mock3',
            title: `${query} - Mock Song 3`,
            uploader: 'Mock Artist 3',
            duration: '2:58',
          },
        ];
      }

      const results = await YTDLPModule.search(query, limit);
      return results || [];
    } catch (error) {
      console.error('YTDLP Search Error:', error);
      // Return mock results on error
      return [
        {
          id: 'error1',
          title: `${query} - Error Fallback`,
          uploader: 'Error Artist',
          duration: '3:33',
        },
      ];
    }
  }

  // Get stream URL for a video
  static async getStreamUrl(videoId: string): Promise<StreamUrl> {
    try {
      if (!YTDLPModule) {
        console.log('YTDLP module not available, returning mock stream URL');
        return {
          streamUrl: `https://mock-stream-url.com/stream/${videoId}`,
          format: 'audio/mp4',
          quality: '128kbps',
        };
      }

      const result = await YTDLPModule.getStreamUrl(videoId);
      return result;
    } catch (error) {
      console.error('YTDLP Stream URL Error:', error);
      return {
        streamUrl: `https://mock-stream-url.com/stream/${videoId}`,
        format: 'audio/mp4',
        quality: '128kbps',
      };
    }
  }

  // Get video information
  static async getInfo(videoId: string): Promise<VideoInfo> {
    try {
      if (!YTDLPModule) {
        console.log('YTDLP module not available, returning mock info');
        return {
          id: videoId,
          title: `Mock Video Title for ${videoId}`,
          uploader: 'Mock Channel',
          duration: '3:45',
          upload_date: '20240101',
          description: 'This is a mock video description',
        };
      }

      const info = await YTDLPModule.getInfo(videoId);
      return info;
    } catch (error) {
      console.error('YTDLP Info Error:', error);
      return {
        id: videoId,
        title: `Error Video Title for ${videoId}`,
        uploader: 'Error Channel',
        duration: '0:00',
        upload_date: '20240101',
        description: 'Error occurred while fetching video info',
      };
    }
  }

  // Check if YTDLP is available
  static isAvailable(): boolean {
    return !!YTDLPModule;
  }

  // Get platform-specific yt-dlp path
  static getYTDLPPath(): string {
    if (Platform.OS === 'ios') {
      return '/usr/local/bin/yt-dlp'; // Homebrew path on iOS
    } else if (Platform.OS === 'android') {
      return 'yt-dlp'; // Should be in PATH on Android (Termux)
    }
    return 'yt-dlp';
  }
}

export default YTDLPService;
