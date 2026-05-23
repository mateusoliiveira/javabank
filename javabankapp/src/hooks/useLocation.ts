import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import * as Device from 'expo-device';

import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return null;
    }

    let loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    
    setLocation(loc);
    return loc;
  }

  useEffect(() => {
    if (currentUser?.settings?.find(s => s.key === 'ANTIFRAUD_ENABLED')?.value === 'true') {
      getCurrentLocation(); 
    }
  }, [currentUser]);

  return { location, errorMsg, getCurrentLocation };
}