import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AudioPlayer from '../components/audio-player/AudioPlayer';

const { width } = Dimensions.get('window');

const mockStats = {
  totalMinutes: 1247,
  songsPlayed: 342,
  favoriteGenre: 'Pop',
  topArtist: 'Taylor Swift',
  weeklyGoal: 300,
  weeklyProgress: 234
};

const mockTopTracks = [
  { id: 1, title: 'Anti-Hero', artist: 'Taylor Swift', plays: 47 },
  { id: 2, title: 'Flowers', artist: 'Miley Cyrus', plays: 42 },
  { id: 3, title: 'Unholy', artist: 'Sam Smith', plays: 38 },
  { id: 4, title: 'As It Was', artist: 'Harry Styles', plays: 35 },
  { id: 5, title: 'Cruel Summer', artist: 'Taylor Swift', plays: 32 }
];

const mockRecentActivity = [
  { id: 1, action: 'Played', track: 'Anti-Hero', time: '2 hours ago' },
  { id: 2, action: 'Liked', track: 'Flowers', time: '5 hours ago' },
  { id: 3, action: 'Added to playlist', track: 'Unholy', time: '1 day ago' },
  { id: 4, action: 'Shared', track: 'As It Was', time: '2 days ago' }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  content: {
    padding: 24
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statCard: {
    width: (width - 48) / 2 - 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  statCardPurple: {
    backgroundColor: '#faf5ff'
  },
  statCardGreen: {
    backgroundColor: '#f0fdf4'
  },
  statCardOrange: {
    backgroundColor: '#fff7ed'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb'
  },
  statNumberPurple: {
    color: '#9333ea'
  },
  statNumberGreen: {
    color: '#16a34a'
  },
  statNumberOrange: {
    color: '#ea580c'
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },
  progressBar: {
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    height: 12,
    marginBottom: 8
  },
  progressFill: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    height: 12
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280'
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  trackInfo: {
    flex: 1
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827'
  },
  trackArtist: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  trackPlays: {
    fontSize: 14,
    color: '#9ca3af',
    marginRight: 8
  },
  musicIcon: {
    fontSize: 18
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  activityInfo: {
    flex: 1
  },
  activityAction: {
    fontSize: 14,
    color: '#6b7280'
  },
  activityTrack: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 2
  },
  activityTime: {
    fontSize: 14,
    color: '#9ca3af'
  }
});

export const HomeScreen = () => (
  <ScrollView style={styles.container}>
    <View style={styles.content}>
      <AudioPlayer />
      <Text style={styles.title}>Your Music Stats</Text>
      
      {/* Stats Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockStats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes Listened</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <Text style={[styles.statNumber, styles.statNumberPurple]}>{mockStats.songsPlayed}</Text>
            <Text style={styles.statLabel}>Songs Played</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={[styles.statNumber, styles.statNumberGreen]}>{mockStats.favoriteGenre}</Text>
            <Text style={styles.statLabel}>Favorite Genre</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={[styles.statNumber, styles.statNumberOrange]}>{mockStats.topArtist}</Text>
            <Text style={styles.statLabel}>Top Artist</Text>
          </View>
        </View>
      </View>

      {/* Weekly Goal Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Goal</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${(mockStats.weeklyProgress / mockStats.weeklyGoal) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {mockStats.weeklyProgress} / {mockStats.weeklyGoal} minutes
        </Text>
      </View>

      {/* Top Tracks */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Tracks</Text>
        {mockTopTracks.map((track) => (
          <TouchableOpacity key={track.id} style={styles.trackItem}>
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackArtist}>{track.artist}</Text>
            </View>
            <View style={styles.trackMeta}>
              <Text style={styles.trackPlays}>{track.plays} plays</Text>
              <Text style={styles.musicIcon}>🎵</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        {mockRecentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityAction}>{activity.action}</Text>
              <Text style={styles.activityTrack}>{activity.track}</Text>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        ))}
      </View>
    </View>
  </ScrollView>
);