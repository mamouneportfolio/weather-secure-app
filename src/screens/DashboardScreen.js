import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { getWeatherByCoords, getWeatherByCity } from '../services/api';
import WeatherCard from '../components/WeatherCard';
import { addToHistory } from '../services/database';

export default function DashboardScreen() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDefaultWeather();
  }, []);

  const loadDefaultWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const data = await getWeatherByCoords(location.coords.latitude, location.coords.longitude);
        setWeather(data);
        await addToHistory(data.name);
      } else {
        const data = await getWeatherByCity('Paris');
        setWeather(data);
        await addToHistory(data.name);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de la météo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Météo actuelle</Text>
      {loading && <ActivityIndicator size="large" style={{ marginTop: 30 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && weather && <WeatherCard weather={weather} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  error: { color: 'red', marginTop: 20, textAlign: 'center' },
});
