// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import CreateListScreen from './Screens/CreateListScreen';
import ViewListsScreen from './Screens/ViewListsScreen';
import ListScreen from './Screens/ListScreen';
import TemplateScreen from './Screens/TemplateScreen';
import ActivityListScreen from './Screens/ActivityListScreen';
import ReservationScreen from './Screens/ReservationScreen';
import ItineraryScreen from './Screens/ItineraryScreen';
import AppNavigator from './AppNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Login">
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="View Lists" component={ViewListsScreen} />
      <Drawer.Screen name="List Templates" component={TemplateScreen} />
      <Drawer.Screen name="Activities" component={ActivityListScreen} />
      <Drawer.Screen name="Reservation" component={ReservationScreen} />
      <Drawer.Screen name="Itinerary" component={ItineraryScreen} />  
      <Drawer.Screen name="More Screens" component={AppNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
    );
}
