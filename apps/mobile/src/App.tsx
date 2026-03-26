import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './navigation/TabNavigator';

function App() {
  return (
    <NavigationContainer>
      <TabNavigator navigation={null as any} />
    </NavigationContainer>
  );
}

export default App;