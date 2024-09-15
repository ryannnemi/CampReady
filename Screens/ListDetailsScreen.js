// ListDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, CheckBox } from 'react-native';
import firebase from '../firebaseConfig';
import {  getFirestore, doc, getDoc } from 'firebase/firestore';

const db = firebase.firestore();


export default function ListDetailsScreen({ route }) {
  const { listId } = route.params; // Get the listId from the navigation params
  const [listDetails, setListDetails] = useState([]);
  const [listName, setListName] = useState('');
  const [loading, setLoading] = useState(true);
  

  // Fetch the list details from Firestore based on the listId
  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const docRef = doc(db, 'checklists', listId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const listData = docSnap.data();
          console.log('Fetched List:', listData);

          setListDetails(listData.items || []); 
          setListName(listData.title || 'Untitled List');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching list details: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [listId]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{listName}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : listDetails.length > 0 ? (
        <FlatList
          data={listDetails}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No items found in this list.</Text>
      )}
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