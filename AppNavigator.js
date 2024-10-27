// AppNavigator.js
import React from 'react';
import firebase from './firebaseConfig';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import HomeScreen from './Screens/HomeScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import AddReservationScreen from './Screens/AddReservationScreen';
import ItineraryScreen from './Screens/ItineraryScreen';
import CreateListScreen from './Screens/CreateListScreen';
import ListScreen from './Screens/ListScreen';
import ViewListsScreen from './Screens/ViewListsScreen';
import TemplateScreen from './Screens/TemplateScreen';
import ActivityListScreen from './Screens/ActivityListScreen';
import ReservationScreen from './Screens/ReservationScreen';

const AuthStack = createStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="Home" component={HomeScreen} />            
    </AuthStack.Navigator>
  );
}

function MainDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Itinerary">
      <Drawer.Screen 
        name="My Lists" 
        component={ViewListsScreen}
        options={{
          drawerIcon: () => (
            <Ionicons name="list" color={"black"} size={20} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Templates" 
          component={TemplateScreen}
          options={{
            drawerIcon: () => (
              <Ionicons name="layers" color={"black"} size={20} />
            ),
          }}
        />
      <Drawer.Screen 
        name="Activities" 
        component={ActivityListScreen} 
        options={{
          drawerIcon: () => (
            <Ionicons name="bicycle" color={"black"} size={20} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Reservation" 
          component={ReservationScreen} 
          options={{
            drawerIcon: () => (
              <Ionicons name="bookmarks" color={"black"} size={20} />
            ),
          }}
        />
      <Drawer.Screen 
        name="Itinerary" 
          component={ItineraryScreen}
          options={{
            drawerIcon: () => (
              <Ionicons name="calendar" color={"black"} size={20} />
            ),
          }}
        />  
      <Drawer.Screen 
        name="Create List" 
          component={CreateListScreen} 
          options={{
            drawerIcon: () => (
              <Ionicons name="create" color={"black"} size={20} />
            ),
          }}
        />  
      <Drawer.Screen 
        name="List" 
          component={ListScreen}
          options={{
            drawerIcon: () => (
              <Ionicons name="checkmark-done" color={"black"} size={20} />
            ),
          }}  
        />  
      <Drawer.Screen 
        name="Add Reservation" 
          component={AddReservationScreen}
          options={{
            drawerIcon: () => (
              <Ionicons name="add" color={"black"} size={20} />
            ),
          }}  
        /> 
    </Drawer.Navigator>
    );
}

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {isAuthenticated ? <MainDrawerNavigator /> : <AuthStackNavigator />}
    </>
  );
}
