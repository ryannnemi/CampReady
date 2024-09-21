// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import CreateListScreen from './Screens/CreateListScreen';
import ViewListsScreen from './Screens/ViewListsScreen';
import ListDetailsScreen from './Screens/ListDetailsScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateList" component={CreateListScreen} />
        <Stack.Screen name="ViewLists" component={ViewListsScreen} />
        <Stack.Screen name="ListDetails" component={ListDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
