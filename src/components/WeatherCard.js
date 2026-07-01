import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WeatherCard({ weather }) {
  if (!weather) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.city}>{weather.name}</Text>
      <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
      <Text style={styles.desc}>{weather.weather[0].description}</Text>
      <View style={styles.row}>
        <Text style={styles.detail}>💧 Humidité : {weather.main.humidity}%</Text>
        <Text style={styles.detail}>💨 Vent : {weather.wind.speed} m/s</Text>
      </View>
      <Text style={styles.detail}>🌡️ Ressenti : {Math.round(weather.main.feels_like)}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eff6ff', borderRadius: 16, padding: 20,
    alignItems: 'center', marginVertical: 16,
  },
  city: { fontSize: 22, fontWeight: 'bold' },
  temp: { fontSize: 48, fontWeight: 'bold', marginVertical: 8 },
  desc: { fontSize: 16, color: '#555', textTransform: 'capitalize', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8 },
  detail: { fontSize: 14, color: '#333' },
});
