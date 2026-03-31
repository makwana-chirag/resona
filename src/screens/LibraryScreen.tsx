import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { User, Music, ListMusic, Disc, BarChart3, TrendingUp, Clock, Heart, Download } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type TabType = 'artists' | 'songs' | 'playlists' | 'albums' | 'statistics';

const tabs = [
  { id: 'artists' as TabType, label: 'Artists', icon: User },
  { id: 'songs' as TabType, label: 'Songs', icon: Music },
  { id: 'playlists' as TabType, label: 'Playlists', icon: ListMusic },
  { id: 'albums' as TabType, label: 'Albums', icon: Disc },
  { id: 'statistics' as TabType, label: 'Statistics', icon: BarChart3 },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tabScrollView: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#1e293b',
  },
  inactiveTab: {
    backgroundColor: '#f1f5f9',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
  },
  inactiveTabText: {
    color: '#64748b',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  artistAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  artistName: {
    fontWeight: '600',
    color: '#1e293b',
  },
  artistSongs: {
    fontSize: 14,
    color: '#64748b',
  },
  heartButton: {
    width: 32,
    height: 32,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  songIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songInfo: {
    flex: 1,
    marginLeft: 16,
  },
  songTitle: {
    fontWeight: '600',
    color: '#1e293b',
  },
  songDetails: {
    fontSize: 14,
    color: '#64748b',
  },
  downloadButton: {
    width: 32,
    height: 32,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  playlistCard: {
    width: (width - 56) / 2,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
  },
  playlistCover: {
    width: '100%',
    height: 96,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  playlistName: {
    fontWeight: '600',
    color: '#1e293b',
  },
  playlistCount: {
    fontSize: 14,
    color: '#64748b',
  },
  albumCard: {
    width: (width - 56) / 2,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    overflow: 'hidden',
  },
  albumCover: {
    width: '100%',
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumInfo: {
    padding: 12,
  },
  albumTitle: {
    fontWeight: '600',
    color: '#1e293b',
  },
  albumArtist: {
    fontSize: 14,
    color: '#64748b',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  trendsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendLabel: {
    color: '#64748b',
  },
  trendValue: {
    fontWeight: '600',
    color: '#1e293b',
  },
  purpleGradient: {
    backgroundColor: '#a855f7',
  },
  blueGradient: {
    backgroundColor: '#3b82f6',
  },
  indigoGradient: {
    backgroundColor: '#6366f1',
  },
  greenGradient: {
    backgroundColor: '#22c55e',
  },
});

const StatCard = ({ icon: Icon, label, value, color }: { 
  icon: any, 
  label: string, 
  value: string, 
  color: any 
}) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconContainer, color]}>
      <Icon size={20} color="#ffffff" />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TabContent = ({ activeTab }: { activeTab: TabType }) => {
  switch (activeTab) {
    case 'artists':
      return (
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Artists</Text>
            {['Artist 1', 'Artist 2', 'Artist 3'].map((artist, index) => (
              <View key={index} style={styles.artistItem}>
                <View style={[styles.artistAvatar, styles.purpleGradient]}>
                  <User size={20} color="#ffffff" />
                </View>
                <View style={styles.artistInfo}>
                  <Text style={styles.artistName}>{artist}</Text>
                  <Text style={styles.artistSongs}>128 songs</Text>
                </View>
                <TouchableOpacity style={styles.heartButton}>
                  <Heart size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      );
    case 'songs':
      return (
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Songs</Text>
            {['Song Title 1', 'Song Title 2', 'Song Title 3'].map((song, index) => (
              <View key={index} style={styles.songItem}>
                <View style={[styles.songIcon, styles.blueGradient]}>
                  <Music size={20} color="#ffffff" />
                </View>
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song}</Text>
                  <Text style={styles.songDetails}>Artist Name • 3:45</Text>
                </View>
                <TouchableOpacity style={styles.downloadButton}>
                  <Download size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      );
    case 'playlists':
      return (
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Playlists</Text>
            <View style={styles.playlistGrid}>
              {['Favorites', 'Workout', 'Chill', 'Party'].map((playlist, index) => (
                <View key={index} style={styles.playlistCard}>
                  <View style={[styles.playlistCover, styles.indigoGradient]}>
                    <ListMusic size={32} color="#ffffff" />
                  </View>
                  <Text style={styles.playlistName}>{playlist}</Text>
                  <Text style={styles.playlistCount}>24 songs</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    case 'albums':
      return (
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Albums</Text>
            <View style={styles.playlistGrid}>
              {['Album 1', 'Album 2', 'Album 3', 'Album 4'].map((album, index) => (
                <View key={index} style={styles.albumCard}>
                  <View style={[styles.albumCover, styles.greenGradient]}>
                    <Disc size={40} color="#ffffff" />
                  </View>
                  <View style={styles.albumInfo}>
                    <Text style={styles.albumTitle}>{album}</Text>
                    <Text style={styles.albumArtist}>Artist Name</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    case 'statistics':
      return (
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Music Stats</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <StatCard icon={TrendingUp} label="Total Plays" value="1,234" color={styles.blueGradient} />
              <StatCard icon={Clock} label="Hours Listened" value="89" color={styles.greenGradient} />
              <StatCard icon={Heart} label="Favorites" value="456" color={styles.purpleGradient} />
            </ScrollView>
          </View>
          
          <View style={styles.trendsContainer}>
            <Text style={styles.sectionTitle}>Listening Trends</Text>
            <View>
              <View style={styles.trendItem}>
                <Text style={styles.trendLabel}>Most Played Artist</Text>
                <Text style={styles.trendValue}>Artist Name</Text>
              </View>
              <View style={styles.trendItem}>
                <Text style={styles.trendLabel}>Top Genre</Text>
                <Text style={styles.trendValue}>Pop</Text>
              </View>
              <View style={styles.trendItem}>
                <Text style={styles.trendLabel}>Average Session</Text>
                <Text style={styles.trendValue}>45 min</Text>
              </View>
            </View>
          </View>
        </View>
      );
    default:
      return null;
  }
};

export const LibraryScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('artists');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollView}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tabButton,
                isActive ? styles.activeTab : styles.inactiveTab
              ]}
            >
              <Icon 
                size={16} 
                color={isActive ? '#ffffff' : '#64748b'} 
              />
              <Text 
                style={[
                  styles.tabText,
                  isActive ? styles.activeTabText : styles.inactiveTabText
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TabContent activeTab={activeTab} />
    </View>
  );
};