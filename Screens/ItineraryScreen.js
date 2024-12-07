// ItineraryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Linking, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';
import firebase from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns'
import { getRecommendedItems } from '../Functions/getRecommendedItems';
import { openNavigationApp } from '../Functions/openNavigationApp';

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
   
  useEffect(() => {
    const fetchRecommendations = async () => { 
      // Create a Set to store unique reservation IDs
      const processedReservations = new Set();

      await Promise.all(dailyItinerary.map(async (item) => { 
        const reservationWeather = weatherData[item.id];
        const reservationId = item.id;
        // Check if this reservation has already been processed
        if (!processedReservations.has(reservationId)) {          
          processedReservations.add(reservationId);
        }
      }));
    };


    fetchRecommendations(); 
  }, [weatherData, dailyItinerary]);

  // Render each reservation item
  const renderItem = ({ item }) => {
    const reservationWeather = weatherData[item.id];    

    return (
      <View style={styles.itemContainer}>
        <View style={styles.leftContainer}>
          <Text>Location: {item.location.name}</Text>
          <Text>Start: {format(item.startDate, 'HH:mm')}</Text>

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
        </View>
        <View style={styles.iconButtonContainer}>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => openNavigationApp(item)}>
            <Ionicons name="navigate" color="black" size={40} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => getRecommendedItems(item, weatherData, navigation)}>
            <Ionicons name="create" color="black" size={40} />            
          </TouchableOpacity>

          <TouchableOpacity             
            style={styles.iconButton}  
            onPress={() => navigation.navigate('Activities', { locationName: item.location.name })}>
            <Ionicons name="bicycle" color="black" size={40} />
          </TouchableOpacity>          
        </View>  
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'left',
    flex: 1,
  },
  iconButton: {
    marginLeft: 20,
  },
  iconButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
});


export default ItineraryScreen;