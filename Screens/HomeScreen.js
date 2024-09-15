// HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>HomeScreen</Text>
      <Button
        title="Create List"
        onPress={() => navigation.navigate('CreateList')}
        style={styles.button}
      />
      <Button
        title="View List"
        onPress={() => navigation.navigate('ViewLists')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
  },
});
