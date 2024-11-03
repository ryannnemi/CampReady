import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, Linking, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';
import firebase from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
//import { GoogleGenerativeAI } from '@google/generative-ai';

const OPENWEATHER_API_KEY = 'df20576553f4a0647462495ad9f24aa7';
//const GEMINI_API_KEY = 'AIzaSyDvk9-KEX8WbW7kyOfs0Wpgh_OGMU-pJ5M';

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

  const getRecommendedItems = async (reservation) => {
    const reservationWeather = weatherData[reservation.id];
  
    if (reservationWeather && reservationWeather.weather) {
      try {
        // Extract temperature and weather conditions
        const temp = Math.round(reservationWeather.main.temp);
        const conditions = reservationWeather.weather[0].description.toLowerCase();
        let items = [];
  
        // Temperature-based recommendations
        if (temp > 75) {
          items.push("Shorts", "T-shirts", "Sunglasses", "Sunscreen", "Hat");
        } else if (temp > 50) {
          items.push("Light jacket", "Long pants", "Comfortable shoes");
        } else {
          items.push("Warm coat", "Gloves", "Hat", "Scarf", "Warm socks");
        }
  
        // Condition-based recommendations
        if (conditions.includes("rain") || conditions.includes("drizzle")) {
          items.push("Raincoat", "Umbrella", "Waterproof shoes");
        } 
        if (conditions.includes("thunderstorm")) {
          items.push("Raincoat", "Umbrella", "Waterproof shoes", "Stay indoors if possible"); 
        }
        if (conditions.includes("snow")) {
          items.push("Heavy coat", "Waterproof boots", "Warm hat", "Gloves", "Scarf");
        } 
        if (conditions.includes("clear sky") && temp > 70) {
          items.push("Sunscreen", "Sunglasses", "Hat");
        } 
        if (conditions.includes("clouds")) {
          items.push("Light jacket");
        } 
        if (conditions.includes("fog")) {
          items.push("Be cautious while driving"); 
        } 
        if (conditions.includes("windy")) {
          items.push("Windbreaker or jacket", "Secure loose items"); 
        }        
  
        // Fetch activities for the location
        const activitiesResponse = await axios.get(
          'https://ridb.recreation.gov/api/v1/recareas',
          {
            headers: { apiKey: '8ac50029-c1e9-457c-93c5-eeca42881e7b' },
            params: { query: reservation.location.name },
          }
        );
  
        if (activitiesResponse.data.RECDATA && activitiesResponse.data.RECDATA.length > 0) {
          // Filter for an exact match (case-insensitive)
          const filteredRecAreas = activitiesResponse.data.RECDATA.filter(recArea =>
            recArea.RecAreaName && recArea.RecAreaName.toLowerCase().startsWith(reservation.location.name.toLowerCase())
          );
  
          if (filteredRecAreas.length > 0) {
            const firstRecArea = filteredRecAreas[0];
            const firstRecAreaId = firstRecArea.RecAreaID;
  
            // Fetch activities for the first recreation area
            const detailedActivitiesResponse = await axios.get(
              `https://ridb.recreation.gov/api/v1/recareas/${firstRecAreaId}/activities`,
              {
                headers: { apiKey: '8ac50029-c1e9-457c-93c5-eeca42881e7b' },
              }
            );
  
            // Extract activity names
            const activityNames = detailedActivitiesResponse.data.RECDATA.map(activity => activity.ActivityName);
            const normalizedActivityNames = activityNames.map(activity => activity.trim().toLowerCase());
  
            // Activity-based recommendations
            if (normalizedActivityNames.includes("hiking")) {
              items.push("Hiking boots", "Backpack", "Water bottle", "Hiking Poles");
            }
            if (normalizedActivityNames.includes("swimming")) {
              items.push("Swimsuit", "Towel", "Goggles");
            }
            if (normalizedActivityNames.includes("camping")) {
              items.push("Tent", "Sleeping bag", "Camp stove");
            }  
            if (activityNames.includes("Fishing")) {
              items.push("Fishing rod", "Tackle box", "Bait", "Fishing license");
            }
            if (activityNames.includes("Boating")) {
              items.push("Life jacket", "Sunscreen", "Hat", "Sunglasses", "Waterproof bag");
            }
            if (activityNames.includes("Horseback riding")) {
              items.push("Long pants", "Closed-toe shoes", "Helmet", "Gloves");
            }
            if (activityNames.includes("Paddling")) {
              items.push("Life jacket", "Water shoes", "Dry bag", "Sunscreen");
            }          
  
            // Navigate to CreateListScreen with the recommended items
            navigation.navigate('Create List', {
              listName: `Packing List for ${reservation.location.name}`,
              initialItems: items,
            });
          } else {
            console.warn('No recreation areas found with that name.');
          }
        } else {
          console.warn('No recreation areas found for the location name.');
        }
      } catch (error) {
        console.error('Error fetching recommended items:', error);
      }
    } else {
      console.log('Weather data not yet available for this reservation.');
    }
  };  
  
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

    const openNavigationApp = () => {
      const { latitude, longitude } = item.location; 
      const url = Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}`,
      });
  
      Linking.openURL(url);
    };

    return (
      <View style={styles.itemContainer}>
        <View style={styles.leftContainer}>
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
        </View>
        <View style={styles.iconButtonContainer}>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={openNavigationApp}>
            <Ionicons name="navigate" color="black" size={40} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}  
            onPress={() => getRecommendedItems(item)}>
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