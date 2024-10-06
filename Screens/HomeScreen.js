// HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>HomeScreen</Text>
      <View style={styles.buttonContainer}>
        <Button title="View List" onPress={() => navigation.navigate('ViewLists')}/>
        <View style={styles.spacer} />
        <Button title="Templates" onPress={() => navigation.navigate('Template')}/>
        <View style={styles.spacer} />
        <Button title="Activities" onPress={() => navigation.navigate('Activity')}/>
        <View style={styles.spacer} />
        <Button title="Reservations" onPress={() => navigation.navigate('Reservation')}/>
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
  }
});
