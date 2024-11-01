// ViewListsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import firebase from '../firebaseConfig';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const db = firebase.firestore();
const auth = firebase.auth();

export default function ViewListsScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch lists created by the authenticated user
    const fetchLists = useCallback(async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
  
        if (user) {
          const q = query(collection(db, 'checklists'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
  
          const userLists = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setLists(userLists);
        } else {
          console.log('No user is signed in');
        }
      } catch (error) {
        console.error('Error fetching lists: ', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);
  
    useEffect(() => {
      fetchLists();
    }, [fetchLists]);

    // Function to delete a list
    const handleDeleteList = async (listId) => {
      try {
        await deleteDoc(doc(db, 'checklists', listId));
        setLists(lists.filter((list) => list.id !== listId));
      } catch (error) {
        console.error('Error deleting list: ', error);
      }
    };
  
    // Confirm before deleting the list
    const confirmDelete = (listId) => {
      Alert.alert(
        "Delete List",
        "Are you sure you want to delete this list?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => handleDeleteList(listId) }
        ]
      );
    };

    const renderItem = ({ item }) => (
      <View style={styles.listItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate('List', { listId: item.id, title: item.title })}
          style={{ flex: 1 }}
        >
          <Text style={styles.listItemText}>{item.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}> 
          <Icon name="trash" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Lists</Text>
      
      <Button
        title="Create New List"
        onPress={() => navigation.navigate('Create List')}
      />

      {loading ? (
        <Text>Loading...</Text>
      ) : lists.length > 0 ? (
        <FlatList
          data={lists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              fetchLists();
            }} />
          }
        />
      ) : (
        <Text>No lists available</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  listItemText: {
    fontSize: 18,
    flex: 1,
  },
});
