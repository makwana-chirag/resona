import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './navigation/TabNavigator';

function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default App;