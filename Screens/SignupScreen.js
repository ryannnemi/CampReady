import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import firebase from '../firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';


const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    // If email and password are passed as params, set them in the state
    if (route.params?.email && route.params?.password) {
      setEmail(route.params.email);
      setPassword(route.params.password);
    }
  }, [route]);

  const handleSignup = async () => {
    try {
      // Validate email and password
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }

      // Create user account
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Handle successful signup (e.g., navigation)
      console.log('User created:', user);

      //Login user & navigate to home screen
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Home');

    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setError('User account already exists');
        } else {
          setError('An error occurred during signup');
        }
    
        setSuccessMessage('');
        console.error('Sign up error:', error);       }

    }
  

  return (
    <View style={styles.container}>
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
      borderRadius: 20,
    }
});

export default SignupScreen;