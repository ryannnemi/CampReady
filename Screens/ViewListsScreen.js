// ViewListsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firebase from '../firebaseConfig';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const db = firebase.firestore();
const auth = firebase.auth();

export default function ViewListsScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch lists created by the authenticated user
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const user = auth.currentUser;
  
        if (user) {
          const q = query(collection(db, 'checklists'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
  
          const userLists = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          console.log('Fetched Lists:', userLists); // Log fetched data
  
          setLists(userLists);
        } else {
          console.log('No user is signed in');
        }
      } catch (error) {
        console.error('Error fetching lists: ', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLists();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('ListDetails', { listId: item.id, title: item.title })}>
      <Text style={styles.listItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Lists</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : lists.length > 0 ? (
        <FlatList
          data={lists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No lists available</Text> // If no lists are fetched, display this
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
