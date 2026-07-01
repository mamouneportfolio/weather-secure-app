import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WeatherDetailScreen({ route }) {
  const weather = route.params?.weather;

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.desc}>Aucune donnée météo à afficher.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.city}>{weather.name}, {weather.sys?.country}</Text>
      <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
      <Text style={styles.desc}>{weather.weather[0].description}</Text>

      <View style={styles.section}>
        <Text style={styles.row}>Température ressentie : {Math.round(weather.main.feels_like)}°C</Text>
        <Text style={styles.row}>Min / Max : {Math.round(weather.main.temp_min)}°C / {Math.round(weather.main.temp_max)}°C</Text>
        <Text style={styles.row}>Humidité : {weather.main.humidity}%</Text>
        <Text style={styles.row}>Pression : {weather.main.pressure} hPa</Text>
        <Text style={styles.row}>Vent : {weather.wind.speed} m/s</Text>
        <Text style={styles.row}>Nébulosité : {weather.clouds?.all}%</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, alignItems: 'center' },
  city: { fontSize: 26, fontWeight: 'bold' },
  temp: { fontSize: 50, fontWeight: 'bold', marginVertical: 10 },
  desc: { fontSize: 18, color: '#555', textTransform: 'capitalize', marginBottom: 20 },
  section: { width: '100%', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 16 },
  row: { fontSize: 15, marginBottom: 8 },
});
