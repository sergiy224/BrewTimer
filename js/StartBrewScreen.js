/**
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  Alert,
} from 'react-native';
import Counter from 'react-native-counters';
import {Stopwatch} from 'react-native-stopwatch-timer';
import AsyncStorage from '@react-native-community/async-storage';

export default function StartBrewScreen() {
  // Vars to hold brew stats. Initial state matches hardcoded start values
  const [bean, setBean] = useState('philz');
  const [dose, setDose] = useState(8);
  const [grind, setGrind] = useState(6);
  const [brewTime, setBrewTime] = useState(0);
  const [brewRatio, setBrewRatio] = useState(0);
  const [stopwatchStart, setStopwatchStart] = useState(false);
  const [stopwatchReset, setStopwatchReset] = useState(false);

  const stopwatchOptions = {
    container: {
      backgroundColor: '#000',
      padding: 5,
      borderRadius: 5,
      width: 220,
    },
    text: {
      fontSize: 30,
      color: '#FFF',
      marginLeft: 7,
    },
  };

  const saveData = async () => {
    try {
      // A very crude storage mechanism:
      // 1. Store a counter which is "the number of brews in brew history"
      // 2. Increment that counter
      // 3. Store a new brew at that increment
      const brewHistoryCount = await AsyncStorage.getItem('brewHistoryCount');
      let brewHistoryCountInt;
      if (!brewHistoryCount) {
        // First run
        await AsyncStorage.setItem('brewHistoryCount', '0');
        brewHistoryCountInt = 0;
      } else {
        // Increment counter
        brewHistoryCountInt = parseInt(brewHistoryCount, 10);
        brewHistoryCountInt++;
        await AsyncStorage.setItem(
          'brewHistoryCount',
          brewHistoryCountInt.toString(),
        );
      }

      // Store a new brew
      const newBrewKey = 'brewHistory' + brewHistoryCountInt;
      const newBrewObject = {
        bean: bean,
        dose: dose,
        grind: grind,
        brewTime: brewTime,
        brewRatio: brewRatio,
      };
      await AsyncStorage.setItem(newBrewKey, JSON.stringify(newBrewObject));
    } catch (e) {
      console.log(e);
      Alert.alert('Save unsuccessful :(');
      return;
    } finally {
      setStopwatchReset(true);
    }

    //Save success! Show an alert.
    Alert.alert('Save successful');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.rowStyle}>
          <Text>Bean</Text>
          <RNPickerSelect
            onValueChange={(value) => setBean(value)}
            items={[
              {label: 'Philz Decaf', value: 'philz'},
              {label: 'Peets', value: 'peets'},
            ]}
            placeholder={{}}
          />
        </View>
        <View style={styles.rowStyle}>
          <Text>Dose</Text>
          <Counter
            start={8}
            max={40}
            onChange={(number, type) => setDose(number)}
          />
        </View>
        <View style={styles.rowStyle}>
          <Text>Grind</Text>
          <Counter
            start={6}
            max={100}
            onChange={(number, type) => setGrind(number)}
          />
        </View>
        <Button
          onPress={() => {
            setStopwatchReset(false);
            setStopwatchStart(!stopwatchStart);
          }}
          title={'Start Brew'}
        />
        <Button
          onPress={() => {
            setStopwatchReset(true);
          }}
          title={'Clear Timer'}
        />
        <Stopwatch
          laps
          msecs
          start={stopwatchStart}
          reset={stopwatchReset}
          options={stopwatchOptions}
          getTime={(time) => {
            setBrewTime(time);
          }}
        />
        <View style={styles.rowStyle}>
          <Button
            onPress={() => {
              setStopwatchStart(false);
              setBrewRatio(1);
            }}
            title={'1:1'}
          />
          <Button
            onPress={() => {
              setStopwatchStart(false);
              setBrewRatio(2);
            }}
            title={'2:1'}
          />
          <Button
            onPress={() => {
              setStopwatchStart(false);
              setBrewRatio(3);
            }}
            title={'3:1'}
          />
        </View>
        <Button
          onPress={() => {
            console.log(
              'Saving brew with stats: \nBean - ' +
                bean +
                '\nDose - ' +
                dose +
                '\nGrind - ' +
                grind +
                '\nBrew Time ' +
                brewTime +
                '\nBrew Ratio ' +
                brewRatio,
            );
            saveData();
          }}
          title={'Save to Brew History'}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 10,
  },
});
