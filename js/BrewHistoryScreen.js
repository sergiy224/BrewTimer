/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default function BrewHistoryScreen() {
  const [brewHistoryCount, setBrewHistoryCount] = useState(0);
  const [brews, setBrews] = useState(null);

  useEffect(() => {
    getBrewHistoryCount();
  }, [brewHistoryCount]);

  // Fetch the count of saved brews.
  const getBrewHistoryCount = async () => {
    let brewHistoryCountString = await AsyncStorage.getItem('brewHistoryCount');
    setBrewHistoryCount(parseInt(brewHistoryCountString, 10));
    getBrewHistory();
  };

  // Build a key array and fetch all the saved brews.
  const getBrewHistory = async () => {
    let keys = [];
    for (let i = 0; i <= brewHistoryCount; i++) {
      keys[i] = 'brewHistory' + i.toString();
    }
    let fetchedBrews = await AsyncStorage.multiGet(keys);
    setBrews(fetchedBrews);
  };

  // Render all the saved brews.
  const renderBrews = () => {
    return (
      <>
        <View style={styles.rowStyle}>
          <Text>Bean</Text>
          <Text>Grind</Text>
          <Text>In (g)</Text>
          <Text>Out (g)</Text>
          <Text>Brew Time</Text>
        </View>
        {brews.map((tuple) => {
          // Brews are in format [ [key, value], [key, value] ]. Map iterates through the tuples.
          // Extract the value.
          const value = JSON.parse(tuple[1]);
          if (value) {
            return (
              <View key={tuple[0]} style={styles.rowStyle}>
                <Text>{value.bean}</Text>
                <Text>{value.grind}</Text>
                <Text>{value.dose}</Text>
                <Text>{value.dose * value.brewRatio}</Text>
                <Text>{value.brewTime}</Text>
              </View>
            );
          } else {
            return null;
          }
        })}
      </>
    );
  };

  return <SafeAreaView>{brews ? renderBrews() : null}</SafeAreaView>;
}

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
