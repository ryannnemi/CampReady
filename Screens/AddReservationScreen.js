// AddReservationScreen.js
import React, { useState } from 'react';
import { Platform, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firebase from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Notifications from 'expo-notifications';

const db = firebase.firestore();
const auth = firebase.auth();

function AddReservationScreen() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [notificationOffset, setNotificationOffset] = useState(null);

    // State for date/time pickers
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  
    const showStartDatePicker = () => {
      setStartDatePickerVisibility(true);
    };
  
    const hideStartDatePicker = () => {
      setStartDatePickerVisibility(false);
    };
  
    const handleStartDateConfirm = (date) => {
      setStartDate(date.toISOString());
      hideStartDatePicker();
    };
  
    const showEndDatePicker = () => {
      setEndDatePickerVisibility(true);
    };
  
    const hideEndDatePicker = () => {
      setEndDatePickerVisibility(false);   
    };
  
    const handleEndDateConfirm = (date) => {
      setEndDate(date.toISOString());
      hideEndDatePicker();
    };

    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          alert('Permission to receive notifications was denied');
          return false;
        }
      }
      return true;
    };

  const handleAddReservation = async () => {
    try {
      const user = auth.currentUser; 

      // Add reservation to Firestore
      const reservationRef = await addDoc(collection(db, 'reservations'), {
        startDate: startDate,
        endDate: endDate,
        reservationNumber: reservationNumber,
        location: {
          name: location.name,
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude
        },
        notes: notes,
        userId: user.uid
      });

      // Clear the input fields after adding the reservation
      setStartDate('');
      setEndDate('');
      setReservationNumber('');
      setLocation('');
      setNotes('');

      // Request notification permission before scheduling
      const isPermitted = await requestNotificationPermissions();
        if (!isPermitted) {
      return;
    }
      
      // Check if notification should be scheduled
      if (notificationOffset !== null) {

        // Calculate trigger time
        const triggerDate = new Date(startDate);
        triggerDate.setMinutes(triggerDate.getMinutes() - notificationOffset);

        // Schedule a notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got plans!",
            body: `You have a reservation at ${location.name} on ${new Date(startDate).toLocaleString()}`,
          },
          trigger: triggerDate,
        });              

      console.log('Notification scheduled!');
      } else {
        console.log('No notification scheduled.');
      }

      console.log('Reservation added to Firestore!');

      // Alert user reservation addition was successful
      Alert.alert(
        'Success',
        'Reservation added successfully!',
        [{ text: 'OK' }] 
      );
    } catch (error) {
      console.error('Error adding reservation to Firestore: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Reservation</Text>

      <TouchableOpacity onPressIn={showStartDatePicker} style={{ width: '100%' }}>
        <TextInput
          style={styles.input}
          placeholder="Start Date and Time"
          value={startDate ? new Date(startDate).toLocaleString() : ''}
          editable={false}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="datetime"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartDatePicker}
        display={Platform.OS === "ios" ? "spinner" : "default"}
      />

      <TouchableOpacity onPressIn={showEndDatePicker} style={{ width: '100%' }}>
        <TextInput
          style={styles.input}
          placeholder="End Date and Time"
          value={endDate ? new Date(endDate).toLocaleString() : ''}
          editable={false}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="datetime"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
        display={Platform.OS === "ios" ? "spinner" : "default"}
      />

      <Picker
        selectedValue={notificationOffset}
        onValueChange={(itemValue) => setNotificationOffset(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="None" value={null} />
        <Picker.Item label="15 minutes before" value={15} />
        <Picker.Item label="30 minutes before" value={30} />
        <Picker.Item label="1 hour before" value={60} />
        <Picker.Item label="3 hours before" value={180} />
        <Picker.Item label="1 day before" value={1440} /> 
      </Picker>

      <GooglePlacesAutocomplete
        placeholder='Search for a location'
        onPress={(data, details = null) => {
          if (details && details.geometry && details.geometry.location) {
            const selectedLocation = {
              name: details.name,
              address: details.formatted_address,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng 
            };
            setLocation(selectedLocation);
            console.log('name: '&location.name);
          }
        }}
        query={{
          key: 'AIzaSyCgOZfEz_a58wrMoHliVwght6Bu1AznFzo',
          language: 'en',
        }}
        fetchDetails={true}         
        />
      <TextInput
        style={styles.input}
        placeholder="Reservation Number"
        value={reservationNumber}
        onChangeText={setReservationNumber}
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
  textInputContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default AddReservationScreen;