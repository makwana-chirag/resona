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
  Animated,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { X, Search as SearchIcon, User, Music, ListMusic } from 'lucide-react-native';
import { useSearchAlbums, useSearchArtists, useSearchTracks } from '../../services/api/dezzer.queries';
import { useDebounce } from '../../hooks/queries/useDebounce';

type SearchTab = 'all' | 'artists' | 'albums' | 'songs';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  
  // Debounce the search query - only search after user stops typing
  const debouncedQuery = useDebounce(searchQuery, 600);

  // Fetch all three types of data - only when debounced query has 2+ characters
  const tracksQuery = useSearchTracks(debouncedQuery);
  const albumsQuery = useSearchAlbums(debouncedQuery);
  const artistsQuery = useSearchArtists(debouncedQuery);

  // Combined loading states
  const isLoading = debouncedQuery.length >= 2 && 
    (artistsQuery.isLoading || albumsQuery.isLoading || tracksQuery.isLoading);
  
  const isError = artistsQuery.isError || albumsQuery.isError || tracksQuery.isError;
  const isFetching = artistsQuery.isFetching || albumsQuery.isFetching || tracksQuery.isFetching;

  // Get data from each query
  const tracks = tracksQuery.data || [];
  const artists = artistsQuery.data || [];
  const albums = albumsQuery.data || [];

  // Debug logging
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      console.log('🔍 Searching for:', debouncedQuery);
      console.log('📊 Results - Artists:', artists.length, 'Albums:', albums.length, 'Tracks:', tracks.length);
    }
  }, [debouncedQuery, artists.length, albums.length, tracks.length]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Animation
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
      // Reset search when modal closes
      setSearchQuery('');
      setActiveTab('all');
    }
  }, [visible, slideAnim]);

  if (!visible) return null;

  // Render loading state
  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#6366F1" />
      <Text style={styles.loadingText}>Searching for "{debouncedQuery}"...</Text>
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>Failed to search. Please try again.</Text>
      <TouchableOpacity 
        onPress={() => {
          tracksQuery.refetch();
          albumsQuery.refetch();
          artistsQuery.refetch();
        }} 
        style={styles.retryButton}
      >
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Render individual result item
  const renderResultItem = (item: any, type: 'artist' | 'album' | 'track') => {
    const getImageUrl = () => {
      if (type === 'artist') return item.picture_medium;
      if (type === 'album') return item.cover_medium;
      return item.album?.cover_medium;
    };

    const getTitle = () => {
      if (type === 'artist') return item.name;
      if (type === 'album') return item.title;
      return item.title;
    };

    const getSubtitle = () => {
      if (type === 'artist') return `${item.nb_fan?.toLocaleString()} fans`;
      if (type === 'album') return item.artist?.name;
      return item.artist?.name;
    };

    const getDuration = () => {
      if (type === 'track' && item.duration) {
        const minutes = Math.floor(item.duration / 60);
        const seconds = item.duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      return null;
    };

    return (
      <TouchableOpacity 
        key={`${type}_${item.id}`}
        style={styles.resultItem}
        onPress={() => {
          console.log('Selected:', { type, item });
          onClose();
        }}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: getImageUrl() }} 
          style={styles.resultImage}
        />
        
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle} numberOfLines={1}>
            {getTitle()}
          </Text>
          <Text style={styles.resultSubtitle} numberOfLines={1}>
            {getSubtitle()}
          </Text>
          {getDuration() && (
            <Text style={styles.duration}>{getDuration()}</Text>
          )}
        </View>

        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {type === 'artist' ? 'Artist' : type === 'album' ? 'Album' : 'Song'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render section header
  const renderSectionHeader = (title: string, icon: React.ReactNode, count: number) => {
    if (count === 0) return null;
    
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Text style={styles.sectionCount}>{count}</Text>
      </View>
    );
  };

  // Render combined results (all sections)
  const renderCombinedResults = () => {
    // Don't show anything if still loading
    if (isLoading) return renderLoading();
    
    // Don't show anything if no results
    if (tracks.length === 0 && artists.length === 0 && albums.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyState}>
          <SearchIcon size={64} color="#E5E5EA" />
          <Text style={styles.emptyStateTitle}>No results found for "{debouncedQuery}"</Text>
          <Text style={styles.emptyStateText}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }
    
    return (
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {/* Songs Section - Show first as it's most relevant */}
        {tracks.length > 0 && (
          <View>
            {renderSectionHeader(
              'Songs', 
              <Music size={20} color="#6366F1" />, 
              tracks.length
            )}
            {tracks.slice(0, 5).map((track) => renderResultItem(track, 'track'))}
            {tracks.length > 5 && (
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={() => setActiveTab('songs')}
              >
                <Text style={styles.seeMoreText}>See all {tracks.length} songs</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Artists Section */}
        {artists.length > 0 && (
          <View style={styles.sectionSpacing}>
            {renderSectionHeader(
              'Artists', 
              <User size={20} color="#6366F1" />, 
              artists.length
            )}
            {artists.slice(0, 5).map((artist) => renderResultItem(artist, 'artist'))}
            {artists.length > 5 && (
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={() => setActiveTab('artists')}
              >
                <Text style={styles.seeMoreText}>See all {artists.length} artists</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Albums Section */}
        {albums.length > 0 && (
          <View style={styles.sectionSpacing}>
            {renderSectionHeader(
              'Albums', 
              <ListMusic size={20} color="#6366F1" />, 
              albums.length
            )}
            {albums.slice(0, 5).map((album) => renderResultItem(album, 'album'))}
            {albums.length > 5 && (
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={() => setActiveTab('albums')}
              >
                <Text style={styles.seeMoreText}>See all {albums.length} albums</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    );
  };

  // Render filtered results (single category)
  const renderFilteredResults = () => {
    let results: any[] = [];
    let type: 'artist' | 'album' | 'track' = 'artist';
    let title = '';

    switch (activeTab) {
      case 'artists':
        results = artists;
        type = 'artist';
        title = 'Artists';
        break;
      case 'albums':
        results = albums;
        type = 'album';
        title = 'Albums';
        break;
      case 'songs':
        results = tracks;
        type = 'track';
        title = 'Songs';
        break;
    }

    if (isLoading) return renderLoading();

    if (results.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyState}>
          <SearchIcon size={64} color="#E5E5EA" />
          <Text style={styles.emptyStateTitle}>No {title.toLowerCase()} found</Text>
          <Text style={styles.emptyStateText}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {renderSectionHeader(title, null, results.length)}
        {results.map((item) => renderResultItem(item, type))}
      </ScrollView>
    );
  };

  // Render content based on state
  const renderContent = () => {
    // No query entered yet
    if (searchQuery.length === 0) {
      return (
        <View style={styles.emptyState}>
          <SearchIcon size={64} color="#E5E5EA" />
          <Text style={styles.emptyStateTitle}>Search for music</Text>
          <Text style={styles.emptyStateText}>
            Find your favorite artists, albums, and songs
          </Text>
        </View>
      );
    }

    // Query too short
    if (searchQuery.length < 2 && searchQuery.length > 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Type at least 2 characters</Text>
          <Text style={styles.emptyStateText}>
            Enter more letters to start searching
          </Text>
        </View>
      );
    }

    // Error state
    if (isError) {
      return renderError();
    }

    // Show combined or filtered results
    if (activeTab === 'all') {
      return renderCombinedResults();
    } else {
      return renderFilteredResults();
    }
  };

  return (
    <Animated.View 
      style={[
        styles.overlay,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        {/* Header with close button */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <SearchIcon size={20} color="#8E8E93" />
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
              <TouchableOpacity onPress={clearSearch}>
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
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All
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
        </View>

        {/* Results Area */}
        {renderContent()}

        {/* Refreshing indicator */}
        {isFetching && !isLoading && debouncedQuery.length >= 2 && (
          <View style={styles.refreshingIndicator}>
            <ActivityIndicator size="small" color="#6366F1" />
            <Text style={styles.refreshingText}>Refreshing...</Text>
          </View>
        )}
      </SafeAreaView>
    </Animated.View>
  );
};

// Styles remain the same as your existing styles
const styles = StyleSheet.create({
  // ... (keep all your existing styles)
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
    gap: 8,
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
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    gap: 12,
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  duration: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  sectionCount: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  sectionSpacing: {
    marginTop: 16,
  },
  seeMoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    color: '#8E8E93',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
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
    paddingHorizontal: 32,
  },
  refreshingIndicator: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  refreshingText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});