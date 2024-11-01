// CreateListScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import firebase from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Checkbox from 'expo-checkbox';
import Icon from 'react-native-vector-icons/FontAwesome';

const db = firebase.firestore();
const auth = firebase.auth();

export default function CreateListScreen({ route, navigation }) {
  const { listName: initialListName, initialItems } = route.params || {};
  const [listName, setListName] = useState(initialListName || '');
  const [items, setItems] = useState(
    initialItems 
      ? initialItems.map(item => ({ text: item, checked: false, editing: false }))
      : [{ text: '', checked: false, editing: true }]
  );

  const handleCreateList = async () => {
    try {
      const user = auth.currentUser; 
      if (user) {
        await addDoc(collection(db, 'checklists'), {
          title: listName,
          items,
          userId: user.uid,
        });
        setListName('');
        setItems([{ text: '', checked: false, editing: true }]);        
      } else {
        console.log('No user is signed in');
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    navigation.navigate('My Lists')
  };

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
              { color: item.text ? 'black' : 'gray' }
            ]}>
              {item.text || 'Tap to edit'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={() => handleDeleteItem(index)} style={styles.deleteButton}>
        <Icon name="trash" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
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
      />
      <Button
        title="Create List"
        onPress={handleCreateList}
        disabled={!listName || items.every(item => !item.text.trim())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  listTitle: {
    fontSize: 20,
    marginBottom: 20,
    padding: 10,
  },
  placeholderText: {
    fontSize: 18,
    color: 'gray',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemText: {
    fontSize: 18,
  },
  itemTextChecked: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'gray',
    fontWeight: 'bold',
  },
});