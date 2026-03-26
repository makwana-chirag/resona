import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity } from 'react-native';
// Import the icons you need
import { Home, Music, ListMusic, BarChart3, User } from 'lucide-react-native';
import { HomeScreen, LibraryScreen, PlaylistScreen, StatsScreen } from '../screens';

const Tab = createBottomTabNavigator();

// Styled Wrapper for the Icons
const IconWrapper = ({ focused, Icon }: { focused: boolean; Icon: any }) => (
  <View className={`items-center justify-center w-10 h-10 rounded-xl ${focused ? 'bg-indigo-600' : 'bg-transparent'}`}>
    <Icon size={24} color={focused ? '#FFFFFF' : '#94a3b8'} strokeWidth={focused ? 2.5 : 2} />
  </View>
);

interface TabNavigatorProps {
  navigation: any;
}

export function TabNavigator({ navigation }: TabNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Settings')} // Or Profile
            className="mr-5"
          >
            {/* Replace with your actual profile image later */}
            <View className="w-9 h-9 rounded-full bg-slate-200 items-center justify-center overflow-hidden border border-slate-300">
               <User size={20} color="#64748b" />
            </View>
          </TouchableOpacity>
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          marginHorizontal: 20,
          height: 64,
          borderRadius: 20,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <IconWrapper focused={focused} Icon={Home} />
          ),
        }}
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <IconWrapper focused={focused} Icon={Music} />
          ),
        }}
      />
      <Tab.Screen 
        name="Playlists" 
        component={PlaylistScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <IconWrapper focused={focused} Icon={ListMusic} />
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={StatsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <IconWrapper focused={focused} Icon={BarChart3} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}