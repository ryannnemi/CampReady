import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const db = firebase.firestore();
const auth = firebase.auth();

// Define pre-filled checklist templates
const templates = [
  {
    id: 'template1',
    title: 'Tent Camping',
    items: [
      { text: 'Tent', checked: false },
      { text: 'Sleeping Bag', checked: false },
      { text: 'Sleeping Pad', checked: false },
      { text: 'Pillow', checked: false },
      { text: 'Lantern', checked: false },
      { text: 'Headlamp', checked: false },
      { text: 'Lighter', checked: false },
      { text: 'Cookware', checked: false },
      { text: 'Forks', checked: false },
      { text: 'Spoons', checked: false },
      { text: 'Knives', checked: false },
      { text: 'Spatula', checked: false },
      { text: 'Tongs', checked: false },
      { text: 'Plates', checked: false },
      { text: 'Bowls', checked: false },
      { text: 'Paper Towels', checked: false },
      { text: 'Stove', checked: false },
      { text: 'Chairs', checked: false },
      { text: 'Blanket', checked: false },
      { text: 'Tarp', checked: false },
      { text: 'String', checked: false },
      { text: 'Pocket Knife', checked: false },
    ],
  },
  {
    id: 'template2',
    title: 'Hiking Gear',
    items: [
      { text: 'Hiking Boots', checked: false },
      { text: 'Hiking Socks', checked: false },
      { text: 'Water Filter', checked: false },
      { text: 'Water Bottle', checked: false },
      { text: 'Hydration Bladder', checked: false },
      { text: 'Trail Map', checked: false },
      { text: 'Hiking Poles', checked: false },
      { text: 'Snacks', checked: false },
      { text: 'Satellite Beacon', checked: false },
      { text: 'Hat', checked: false },
      { text: 'Sunscreen', checked: false },
      { text: 'Sunglasses', checked: false },
      { text: 'Rain Jacket', checked: false },
      { text: 'Camera', checked: false },
    ],
  },
  {
    id: 'template3',
    title: 'First Aid Kit',
    items: [
      { text: 'Bandages', checked: false },
      { text: 'Antiseptic', checked: false },
      { text: 'Pain Reliever', checked: false },
      { text: 'Blister Bandages', checked: false },
      { text: 'Gauze', checked: false },
      { text: 'Tweezers', checked: false },
    ],
  },
];

export default function TemplateScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ text: '', checked: false, editing: true }]);


  const handleSaveTemplate = async (template) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
  
      if (user) {
        // Add an empty editable item at the bottom of the template's items list
        const updatedItems = [
          ...template.items,
          { text: '', checked: false, editing: true } // Editable item at the bottom
        ];
  
        await addDoc(collection(db, 'checklists'), {
          title: template.title,
          items: updatedItems,
          userId: user.uid,
        });
  
        setLoading(false);
        // Navigate to the user's lists or the ListScreen
        navigation.navigate('My Lists');
      } else {
        console.log('No user is signed in');
      }
    } catch (error) {
      console.error('Error saving template: ', error);
      setLoading(false);
    }
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.templateContainer}>
      <TouchableOpacity onPress={() => handleSaveTemplate(item)} style={styles.templateButton}>
        <Text style={styles.templateTitle}>{item.title}</Text>
        <Text style={styles.templateSubtitle}>Save and customize</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select a Checklist Template</Text>
      {loading ? <Text>Saving...</Text> : (
        <FlatList
          data={templates}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  templateContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  templateButton: {
    alignItems: 'center',
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  templateSubtitle: {
    color: 'gray',
    marginTop: 5,
  },
});
