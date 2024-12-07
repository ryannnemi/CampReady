import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Button, Text, StyleSheet, Alert } from 'react-native';
import firebase from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
 
const handleLogin = async () => {
     try {
       const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
       const user = userCredential.user;

     } catch (error) {
       console.error(error);
     }

     // For testing with immediate notifications
     await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification triggered locally.',
      },
      trigger: { seconds: 5 }, // Fires in 5 seconds
    });
    console.log('Notification scheduled!');
   }; 

   // Clear notifications on login
   useEffect(() => {
    const clearNotificationsOnStart = async () => {
      try {
        // Dismiss all visible notifications from the notification tray
        await Notifications.dismissAllNotificationsAsync();
        console.log('Dismissed all triggered notifications.');
    
        // Cancel all scheduled notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('Cleared all scheduled notifications.');
      } catch (error) {
        console.error('Error clearing notifications on start: ', error);
      }
    };
  
    clearNotificationsOnStart();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to CampReady</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />      
      <Button style={styles.button} title="Login" onPress={handleLogin}/> 
      <TouchableOpacity style={styles.textButton} 
        onPress={() => {
          if (navigation) {
            navigation.navigate('Signup', { email, password });
          } else {
            console.error("Navigation prop is undefined");
          }
        }}>
        <Text style={styles.textButton}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.textButton} 
        onPress={() => {
          if (navigation) {
            navigation.navigate('ForgotPassword', { email });
          } else {
            console.error("Navigation prop is undefined");
          }
        }}>
        <Text style={styles.textButton}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    marginTop: 20,
    padding: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    borderRadius: 20,
  },
  textButton: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});