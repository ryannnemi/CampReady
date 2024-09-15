// ViewListsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';


export default function ViewListsScreen({ navigation }) {
  const [lists, setLists] = useState([]);

  // Simulate fetching data from a persistent store or API
  useEffect(() => {
    // Example data; replace this with real data from AsyncStorage or backend
    const fetchedLists = [
      { id: '1', name: 'Tent Camping' },
      { id: '2', name: 'Mountain Biking' },
      { id: '3', name: 'Hiking' },
    ];
    setLists(fetchedLists);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('ListDetails', { listId: item.id })}
    >
      <Text style={styles.listItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Lists</Text>
      <FlatList
        data={lists}
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
  listItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  listItemText: {
    fontSize: 18,
  },
});
