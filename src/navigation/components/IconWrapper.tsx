// src/navigation/components/IconWrapper.tsx
import React from 'react';
import { View } from 'react-native';

interface IconWrapperProps {
  focused: boolean;
  Icon: any; // The Lucide Icon component
}

const IconWrapper = ({ focused, Icon }: IconWrapperProps) => {
  return (
    <View className={`items-center justify-center w-10 h-10 rounded-xl ${focused ? 'bg-indigo-600' : 'bg-transparent'}`}>
      {/* Ensure Icon is used as a component <Icon /> */}
      <Icon 
        size={24} 
        color={focused ? '#FFFFFF' : '#94a3b8'} 
        strokeWidth={focused ? 2.5 : 2} 
      />
    </View>
  );
};

export default IconWrapper;