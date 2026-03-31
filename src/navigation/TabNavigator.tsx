import React from 'react';
import { BlurView } from '@react-native-community/blur'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Music, ListMusic, BarChart3, Search } from 'lucide-react-native';
import { HomeScreen, LibraryScreen, PlaylistScreen, StatsScreen } from '../screens';
import IconWrapper from './components/IconWrapper';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const HomeIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={Home} />;
const LibraryIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={Music} />;
const PlaylistIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={ListMusic} />;
const StatsIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={BarChart3} />;
const SearchIcon = ({ focused }: { focused: boolean }) => <IconWrapper focused={focused} Icon={Search} />;

export const TabNavigator = () => {
  
  return (
  <Tab.Navigator
  screenOptions={{
    tabBarStyle: {
      position: 'absolute',
      bottom: 30,
      marginHorizontal: 20,
      height: 64,
      borderRadius: 24,
      borderTopWidth: 0,
      backgroundColor: 'transparent',
      elevation: 0,
    },
    tabBarBackground: () => (
      <BlurView
        intensity={80} 
        tint="light"
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        }}
      />
    ),
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
  );
};
