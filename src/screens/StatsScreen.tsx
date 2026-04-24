import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const mockListeningStats = {
  totalHours: 156,
  totalSongs: 1247,
  avgDaily: 45,
  favoriteTime: 'Evening',
  longestStreak: 12,
  currentStreak: 5
};

const mockGenreData = [
  { genre: 'Pop', percentage: 35, color: '#3b82f6' },
  { genre: 'Rock', percentage: 25, color: '#ef4444' },
  { genre: 'Hip Hop', percentage: 20, color: '#8b5cf6' },
  { genre: 'Electronic', percentage: 12, color: '#10b981' },
  { genre: 'Classical', percentage: 8, color: '#f59e0b' }
];

const mockListeningHours = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 5.2 },
  { day: 'Sat', hours: 6.8 },
  { day: 'Sun', hours: 4.5 }
];

const mockTopArtists = [
  { name: 'Taylor Swift', songs: 47, hours: 12.5 },
  { name: 'Ed Sheeran', songs: 38, hours: 10.2 },
  { name: 'Drake', songs: 32, hours: 8.7 },
  { name: 'Billie Eilish', songs: 28, hours: 7.9 },
  { name: 'The Weeknd', songs: 25, hours: 6.8 }
];

const mockMonthlyData = [
  { month: 'Jan', hours: 28 },
  { month: 'Feb', hours: 32 },
  { month: 'Mar', hours: 45 },
  { month: 'Apr', hours: 38 },
  { month: 'May', hours: 52 },
  { month: 'Jun', hours: 48 }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  content: {
    padding: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24
  },
  statsOverview: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statItem: {
    width: (width - 40) / 2 - 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b'
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  genreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  genreBar: {
    height: 24,
    borderRadius: 12,
    marginRight: 12
  },
  genreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    width: 80
  },
  genrePercentage: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 'auto'
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8
  },
  dayBar: {
    width: (width - 80) / 7 - 4,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  dayLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4
  },
  dayContainer: {
    alignItems: 'center'
  },
  highListeningDay: {
    backgroundColor: '#ef4444'
  },
  artistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  artistInfo: {
    flex: 1
  },
  artistName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2
  },
  artistStats: {
    fontSize: 12,
    color: '#64748b'
  },
  artistHours: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6'
  },
  monthlyTrend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    marginBottom: 8
  },
  monthBar: {
    width: (width - 80) / 6 - 4,
    backgroundColor: '#10b981',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  monthLabel: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4
  },
  monthContainer: {
    alignItems: 'center'
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  insightText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    fontStyle: 'italic'
  }
});

export const StatsScreen = () => {
  const maxHours = Math.max(...mockListeningHours.map(h => h.hours));
  const maxMonthly = Math.max(...mockMonthlyData.map(m => m.hours));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Music Insights</Text>
        
        {/* Overview Stats */}
        <View style={styles.statsOverview}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{mockListeningStats.totalHours}h</Text>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{mockListeningStats.totalSongs}</Text>
              <Text style={styles.statLabel}>Songs Played</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{mockListeningStats.avgDaily}m</Text>
              <Text style={styles.statLabel}>Daily Average</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{mockListeningStats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Genre Distribution */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Genre Distribution</Text>
          {mockGenreData.map((genre) => (
            <View key={genre.genre} style={styles.genreItem}>
              <Text style={styles.genreText}>{genre.genre}</Text>
              <View 
                style={[
                  styles.genreBar,
                  { 
                    backgroundColor: genre.color,
                    width: `${genre.percentage * 2}%`
                  }
                ]}
              />
              <Text style={styles.genrePercentage}>{genre.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Weekly Listening */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Weekly Listening (Hours)</Text>
          <View style={styles.weeklyChart}>
            {mockListeningHours.map((day) => (
              <View key={day.day} style={styles.dayContainer}>
                <View 
                  style={[
                    styles.dayBar,
                    { 
                      height: (day.hours / maxHours) * 100
                    },
                    day.hours > 4 && styles.highListeningDay
                  ]}
                />
                <Text style={styles.dayLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Artists */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Top Artists This Month</Text>
          {mockTopArtists.map((artist, index) => (
            <View key={artist.name} style={styles.artistItem}>
              <View style={styles.artistInfo}>
                <Text style={styles.artistName}>{index + 1}. {artist.name}</Text>
                <Text style={styles.artistStats}>{artist.songs} songs</Text>
              </View>
              <Text style={styles.artistHours}>{artist.hours}h</Text>
            </View>
          ))}
        </View>

        {/* Monthly Trend */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>6-Month Trend</Text>
          <View style={styles.monthlyTrend}>
            {mockMonthlyData.map((month) => (
              <View key={month.month} style={styles.monthContainer}>
                <View 
                  style={[
                    styles.monthBar,
                    { 
                      height: (month.hours / maxMonthly) * 60
                    }
                  ]}
                />
                <Text style={styles.monthLabel}>{month.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <Text style={styles.insightText}>
            You listen to music most during {mockListeningStats.favoriteTime.toLowerCase()} times. 
            Your favorite genre is Pop, making up 35% of your listening time. 
            You've maintained a {mockListeningStats.currentStreak}-day listening streak!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};