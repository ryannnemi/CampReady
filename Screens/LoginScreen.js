import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import firebase from '../firebaseConfig';


export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 
const handleLogin = async () => {
     try {
       const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
       const user = userCredential.user;
 
       console.log('User logged in:', user);

       // Navigate to HomeScreen after successful login
       navigation.navigate('Home');
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
      <Button 
        title="Login" onPress={handleLogin} 
        style={styles.button}
      />
      <Button 
        title="Sign Up" onPress={() => navigation.navigate('Signup')} 
        style={styles.button}
        />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  }
});