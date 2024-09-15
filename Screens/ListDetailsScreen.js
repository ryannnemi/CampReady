// ListDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';


export default function ListDetailsScreen({ route }) {
  const { listId } = route.params;
  const [listDetails, setListDetails] = useState([]);

  useEffect(() => {
    // Simulate fetching list details based on listId
    const fetchedDetails = [
      { id: '1', name: 'Milk' },
      { id: '2', name: 'Bread' },
      { id: '3', name: 'Eggs' },
    ];
    setListDetails(fetchedDetails);
  }, [listId]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Details</Text>
      <FlatList
        data={listDetails}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 18,
  },
});
