import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { getWeatherByCity } from '../services/api';
import WeatherCard from '../components/WeatherCard';
import { addToHistory, addFavorite } from '../services/database';

export default function SearchScreen({ navigation }) {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
      await addToHistory(data.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    if (weather) {
      await addFavorite(weather.name);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rechercher une ville</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="Nom de la ville"
      />
      <Button title="Rechercher" onPress={handleSearch} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {weather && (
        <>
          <WeatherCard weather={weather} />
          <TouchableOpacity style={styles.favButton} onPress={handleAddFavorite}>
            <Text style={styles.favText}>⭐ Ajouter aux favoris</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('WeatherDetail', { weather })}
          >
            <Text style={styles.favText}>Voir les détails</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 10,
  },
  error: { color: 'red', marginTop: 20, textAlign: 'center' },
  favButton: {
    backgroundColor: '#facc15', padding: 12, borderRadius: 8,
    alignItems: 'center', marginTop: 10,
  },
  detailButton: {
    backgroundColor: '#2563eb', padding: 12, borderRadius: 8,
    alignItems: 'center', marginTop: 10,
  },
  favText: { fontWeight: 'bold' },
});
