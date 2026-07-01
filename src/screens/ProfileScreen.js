import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getFavorites, removeFavorite, getHistory } from '../services/database';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  const loadData = async () => {
    setFavorites(await getFavorites());
    setHistory(await getHistory());
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleRemove = async (city) => {
    await removeFavorite(city);
    loadData();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon profil</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>⭐ Villes favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.city}</Text>
            <TouchableOpacity onPress={() => handleRemove(item.city)}>
              <Text style={styles.remove}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun favori</Text>}
      />

      <Text style={styles.sectionTitle}>🕒 Historique</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.city}</Text>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune recherche</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  email: { textAlign: 'center', color: '#555', marginBottom: 16 },
  logoutButton: {
    backgroundColor: '#ef4444', padding: 12, borderRadius: 8,
    alignItems: 'center', marginBottom: 24,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 8 },
  item: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  remove: { color: 'red' },
  empty: { color: '#999', fontStyle: 'italic' },
});
