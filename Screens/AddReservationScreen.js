import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const db = firebase.firestore();
const auth = firebase.auth();

function AddReservationScreen() {
  const [date, setDate] = useState('');
  const [campsiteNumber, setCampsiteNumber] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [locationName, setLocationName] = useState('');

  const handleAddReservation = async () => {
    try {
      const user = auth.currentUser; 

      await addDoc(collection(db, 'reservations'), {
        date: date,
        campsiteNumber: campsiteNumber,
        reservationNumber: reservationNumber,
        locationName: locationName,
        userId: user.uid
      });

      // Clear the input fields after adding the reservation
      setDate('');
      setCampsiteNumber('');
      setReservationNumber('');
      setLocationName('');

      console.log('Reservation added to Firestore!');
    } catch (error) {
      console.error('Error adding reservation to Firestore: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Reservation</Text>

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Campsite Number"
        value={campsiteNumber}
        onChangeText={setCampsiteNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Reservation Number"
        value={reservationNumber}
        onChangeText={setReservationNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Location Name"
        value={locationName}
        onChangeText={setLocationName}
      />

      <Button title="Add Reservation" onPress={handleAddReservation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default AddReservationScreen;