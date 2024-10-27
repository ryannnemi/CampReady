import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Button, Text, StyleSheet, Alert } from 'react-native';
import firebase from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';


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
   }; 
  
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