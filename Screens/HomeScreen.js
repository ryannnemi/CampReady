// HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Home Screen</Text> 
      </View>
      <View style={styles.buttonContainer}>
        <Button title="View List" onPress={() => navigation.navigate('ViewLists')} />
        <View style={styles.spacer} />
        <Button title="Templates" onPress={() => navigation.navigate('Templates')} />
        <View style={styles.spacer} />
        <Button title="Activities" onPress={() => navigation.navigate('Activities')} />
        <View style={styles.spacer} />
        <Button title="Reservations" onPress={() => navigation.navigate('Reservations')} />
        <View style={styles.spacer} />
        <Button title="Itinerary" onPress={() => navigation.navigate('Itinerary')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  spacer: {
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0', 
  },
  headerText: {
    marginLeft: 10,
    fontSize: 18,
  },
});
