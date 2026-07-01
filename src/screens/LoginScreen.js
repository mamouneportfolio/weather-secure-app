import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../validation/authSchemas';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();

  const handleLogin = async () => {
    const { error } = loginSchema.validate({ email, password }, { abortEarly: false });
    if (error) {
      const fieldErrors = {};
      error.details.forEach((d) => { fieldErrors[d.path[0]] = d.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      let message = 'Email ou mot de passe incorrect';
      if (err.code === 'auth/network-request-failed') message = 'Problème de connexion réseau';
      else if (err.code === 'auth/too-many-requests') message = 'Trop de tentatives, réessaie plus tard';
      Alert.alert('Erreur de connexion', message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Info', 'Entre ton email dans le champ ci-dessus puis réessaie');
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert('Email envoyé', 'Vérifie ta boîte mail pour réinitialiser ton mot de passe');
    } catch (err) {
      Alert.alert('Erreur', "Impossible d'envoyer l'email");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Pas de compte ? Inscris-toi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 6, color: '#111',
  },
  error: { color: 'red', marginBottom: 10, fontSize: 12 },
  button: {
    backgroundColor: '#2563eb', padding: 14, borderRadius: 8,
    alignItems: 'center', marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 16 },
});
