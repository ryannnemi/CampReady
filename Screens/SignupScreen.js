import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import firebase from '../firebaseConfig';


const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      // Validate email and password (optional, but recommended)
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }

      // Create user account
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Handle successful signup (e.g., navigation)
      console.log('User created:', user);

      // Navigate to the next screen or perform other actions
    } catch (error) {

      // Handle signup errors
      console.error(error);

      setError(error.message); // Display error message to user
    }
  };

  return (
    <View>
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
        title="Sign Up" onPress={handleSignup} disabled={!email || !password} 
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
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

export default SignupScreen;