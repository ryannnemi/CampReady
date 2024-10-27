import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';
import firebase from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const OPENWEATHER_API_KEY = 'df20576553f4a0647462495ad9f24aa7';

const ItineraryScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [dailyItinerary, setDailyItinerary] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const navigation = useNavigation();

  // Fetch reservations from Firestore
  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('reservations')
      .where('userId', '==', firebase.auth().currentUser.uid)
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
      const startDate = moment(reservation.startDate).format('YYYY-MM-DD');
      const endDate = moment(reservation.endDate).format('YYYY-MM-DD');
      return moment(selectedDate).isSameOrAfter(startDate) && moment(selectedDate).isSameOrBefore(endDate);
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

  // Fetch weather data for each reservation
  useEffect(() => {
    const fetchWeather = async () => {
      const weatherPromises = reservations.map(async (reservation) => {
        try {
          const { latitude, longitude } = reservation.location || {}; 
          if (!latitude || !longitude) {
            throw new Error('Latitude or Longitude is missing');
          }
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=imperial`
          );
          return { reservationId: reservation.id, weather: response.data };
        } catch (error) {
          return { reservationId: reservation.id, weather: null };
        }
      });

      const weatherResults = await Promise.all(weatherPromises);
      const newWeatherData = {};
      weatherResults.forEach((result) => {
        newWeatherData[result.reservationId] = result.weather;
      });
      setWeatherData(newWeatherData);
    };

    fetchWeather();
  }, [reservations]);

  // Render each reservation item
  const renderItem = ({ item }) => {
    const reservationWeather = weatherData[item.id];

    return (
      <View style={styles.item}>
        <Text>Location: {item.location.name}</Text>
        <Text>Reservation Number: {item.reservationNumber}</Text>
        {reservationWeather ? (
          <View>
            <Text>Temperature: {Math.round(reservationWeather.main.temp)} °F</Text>
            <Text>Conditions: {reservationWeather.weather[0].description}</Text>
          </View>
        ) : (
          <Text>Loading weather...</Text>
        )}
        <Text>Notes: {item.notes}</Text>
        <Button
          title="View Activities"
          onPress={() => navigation.navigate('Activities', { locationName: item.location.name })}
        />
      </View>
    );
  };

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
});

export default ItineraryScreen;