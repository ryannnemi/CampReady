// registerForPushNotifications.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'; 
import { Platform } from 'react-native';
import firebase from '../firebaseConfig';

const db = firebase.firestore();
const auth = firebase.auth();

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
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
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  try{
    const user = auth.currentUser; 
    const userId = user.uid;
    await db.collection('users').doc(userId).update({ fcmToken: token });
    
  } catch (error) {
    console.error('Error validating user: ',error);
  }
    

  return token;
}

registerForPushNotificationsAsync();
