# Weather Secure App

Application météo React Native (Expo SDK 54) avec authentification Firebase, stockage local SQLite et validation de formulaires Joi.

## Fonctionnalités

- **Authentification Firebase** : inscription, connexion, déconnexion, réinitialisation de mot de passe
- **Validation Joi** : email valide, mot de passe fort (8+ caractères, 1 majuscule, 1 chiffre), confirmation de mot de passe
- **Météo (OpenWeather)** : météo actuelle par géolocalisation, recherche par ville, détails (température, ressenti, humidité, vent, pression, nébulosité)
- **SQLite local** : historique des recherches, villes favorites
- **Navigation protégée** : les écrans Dashboard/Recherche/Profil ne sont accessibles qu'après connexion (React Navigation, 6 écrans : Login, Register, Dashboard, Recherche, Détail météo, Profil)
- **Gestion des erreurs** : ville introuvable, erreurs réseau/timeout, champs de formulaire invalides, erreurs Firebase (email déjà utilisé, mauvais identifiants, etc.)

## Prérequis

- Node.js 18+
- L'app Expo Go installée sur ton téléphone (Android/iOS), sur le même réseau Wi-Fi que l'ordinateur — sinon utilise le mode tunnel (voir plus bas)

## Installation

npm install

## Configuration (Firebase + OpenWeather)

Toute la configuration se fait via le fichier .env à la racine (non commité dans git). Les clés doivent obligatoirement commencer par EXPO_PUBLIC_ pour qu'Expo les injecte dans le bundle :

EXPO_PUBLIC_OPENWEATHER_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
EXPO_PUBLIC_FIREBASE_APP_ID=xxx

- Firebase : dans la console Firebase, active Authentication > Sign-in method > Email/Password, puis copie les valeurs depuis Paramètres du projet > Général > Vos applications > Config.
- OpenWeather : clé API disponible sur openweathermap.org/api (compte gratuit).

Après toute modification du .env, redémarre le serveur Expo (les variables sont injectées au démarrage, pas à chaud).

## Lancer l'application

npx expo start

Scanne le QR code avec Expo Go (Android : scanner intégré à l'app Expo Go ; iOS : appareil photo).

### En cas d'erreur "the request timed out" sur le téléphone

Ça signifie que le téléphone n'arrive pas à joindre le serveur Metro (souvent : réseaux Wi-Fi différents, réseau isolé type résidence étudiante, ou pare-feu). Solution : le mode tunnel, qui passe par un relais externe au lieu du réseau local.

npx expo start --tunnel

## Structure du projet

App.js                     Point d'entrée : init SQLite puis rend AuthProvider + AppNavigator
src/
  context/AuthContext.js   Contexte Firebase Auth (login, register, logout, resetPassword, user, loading)
  navigation/AppNavigator.js  Navigation (Auth stack si déconnecté, Tabs sinon)
  screens/
    LoginScreen.js
    RegisterScreen.js
    DashboardScreen.js      Météo par géolocalisation au chargement
    SearchScreen.js         Recherche météo par ville + ajout favoris
    WeatherDetailScreen.js  Détails complets d'une météo
    ProfileScreen.js        Infos utilisateur, déconnexion, favoris, historique
  components/WeatherCard.js
  services/
    firebaseConfig.js       Initialisation Firebase (Auth + persistance AsyncStorage)
    api.js                  Appels OpenWeather (avec timeout et gestion d'erreurs)
    database.js             SQLite (historique, favoris)
  validation/authSchemas.js Schémas Joi (login, register)

## Notes techniques

- Ce projet utilise React Navigation (pas expo-router) : le point d'entrée (package.json → main) pointe vers App.js, pas vers un dossier app/.
- Les variables d'environnement utilisent le préfixe EXPO_PUBLIC_, le mécanisme intégré d'Expo SDK 54 (pas besoin de plugin Babel dédié).

## Documentation — Sécurité des formulaires (Joi)

La validation des formulaires d'authentification repose sur des schémas Joi définis dans src/validation/authSchemas.js, appliqués côté client avant tout appel à Firebase :

- Email : format vérifié avec Joi.string().email(), nettoyage automatique des espaces (trim())
- Mot de passe (inscription) : minimum 8 caractères, doit contenir au moins une majuscule et un chiffre (regex Joi.pattern)
- Confirmation de mot de passe : doit être strictement identique au mot de passe (Joi.ref('password'))
- Champs obligatoires : tous les champs sont required(), un champ vide déclenche un message d'erreur explicite
- Messages d'erreur : chaque règle a un message personnalisé en français, affiché directement sous le champ concerné dans l'interface
- Protection : la validation Joi s'exécute avant tout appel réseau à Firebase — si les données sont invalides, aucune requête n'est envoyée, ce qui évite les soumissions incohérentes et réduit la charge inutile sur le backend

## Documentation — Gestion des données (Firebase et SQLite)

Firebase (données utilisateur et session)
- Authentification gérée par Firebase Auth (src/services/firebaseConfig.js), avec persistance de session via AsyncStorage pour rester connecté entre les ouvertures de l'app
- Le contexte AuthContext.js expose l'utilisateur courant à toute l'application et écoute les changements d'état de connexion (onAuthStateChanged)
- Aucune donnée météo n'est stockée dans Firebase : il gère uniquement l'identité et la session de l'utilisateur

SQLite (données locales)
- Base de données locale créée avec expo-sqlite (src/services/database.js), avec deux tables : history (historique des recherches) et favorites (villes favorites)
- Ces données sont propres à l'appareil et persistent même hors connexion
- Les écrans Recherche et Profil lisent/écrivent directement dans SQLite via des fonctions asynchrones (addToHistory, addFavorite, getFavorites, etc.)
