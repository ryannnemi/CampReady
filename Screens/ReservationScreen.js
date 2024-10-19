import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button, StyleSheet, Alert } from 'react-native';
import firebase from '../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome'
import { format } from 'date-fns'

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
            userReservations.push({ id: doc.id, ...doc.data() });
          });
      
          setReservations(userReservations);
        } catch (error) {
          console.error('Error fetching reservations: ', error);
        }
      };

    
    if (userEmail) {
      fetchReservations();
    }
  }, [userEmail]);

  const deleteReservation = async (reservationId) => {
    try {
      // Show a confirmation dialog before deleting
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this reservation?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await db.collection('reservations').doc(reservationId).delete();
              setReservations(reservations.filter((res) => res.id !== reservationId));
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting reservation: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text style={styles.reservationNumber}>Reservation ID: {item.reservationNumber}</Text>
        <Text style={styles.location}>Location: {item.location?.name || 'No location provided'}</Text>
        <Text style={styles.date}>Date: {format(item.startDate, 'MM/dd/yyyy HH:mm')}</Text>
      </View>
      <Icon 
        name="trash" 
        size={20} 
        color="gray" 
        onPress={() => deleteReservation(item.id)} 
        style={styles.deleteIcon} 
      />
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
        keyExtractor={(item) => item.id.toString()} 
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
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContent: {
    flex: 1,
  },
  reservationNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
  },
  endDate: {
    fontSize: 16,
  },
  deleteIcon: {
    marginLeft: 10,
  },
});

export default ReservationScreen;