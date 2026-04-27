import { useProgress } from 'react-native-track-player';
import { View, Text, StyleSheet } from 'react-native';

// Progress Bar Component
const ProgressBar = () => {
  const progress = useProgress();
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${(progress.position / progress.duration) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  timeText: {
    color: '#999',
    fontSize: 12,
    marginHorizontal: 5,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
});
export default ProgressBar;