// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import AddReservationScreen from './Screens/AddReservationScreen';
import ItineraryScreen from './Screens/ItineraryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Itinerary" component={ItineraryScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />        
      <Stack.Screen name="Add Reservation" component={AddReservationScreen} />      
    </Stack.Navigator>
  );
}
