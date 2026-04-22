import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated, // Use React Native's built-in Animated
} from 'react-native';
import { X, Search as SearchIcon, User, Music, ListMusic } from 'lucide-react-native';
import { useSearchAlbums, useSearchArtists, useSearchTracks } from '../../services/api/dezzer.queries';
// import { useDebounce } from '../../hooks/useDebounce';
// import { localDatabase } from '../../database/localDatabase';
// import { TrackedSong } from '../../types/song';

type SearchTab = 'artists' | 'albums' | 'songs';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  console.log("🚀 ~ SearchModal ~ searchQuery:", searchQuery)
  const [activeTab, setActiveTab] = useState<SearchTab>('artists');
//    const debouncedQuery = useDebounce(searchQuery, 500);

  // React Query hooks with automatic caching
  const artistsQuery = useSearchArtists(searchQuery);
  console.log("🚀 ~ SearchModal ~ artistsQuery:", artistsQuery)
  
  const albumsQuery = useSearchAlbums(searchQuery);
  
  
  const tracksQuery = useSearchTracks(searchQuery);

  // Get the current query based on active tab
  const currentQuery = () => {
    switch (activeTab) {
      case 'artists': return artistsQuery;
      case 'albums': return albumsQuery;
      case 'songs': return tracksQuery;
    }
  };

//   const { data: results = [], isLoading, isError, error, refetch, isFetching } = currentQuery();

//   const handleSelectItem = async (item: any) => {
//     if (activeTab === 'songs') {
//       const trackedSong: TrackedSong = {
//         id: `deezer_${item.id}`,
//         deezerId: item.id,
//         title: item.title,
//         artist: item.artist.name,
//         album: item.album.title,
//         albumArt: item.album.cover_medium,
//         addedAt: Date.now(),
//         lastPlayedAt: 0,
//         playCount: 0,
//         totalDuration: item.duration,
//         favorite: false
//       };
      
//       await localDatabase.saveSong(trackedSong);
//       onSongSelected?.(trackedSong);
//     }
//     onClose();
//     setSearchQuery('');
//   };

  const clearSearch = () => {
    setSearchQuery('');
  };


  // Simple animation without worklets
  const slideAnim = useState(new Animated.Value(1000))[0];

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        mass: 1,
        stiffness: 100,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#000000" />
      <SafeAreaView style={styles.container}>
        {/* Header with close button */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <SearchIcon size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search artists, albums, or songs..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Tabs for result filtering */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'artists' && styles.activeTab]}
            onPress={() => setActiveTab('artists')}
          >
            <User size={18} color={activeTab === 'artists' ? '#6366F1' : '#8E8E93'} />
            <Text style={[styles.tabText, activeTab === 'artists' && styles.activeTabText]}>
              Artists
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'albums' && styles.activeTab]}
            onPress={() => setActiveTab('albums')}
          >
            <ListMusic size={18} color={activeTab === 'albums' ? '#6366F1' : '#8E8E93'} />
            <Text style={[styles.tabText, activeTab === 'albums' && styles.activeTabText]}>
              Albums
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'songs' && styles.activeTab]}
            onPress={() => setActiveTab('songs')}
          >
            <Music size={18} color={activeTab === 'songs' ? '#6366F1' : '#8E8E93'} />
            <Text style={[styles.tabText, activeTab === 'songs' && styles.activeTabText]}>
              Songs
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Area */}
        <View style={styles.resultsContainer}>
          {searchQuery.length === 0 ? (
            <View style={styles.emptyState}>
              <SearchIcon size={64} color="#E5E5EA" />
              <Text style={styles.emptyStateTitle}>Search for music</Text>
              <Text style={styles.emptyStateText}>
                Find your favorite artists, albums, and songs
              </Text>
            </View>
          ) : (
            <View style={styles.resultsList}>
              <Text style={styles.placeholderText}>
                Showing {activeTab} results for "{searchQuery}"
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

// Styles remain exactly the same as before
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 24,
    gap: 8,
    backgroundColor: '#F2F2F7',
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#6366F1',
  },
  resultsContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  resultsList: {
    flex: 1,
    padding: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
  },
});