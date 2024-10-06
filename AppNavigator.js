// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import CreateListScreen from './Screens/CreateListScreen';
import ViewListsScreen from './Screens/ViewListsScreen';
import ListScreen from './Screens/ListScreen';
import TemplateScreen from './Screens/TemplateScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import ActivityListScreen from './Screens/ActivityListScreen';
import ReservationScreen from './Screens/ReservationScreen';
import AddReservationScreen from './Screens/AddReservationScreen';

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
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Template" component={TemplateScreen} />
        <Stack.Screen name="Activity" component={ActivityListScreen} />
        <Stack.Screen name="Reservation" component={ReservationScreen} />
        <Stack.Screen name="Add Reservation" component={AddReservationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
