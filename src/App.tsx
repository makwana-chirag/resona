import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './navigation/TabNavigator';
import { QueryProvider } from './provider/QueryProvider';

function App() {
  return (
    <QueryProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </QueryProvider>
  );
}

export default App;