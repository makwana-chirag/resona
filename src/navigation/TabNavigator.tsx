import React, { useState } from 'react';
import { BlurView } from '@react-native-community/blur'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Music, ListMusic, BarChart3, Search, Plus } from 'lucide-react-native';
import { HomeScreen, LibraryScreen, PlaylistScreen, StatsScreen } from '../screens';
import IconWrapper from './components/IconWrapper';
import { StyleSheet, Platform, View, TouchableOpacity } from 'react-native';
import { SearchModal } from './components/SearchModel';

const styles = StyleSheet.create({
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
  },
   addButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 82,
    alignSelf: 'center',
    left:30,
    zIndex: 999,
  },
});

const TabBarBackground = () => (
  <BlurView
    // intensity={80}
    // tint="light"
    style={styles.blurBackground}
  />
);

const Tab = createBottomTabNavigator();

const HomeIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={Home} />;
const LibraryIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={Music} />;
const PlaylistIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={ListMusic} />;
const StatsIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={BarChart3} />;
const SearchIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={Search} />;
const AddIcon = ({ focused, size, color }: { focused: boolean; size?: number; color?: string }) => <IconWrapper focused={focused} Icon={Plus} size={size} color={color} />;

const FloatingAddButton = ({ onPress }: { onPress: () => void }) => (
  <View style={styles.fabContainer} pointerEvents="box-none">
    <TouchableOpacity onPress={onPress} style={styles.addButton} activeOpacity={0.8}>
      <AddIcon focused={true} size={28} color="#FFFFFF"/>
    </TouchableOpacity>
  </View>
);


export const TabNavigator = () => {
   const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const handleSearchPress = () => {
    setIsSearchModalVisible(true);
  };

  const handleCloseSearch = () => {
    setIsSearchModalVisible(false);
  };
  return (
    <>
  <Tab.Navigator
  screenOptions={{
    tabBarStyle: {
      position: 'absolute',
      bottom: 30,
      marginHorizontal: 20,
      height: 65,
      borderRadius: 50,
      borderTopWidth: 0,
      backgroundColor: 'transparent',
      elevation: 0,
    },
    tabBarBackground: TabBarBackground,
  }}
>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarIcon: HomeIcon }}
        />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{ tabBarIcon: LibraryIcon }} 
        />
        <Tab.Screen 
        name="Search" 
        component={LibraryScreen} 
        options={{ tabBarIcon: SearchIcon }} 
        />
      <Tab.Screen 
        name="Playlists" 
        component={PlaylistScreen} 
        options={{ tabBarIcon: PlaylistIcon }} 
        />
      <Tab.Screen 
        name="Insights" 
        component={StatsScreen} 
        options={{ tabBarIcon: StatsIcon }} 
        />
    </Tab.Navigator>
    <FloatingAddButton onPress={handleSearchPress} />
    <SearchModal 
        visible={isSearchModalVisible} 
        onClose={handleCloseSearch} 
      />
    </>
  );
};
