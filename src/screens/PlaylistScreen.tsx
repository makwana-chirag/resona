import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const mockPlaylists = [
  {
    id: 1,
    name: 'Chill Vibes',
    description: 'Relaxing tracks for unwinding',
    trackCount: 24,
    duration: '1h 32m',
    coverColor: '#60a5fa',
    tracks: ['Anti-Hero', 'Flowers', 'Unholy', 'As It Was']
  },
  {
    id: 2,
    name: 'Workout Energy',
    description: 'High-energy beats for your workout',
    trackCount: 18,
    duration: '1h 5m',
    coverColor: '#f87171',
    tracks: ['Cruel Summer', 'Levitating', 'Good 4 U', 'Industry Baby']
  },
  {
    id: 3,
    name: 'Study Focus',
    description: 'Instrumental and ambient music',
    trackCount: 32,
    duration: '2h 15m',
    coverColor: '#34d399',
    tracks: ['Weightless', 'Electric Feel', 'Midnight City', 'Starboy']
  },
  {
    id: 4,
    name: 'Road Trip',
    description: 'Perfect songs for the open road',
    trackCount: 28,
    duration: '1h 48m',
    coverColor: '#fbbf24',
    tracks: ['Sweet Caroline', 'Dont Stop Believin', 'Livin on a Prayer', 'Bohemian Rhapsody']
  },
  {
    id: 5,
    name: 'Party Mix',
    description: 'Get the party started',
    trackCount: 22,
    duration: '1h 20m',
    coverColor: '#a78bfa',
    tracks: ['Uptown Funk', 'Can\'t Stop the Feeling', 'Shake It Off', '24K Magic']
  },
  {
    id: 6,
    name: 'Acoustic Sessions',
    description: 'Unplugged and intimate',
    trackCount: 15,
    duration: '58m',
    coverColor: '#fb923c',
    tracks: ['Skinny Love', 'Ho Hey', 'Little Talks', 'Holocene']
  }
];

const filterOptions = ['All', 'Recently Played', 'Favorites', 'Created', 'Following'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 8
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6'
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b'
  },
  filterTextActive: {
    color: '#ffffff'
  },
  playlistGrid: {
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  playlistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  playlistCover: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playlistCoverText: {
    fontSize: 36,
    color: '#ffffff'
  },
  playlistInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },
  playlistName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4
  },
  playlistDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    flex: 1
  },
  playlistMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  playlistStats: {
    fontSize: 12,
    color: '#94a3b8',
    marginRight: 16
  },
  playButton: {
    backgroundColor: '#3b82f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  emptyStateText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16
  }
});

export const PlaylistScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filteredPlaylists, setFilteredPlaylists] = useState(mockPlaylists);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    
    if (filter === 'All') {
      setFilteredPlaylists(mockPlaylists);
    } else if (filter === 'Recently Played') {
      setFilteredPlaylists(mockPlaylists.slice(0, 3));
    } else if (filter === 'Favorites') {
      setFilteredPlaylists(mockPlaylists.slice(0, 2));
    } else if (filter === 'Created') {
      setFilteredPlaylists(mockPlaylists.slice(2, 4));
    } else if (filter === 'Following') {
      setFilteredPlaylists(mockPlaylists.slice(4, 6));
    }
  };

  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Playlists</Text>
        
        {/* Filter Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Playlist Grid */}
      <View style={styles.playlistGrid}>
        {filteredPlaylists.length > 0 ? (
          filteredPlaylists.map((playlist) => (
            <TouchableOpacity key={playlist.id} style={styles.playlistCard}>
              <View style={[styles.playlistCover, { backgroundColor: playlist.coverColor }]}>
                <Text style={styles.playlistCoverText}>🎵</Text>
              </View>
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistName}>{playlist.name}</Text>
                <Text style={styles.playlistDescription} numberOfLines={2}>
                  {playlist.description}
                </Text>
                <View style={styles.playlistMeta}>
                  <Text style={styles.playlistStats}>{playlist.trackCount} tracks</Text>
                  <Text style={styles.playlistStats}>{playlist.duration}</Text>
                  <TouchableOpacity style={styles.playButton}>
                    <Text style={styles.playButtonText}>▶</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No playlists found for "{selectedFilter}" filter
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};