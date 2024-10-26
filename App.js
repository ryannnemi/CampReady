// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator'; 
import './gesture-handler';

export default function App() {
  return(
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
);
}


