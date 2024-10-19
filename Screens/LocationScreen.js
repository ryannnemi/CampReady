import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';   
 

const LocationScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>   

      <GooglePlacesAutocomplete
        placeholder='Search for a location'
        onPress={(data, details = null) => {
          if (details && details.geometry && details.geometry.location) {
            const selectedLocation = {
              name: details.name,
              address: details.formatted_address,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng   

            };

            navigation.navigate('AddReservation', { location: selectedLocation }); 
          }
        }}
        query={{
          key: 'AIzaSyCgOZfEz_a58wrMoHliVwght6Bu1AznFzo',
          language: 'en',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
});

export default LocationScreen;