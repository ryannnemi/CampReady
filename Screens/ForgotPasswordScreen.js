import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import firebase from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
  
    const handleForgotPassword = async () => {
      // Clear previous messages
      setError(null);
      setSuccessMessage('');

      try {
          // Validate email address format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email.trim())) {
              setError('Invalid email address.');
              return;
          }

          console.log(`Attempting to send reset email to: ${email.trim()}`);
          
          // Send password reset email
          await firebase.auth().sendPasswordResetEmail(email.trim());
          
          // If successful, log and set success message
          console.log('Password reset email sent successfully.');
          setSuccessMessage('Password reset email sent successfully. Please check your inbox.');
          setError('');
      } catch (error) {
          // Log the error object for debugging
          console.error('Firebase error:', error);

          // Handle specific Firebase errors
          if (error.code === 'auth/user-not-found') {
              setError('Email address not found.');
          } else if (error.code === 'auth/invalid-email') {
              setError('Invalid email format.');
          } else {
              setError('An error occurred while sending the password reset email.');
          }
          
          // Clear success message if there's an error
          setSuccessMessage('');
      }
  };

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
      <Button title="Send Password Reset Email" onPress={handleForgotPassword} />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}
    </View>
  );
};

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
    borderRadius: 20,
    }
    });
  
  export default ForgotPasswordScreen;