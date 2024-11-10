// getRecommendedItems.js
import axios from 'axios';
import { Alert } from 'react-native';

export const getRecommendedItems = async (reservation, weatherData, navigation) => {
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
          items.push("Raincoat", "Umbrella", "Waterproof shoes"); 
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
          items.push("Warm coat", "Warm socks"); 
        } 
        if (conditions.includes("windy")) {
          items.push("Windbreaker"); 
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
      Alert.alert('No weather data available');
    }
  };