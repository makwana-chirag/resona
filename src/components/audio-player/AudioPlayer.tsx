// App.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  Capability,
} from 'react-native-track-player';
import { setupPlayer, addTracks } from '../../../track-player-service';
import ProgressBar from './components/PgressBar';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react-native';

// Sample tracks - replace with your own audio URLs
const initialTracks = [
  {
    id: '1',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: 'Song 1 - Acoustic',
    artist: 'SoundHelix',
    artwork: 'https://picsum.photos/200/200?random=1',
    duration: 237, // optional
  },
  {
    id: '2',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    title: 'Song 2 - Rock',
    artist: 'SoundHelix',
    artwork: 'https://picsum.photos/200/200?random=2',
    duration: 215,
  },
  {
    id: '3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    title: 'Song 3 - Jazz',
    artist: 'SoundHelix',
    artwork: 'https://picsum.photos/200/200?random=3',
    duration: 198,
  },
];


// Main Player Component
const AudioPlayer = () => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [tracks, setTracks] = useState(initialTracks);

  // Setup player on component mount
  useEffect(() => {
    const initializePlayer = async () => {
      const ready = await setupPlayer();
      if (ready) {
        // Enable capabilities for controls
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [Capability.Play, Capability.Pause],
        });
        
        await addTracks(initialTracks);
        setIsPlayerReady(true);
        
        // Get current track info
        const track = await TrackPlayer.getCurrentTrack();
        if (track !== null) {
          const trackObject = await TrackPlayer.getTrack(track);
          setCurrentTrack(trackObject);
        }
      }
    };
    
    initializePlayer();
    
    // Cleanup on unmount
    return () => {
      TrackPlayer.stop();
      TrackPlayer.reset();
    };
  }, []);

  // Listen to player events
  useTrackPlayerEvents([Event.PlaybackState, Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackState) {
      setIsPlaying(event.state === State.Playing);
    }
    if (event.type === Event.PlaybackTrackChanged) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(track);
    }
  });

  const handlePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleNext = async () => {
    await TrackPlayer.skipToNext();
  };

  const handlePrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const handleTrackSelect = async (trackId: number) => {
    await TrackPlayer.skip(trackId);
    await TrackPlayer.play();
  };

  const renderTrackItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity 
      style={[
        styles.trackItem,
        currentTrack?.id === item.id && styles.activeTrack
      ]} 
      onPress={() => handleTrackSelect(index)}
    >
      <Image source={{ uri: item.artwork }} style={styles.trackArtwork} />
      <View style={styles.trackInfo}>
        <Text style={[
          styles.trackTitle,
          currentTrack?.id === item.id && styles.activeTrackText
        ]}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist}>{item.artist}</Text>
      </View>
      {currentTrack?.id === item.id && (
        <Text style={styles.nowPlaying}>Now Playing</Text>
      )}
    </TouchableOpacity>
  );

  if (!isPlayerReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing Player...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Now Playing Section */}
      <View style={styles.nowPlayingSection}>
        <Image 
          source={{ uri: currentTrack?.artwork || 'https://picsum.photos/300/300' }} 
          style={styles.largeArtwork} 
        />
        <Text style={styles.nowPlayingTitle}>{currentTrack?.title || 'No Track Selected'}</Text>
        <Text style={styles.nowPlayingArtist}>{currentTrack?.artist || ''}</Text>
        
        <ProgressBar />
        
        {/* Playback Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
            <Text style={styles.controlText}><ChevronLeft size={35} color="#fff" /></Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handlePlayPause} style={[styles.controlButton, styles.playButton]}>
            <Text style={[styles.controlText, styles.playButtonText]}>
              {isPlaying ? <Pause size={35} color="#fff" /> : <Play size={35} color="#fff" />}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
            <Text style={styles.controlText}><ChevronRight size={35} color="#fff" /></Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Playlist Section */}
      <View style={styles.playlistSection}>
        <Text style={styles.playlistTitle}>Playlist</Text>
        <FlatList
          data={tracks}
          renderItem={renderTrackItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  nowPlayingSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  largeArtwork: {
    width: 250,
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },
  nowPlayingTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  nowPlayingArtist: {
    color: '#999',
    fontSize: 16,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    marginHorizontal: 15,
    padding: 10,
  },
  playButton: {
    backgroundColor: '#1DB954',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 30,
    color: '#fff',
  },
  playButtonText: {
    fontSize: 35,
  },
  playlistSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  playlistTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  activeTrack: {
    backgroundColor: '#1DB95420',
  },
  trackArtwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  trackArtist: {
    color: '#999',
    fontSize: 14,
  },
  activeTrackText: {
    color: '#1DB954',
  },
  nowPlaying: {
    color: '#1DB954',
    fontSize: 12,
  },
});

export default AudioPlayer;