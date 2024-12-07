// registerForPushNotifications.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'; 
import { Platform } from 'react-native';
import firebase from '../firebaseConfig';

const db = firebase.firestore();
const auth = firebase.auth();

export async function registerForPushNotificationsAsync() {
  let token;

  if (!Device.isDevice) {
    if (__DEV__) {
      console.warn('Push notifications are only supported on physical devices.');
    } else {
      alert('Must use physical device for Push Notifications');
    }
    return;
  }

  // Request notification permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // Get Expo push token
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);

  // Get APNs token for standalone iOS apps
  if (Platform.OS === 'ios') {
    const apnsToken = await Notifications.getDevicePushTokenAsync();
    console.log('APNs Token:', apnsToken);
  }

  if (Constants.easConfig?.projectId) {
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: '6e2197c3-cb62-420f-ad3e-0061a94cfcfd', 
      })
    ).data;
    console.log(token);
  }

  // Configure notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Store token in Firestore
  const user = auth.currentUser;

  if (!user) {
    console.warn('No authenticated user found. Skipping token update.');
    return token;
  }

  try {
    await db.collection('users').doc(user.uid).set({ fcmToken: token }, { merge: true });
    console.log('FCM token successfully updated in Firestore');
  } catch (error) {
    console.error('Error updating FCM token:', error.message);
  }

  return token;
}