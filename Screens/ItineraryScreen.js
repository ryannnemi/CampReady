import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import firebase from '../firebaseConfig';

const ItineraryScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [dailyItinerary, setDailyItinerary] = useState([]);

  // Fetch reservations from Firestore
  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('reservations')
      .onSnapshot(querySnapshot => {
        const reservationData = [];
        querySnapshot.forEach(doc => {
          reservationData.push({ id: doc.id, ...doc.data() });
        });
        setReservations(reservationData);
      });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  // Filter reservations for the selected date
  useEffect(() => {
    const filtered = reservations.filter(reservation => {
      const startDate = moment(reservation.startDate);
      const endDate = moment(reservation.endDate);
      return moment(selectedDate).isBetween(startDate, endDate, null, '[]');
    });
    setDailyItinerary(filtered);
  }, [reservations, selectedDate]);

    // Generate markedDates object for the calendar
    const getMarkedDates = () => {
        const markedDates = {};
        reservations.forEach(reservation => {
          const startDate = moment(reservation.startDate);
          const endDate = moment(reservation.endDate);
          let currentDate = startDate.clone();
    
          while (currentDate.isSameOrBefore(endDate)) {
            markedDates[currentDate.format('YYYY-MM-DD')] = { marked: true, dotColor: 'red' };
            currentDate.add(1, 'day');
          }
        });
        return markedDates;
      };

  // Render each reservation item
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Location: {item.locationName}</Text>
      <Text>Reservation Number: {item.reservationNumber}</Text>
      <Text>Notes: {item.notes}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          ...getMarkedDates(), // Add markers for reservation dates
          [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
        }}
      />

      <Text style={styles.header}>Itinerary for {moment(selectedDate).format('MMMM D, YYYY')}</Text>

      <FlatList
        data={dailyItinerary}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No reservations found for this date.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
  },
  campsite: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ItineraryScreen;