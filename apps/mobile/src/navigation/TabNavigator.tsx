import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import React from 'react';

const Tab = createBottomTabNavigator();

// Dummy Screens for now
const HomeScreen = () => <View className="flex-1 justify-center items-center bg-slate-50"><Text>Home</Text></View>;
const SearchScreen = () => <View className="flex-1 justify-center items-center bg-slate-50"><Text>Search</Text></View>;

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 25,
          height: 70,
          // Shadow for iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View className={`items-center justify-center ${focused ? 'bg-blue-500 p-3 rounded-full -mt-8' : ''}`}>
               {/* You can put an Icon here */}
               <Text className={focused ? 'text-white' : 'text-gray-400'}>H</Text>
            </View>
          )
        }} 
      />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}