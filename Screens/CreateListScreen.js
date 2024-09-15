// CreateListScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList } from 'react-native';


export default function CreateListScreen() {
  const [listName, setListName] = useState('');
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  const handleAddItem = () => {
    if (item.trim()) {
      setItems([...items, item.trim()]);
      setItem('');
    }
  };

  const handleCreateList = () => {
    alert(`List "${listName}" created with ${items.length} items!`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Checklist</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter list name"
        value={listName}
        onChangeText={setListName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter item"
        value={item}
        onChangeText={setItem}
      />
      <Button
        title="Add Item"
        onPress={handleAddItem}
      />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
      <Button
        title="Create List"
        onPress={handleCreateList}
        disabled={!listName || items.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  list: {
    marginTop: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
  },
});
