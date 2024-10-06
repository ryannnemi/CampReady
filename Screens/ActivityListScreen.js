import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

function ActivityListScreen() {
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);
    const [facilityName, setFacilityName] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 
    const apiKey = '8ac50029-c1e9-457c-93c5-eeca42881e7b';
  
    const fetchActivities = async (facilityId) => { 
      try {
        // Fetch facility details
        const nameResponse = await axios.get(
          `https://ridb.recreation.gov/api/v1/facilities/${facilityId}`,
          {
            headers: {
              apiKey: apiKey,
            },
          }
        );
  
        // Fetch facility activities
        const response = await axios.get(
          `https://ridb.recreation.gov/api/v1/facilities/${facilityId}/activities`,
          {
            headers: {
              apiKey: apiKey,
            },
          }
        );
  
        setFacilityName(nameResponse.data.FacilityName || 'Facility'); // Handle missing name
        setActivities(response.data.RECDATA || []); // Ensure activities are properly assigned
      } catch (error) {
        setError(error);
        console.error('Error fetching data:', error);
      }
    };
  
    const handleSearch = async () => {
      try {
        // Search for facilities by name or criteria
        const response = await axios.get(
          'https://ridb.recreation.gov/api/v1/facilities', 
          {
            headers: {
              apiKey: apiKey,
            },
            params: {
              query: searchQuery, 
            },
          }
        );
  
        // Check if any facilities were found
        if (response.data.RECDATA && response.data.RECDATA.length > 0) {
          const firstFacilityId = response.data.RECDATA[0].FacilityID;
          fetchActivities(firstFacilityId); // Fetch activities for the first facility
        } else {
          setError(new Error('No facilities found for the search query.'));
        }
      } catch (error) {
        setError(error);
        console.error('Error searching facilities:', error);
      }
    };
  
    const renderItem = ({ item }) => (
      <View style={styles.item}>
        <Text style={styles.activityName}>{item.FacilityActivityDescription || 'Activity'}</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Enter search criteria (e.g., Yosemite National Park)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} />
  
        {activities.length > 0 && ( 
          <>
            <Text style={styles.header}>{facilityName}</Text>
            <FlatList
              data={activities}
              renderItem={renderItem}
              keyExtractor={(item) => item.ActivityID ? item.ActivityID.toString() : Math.random().toString()} // Handle missing ActivityID
            />
          </>
        )}
      </View>
    );
  }
  
/*
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

*/

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingLeft: 10,
      marginBottom: 10,
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