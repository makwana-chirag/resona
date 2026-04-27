// track-player-service.ts
import TrackPlayer, { Event } from 'react-native-track-player';

export async function setupPlayer() {
  try {
    await TrackPlayer.setupPlayer({
      // Options for better performance
      maxCacheSize: 1024 * 1024 * 100, // 100 MB cache
      waitForBuffer: true,
    });
    console.log('Player setup complete');
    return true;
  } catch (error) {
    console.error('Error setting up player:', error);
    return false;
  }
}

export async function addTracks(tracks: any[]) {
  try {
    await TrackPlayer.add(tracks);
    console.log('Tracks added successfully');
  } catch (error) {
    console.error('Error adding tracks:', error);
  }
}

// Service handler for background playback
export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });
  
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });
  
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.reset();
  });
}