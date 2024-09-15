// HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>HomeScreen</Text>
      <View style={styles.buttonContainer}>
        <Button title="Create List" onPress={() => navigation.navigate('CreateList')}/>
        <View style={styles.spacer} /> 
        <Button title="View List" onPress={() => navigation.navigate('ViewLists')}/>
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
