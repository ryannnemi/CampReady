import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const db = firebase.firestore();
const auth = firebase.auth();

function AddReservationScreen() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [locationName, setLocationName] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddReservation = async () => {
    try {
      const user = auth.currentUser; 

      await addDoc(collection(db, 'reservations'), {
        startDate: startDate,
        endDate: endDate,
        reservationNumber: reservationNumber,
        locationName: locationName,
        notes: notes,
        userId: user.uid
      });

      // Clear the input fields after adding the reservation
      setStartDate('');
      setEndDate('');
      setReservationNumber('');
      setLocationName('');
      setNotes('');

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
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
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
      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
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