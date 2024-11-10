// openNavigationApp.js
import {Linking, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export const openNavigationApp = (item) => {
    const { latitude, longitude } = item.location; 

    if (!latitude || !longitude) {
      Alert.alert("Location information is missing")
      return;
    }

    // Check for internet connectivity
    NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      Alert.alert("No internet connection", "Please check your network connection and try again.");
      return;
    }

    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`,
    });

    Linking.openURL(url);
  });
};