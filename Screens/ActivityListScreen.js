import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';   


function ActivityListScreen() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [facilityName, setFacilityName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); 
  const apiKey = '8ac50029-c1e9-457c-93c5-eeca42881e7b';

  const handleSearch = async () => {
    setError(null);
    try {
      const response = await axios.get(
        'https://ridb.recreation.gov/api/v1/recareas',
        {
          headers: {
            apiKey: apiKey,
          },
          params: {
            query: searchQuery,
          },
        }
      );
  
      console.log('Full Rec Area Search Response:', response.data);
  
      if (response.data.RECDATA && response.data.RECDATA.length > 0) {
        console.log('Unfiltered Rec Areas:', response.data.RECDATA);
  
        // Filter for exact match (case-insensitive)
        const filteredRecAreas = response.data.RECDATA.filter(recArea =>
          recArea.RecAreaName && recArea.RecAreaName.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
  
        console.log('Filtered Rec Areas:', filteredRecAreas);
  
        if (filteredRecAreas.length > 0) {
          const firstRecArea = filteredRecAreas[0];
          const firstRecAreaId = firstRecArea.RecAreaID;
          setFacilityName(firstRecArea.RecAreaName || 'Rec Area'); // Update variable name if needed
  
          console.log('First Rec Area ID:', firstRecAreaId);
  
          // Fetch activities for the first rec area
          const activitiesResponse = await axios.get(
            `https://ridb.recreation.gov/api/v1/recareas/${firstRecAreaId}/activities`, 
            {
              headers: {
                apiKey: apiKey,
              },
            }
          );
  
          console.log('Activities Response:', activitiesResponse.data);
          setActivities(activitiesResponse.data.RECDATA || []);
        } else {
          setActivities([]);
          setError(new Error('No recreation areas found with that exact name.'));
        }
      } else {
        setActivities([]);
        setError(new Error('No recreation areas found for the search query.'));
      }
    } catch (error) {
      setError(error);
      console.error('Error searching rec areas:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.activityName}>
        {item.ActivityName 
          ? item.ActivityName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) 
          : 'Activity'} 
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
          style={styles.input}
          placeholder="Enter search criteria (e.g., Yosemite National Park)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} />

      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

      {activities.length > 0 ? ( 
        <>
          <Text style={styles.header}>{facilityName}</Text>
          <FlatList
            data={activities}
            renderItem={renderItem}
            keyExtractor={(item, index) => 
              item.ActivityID ? item.ActivityID.toString() : index.toString() 
            } 
          />
        </>
      ) : (
        searchQuery !== '' && !error && ( // Show "No activities" only after a search
          <Text>No activities found for your query.</Text> 
        )
      )}
    </View>
  );
}

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