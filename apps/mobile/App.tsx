import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native'; // Added Text
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }
    ]}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>Welcomed to Resona</Text>
      <Text style={styles.subtitle}>Start editing App.tsx to build your app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default App;
