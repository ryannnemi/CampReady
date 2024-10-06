import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button, StyleSheet } from 'react-native';
import firebase from '../firebaseConfig';

const db = firebase.firestore();
const auth = firebase.auth();

function ReservationScreen({navigation}) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setUserEmail(user.email);
    } else {
      setError('User not logged in');
    }
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
        try {
          const userId = auth.currentUser.uid;
          const querySnapshot = await db
            .collection('reservations')
            .where('userId', '==', userId)
            .get();
      
          const userReservations = [];
          querySnapshot.forEach((doc) => {
            userReservations.push(doc.data());
          });
      
          setReservations(userReservations);
        } catch (error) {
          console.error('Error fetching reservations: ', error);
        }
      };

    
    if (userEmail) {
      fetchReservations();
    }
  },);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.reservationNumber}>Reservation ID: {item.reservationNumber}</Text>
      <Text style={styles.locationName}>Location: {item.locationName}</Text>
      <Text style={styles.locationName}>Campsite: {item.campsiteNumber}</Text>
      <Text style={styles.date}>Date: {item.date}</Text>
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Reservations</Text>
      <FlatList
        data={reservations}
        renderItem={renderItem}
        keyExtractor={(item) => item.reservationNumber.toString()} 
      />
      <Button title="Add Reservation" onPress={() => navigation.navigate('Add Reservation')} />
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reservationNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationName: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
  },
  endDate: {
    fontSize: 16,
  },
});

export default ReservationScreen;