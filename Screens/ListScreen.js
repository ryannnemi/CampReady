// ListScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firebase from '../firebaseConfig';
import { getFirestore, collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import Checkbox from 'expo-checkbox';

const db = firebase.firestore();
const auth = firebase.auth();

export default function ListScreen({ route, navigation }) {
  const { listId } = route.params || {}; 
  const [listName, setListName] = useState('');
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListDetails = async () => {
      if (listId) {
        try {
          const docRef = doc(db, 'checklists', listId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const listData = docSnap.data();
            setListName(listData.title || 'Untitled List');
            setItems(listData.items || []);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching list details: ', error);
        }
      }
      setLoading(false);
    };

    fetchListDetails();
  }, [listId]);

  /// Save or update the list in Firestore only if there are changes
  const handleSaveList = async () => {
    if (!listId) return; // Skip saving if there's no listId
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'checklists', listId);
        await updateDoc(docRef, {
          title: listName,
          items,
        });
      } else {
        console.log('No user is signed in');
      }
    } catch (error) {
      console.error('Error saving list: ', error);
    }
  };

  useEffect(() => {
    return () => {
      // Save the list only when navigating away
      handleSaveList();
    };
  }, [listName, items]);

  const handleItemChange = (text, index) => {
    const updatedItems = [...items];
    updatedItems[index].text = text;

    // If the text input is not empty and is the last item, add a new empty item
    if (text.trim() !== '' && index === items.length - 1) {
      updatedItems.push({ text: '', checked: false });
    }

    setItems(updatedItems);
  };

  const handleToggleEdit = (index) => {
    const updatedItems = [...items];
    updatedItems[index].editing = !updatedItems[index].editing;
    setItems(updatedItems);
  };

  const handleItemCheck = (newValue, index) => {
    const updatedItems = [...items];
    updatedItems[index].checked = newValue;
    setItems(updatedItems);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <View style={styles.leftContainer}>
        <Checkbox
          value={item.checked}
          onValueChange={(newValue) => handleItemCheck(newValue, index)}
          style={styles.checkbox}
        />
        {item.editing ? (
          <TextInput
            style={styles.input}
            value={item.text}
            onChangeText={(text) => handleItemChange(text, index)}
            onBlur={() => item.editing && setItems(items.map((i, idx) => (idx === index ? { ...i, editing: false } : i)))}
            autoFocus={true}
            placeholder="Enter item"
          />
        ) : (
          <TouchableOpacity
            style={styles.itemTextContainer}
            onPress={() => handleToggleEdit(index)}
          >
            <Text style={[
              item.checked ? styles.itemTextChecked : styles.itemText,
              { color: item.text ? 'black' : 'gray' }  // Conditional color
            ]}>
              {item.text || 'Tap to edit'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={() => handleDeleteItem(index)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <TextInput
            style={styles.listTitle}
            placeholder="Enter list name"
            value={listName}
            onChangeText={setListName}
          />
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.listContainer}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  listTitle: {
    fontSize: 24,
    marginBottom: 20,
    padding: 10,
  },
  input: {
    padding: 10,
    marginBottom: 10,
  },
  listContainer: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'left',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    marginLeft: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'gray',
    fontWeight: 'bold',
  },
});
