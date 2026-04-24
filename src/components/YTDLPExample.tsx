import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import YTDLPService, { SearchResult } from '../services/YTDLPService';

const YTDLPExample = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<SearchResult | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    setIsLoading(true);
    try {
      const results = await YTDLPService.search(searchQuery, 10);
      setSearchResults(results);
      console.log('Search results:', results);
    } catch (error) {
      console.error('Search failed:', error);
      Alert.alert('Search Failed', error.message || 'Failed to search YouTube');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStreamUrl = async (video: SearchResult) => {
    try {
      const streamInfo = await YTDLPService.getStreamUrl(video.id);
      console.log('Stream URL:', streamInfo);
      Alert.alert(
        'Stream URL',
        `Stream URL for "${video.title}":\n${streamInfo.streamUrl}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to get stream URL:', error);
      Alert.alert('Error', 'Failed to get stream URL');
    }
  };

  const handleGetInfo = async (video: SearchResult) => {
    try {
      const info = await YTDLPService.getInfo(video.id);
      console.log('Video info:', info);
      Alert.alert(
        'Video Info',
        `Title: ${info.title}\nUploader: ${info.uploader}\nDuration: ${info.duration}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to get video info:', error);
      Alert.alert('Error', 'Failed to get video info');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 YTDLP Music Streaming</Text>
      <Text style={styles.subtitle}>Search YouTube for music</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter song or artist name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {searchResults.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{result.title}</Text>
              <Text style={styles.resultDuration}>{result.duration}</Text>
            </View>
            <Text style={styles.resultArtist}>{result.uploader}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleGetStreamUrl(result)}
              >
                <Text style={styles.actionButtonText}>Get Stream</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleGetInfo(result)}
              >
                <Text style={styles.actionButtonText}>Get Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          ℹ️ Using mock data for demo. Native YTDLP module will be connected next.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff80',
    textAlign: 'center',
    marginBottom: 30,
  },
  searchContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff20',
    color: '#ffffff',
    fontSize: 16,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffffff40',
  },
  button: {
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: '#ffffff10',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  resultDuration: {
    color: '#ffffff80',
    fontSize: 14,
  },
  resultArtist: {
    color: '#ffffff80',
    fontSize: 14,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#007AFF20',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  infoText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default YTDLPExample;
