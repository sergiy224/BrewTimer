/**
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {SafeAreaView, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default function SettingsScreen() {
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log(e);
    }
    console.log('Async storage cleared.');
  };

  return (
    <SafeAreaView>
      <Button
        title="Clear all brews"
        onPress={() => {
          clearAsyncStorage();
        }}
      />
    </SafeAreaView>
  );
}
