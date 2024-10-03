import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

function ActivityListScreen() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [facilityName, setFacilityName] = useState([]);
  const apiKey = '8ac50029-c1e9-457c-93c5-eeca42881e7b';
  const facilityId = '233115';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nameResponse = await axios.get(
            `https://ridb.recreation.gov/api/v1/facilities/${facilityId}`,
            {
              headers: {
                apiKey: apiKey,
              },
            }
          );
        const response = await axios.get(
          `https://ridb.recreation.gov/api/v1/facilities/${facilityId}/activities`,
          {
            headers: {
              apiKey: apiKey,
            },
          }
        );
        setFacilityName(nameResponse.data.FacilityName);
        console.log('Facility Name: ', nameResponse.data.FacilityName);

        setActivities(response.data.RECDATA || []); 
        console.log('API Response: ', response.data);
      } catch (error) {
        setError(error);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [facilityId, apiKey]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.activityName}>{item.FacilityActivityDescription}</Text>
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
      <Text style={styles.header}>{facilityName}</Text>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.ActivityID.toString()} 
      />
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
  activityName: {
    fontSize: 16,
  },
});

export default ActivityListScreen;